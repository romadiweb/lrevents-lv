import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCmsSection, sections } from "@/lib/cms/config";
import { isUuid, validateRecord } from "@/lib/cms/validation";

function fail(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
function databaseMessage(code?: string) {
  if (code === "23505") return "Šāds ieraksts vai lapas adrese jau pastāv.";
  if (code === "23503") return "Ieraksts ir saistīts ar citu saturu. Vispirms maini saistītos ierakstus.";
  if (code === "PGRST205" || code === "42P01") return "CMS datubāzes migrācija vēl nav piemērota.";
  return "Neizdevās saglabāt izmaiņas. Mēģini vēlreiz.";
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ section: string }> }) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return fail("Nederīgs pieprasījums.", 403);
  const identity = await getCmsIdentity();
  if (!identity) return fail("Lūdzu, pieslēdzies vēlreiz.", 401);
  const { section } = await params;
  if (!isCmsSection(section)) return fail("Sadaļa nav atrasta.", 404);
  if (Number(request.headers.get("content-length") ?? 0) > 150000) return fail("Pieprasījums ir pārāk liels.", 413);
  try {
    const input = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) return fail("Nederīgi dati.");
    const id = input.id;
    if (id && !isUuid(id)) return fail("Nederīgs ieraksts.");
    const client = section === "lietotaji" ? createAdminClient() : identity.client;
    if (input.action === "delete") {
      if (!id) return fail("Izvēlies ierakstu.");
      if (section === "lietotaji") return fail("Lietotāju vari deaktivizēt rediģēšanas formā.");
      const { error } = await client.from(sections[section].table).delete().eq("id", id).select("id").single();
      if (error) return fail(databaseMessage(error.code));
    } else {
      const record = validateRecord(section, input);
      if (section === "lietotaji") {
        if (id) {
          if (id === identity.user.id && input.active === false) return fail("Savu kontu nevar deaktivizēt.");
          // Email is an Auth identity; changing it needs a verified email-change flow.
          const { error } = await client.from("cms_users").update({ first_name: record.first_name, last_name: record.last_name, active: input.active !== false }).eq("id", id).select("id").single();
          if (error) return fail(databaseMessage(error.code));
        } else {
          const password = typeof input.password === "string" ? input.password : "";
          if (password.length < 12 || password.length > 128) return fail("Sākotnējai parolei jābūt 12–128 rakstzīmes garai.");
          const { data, error } = await client.auth.admin.createUser({ email: String(record.email), password, email_confirm: true, user_metadata: { first_name: record.first_name, last_name: record.last_name } });
          if (error || !data.user) return fail("Neizdevās izveidot lietotāju. Pārbaudi e-pastu; konts var jau pastāvēt.");
          const { error: profileError } = await client.from("cms_users").insert({ ...record, id: data.user.id });
          if (profileError) {
            await client.auth.admin.deleteUser(data.user.id);
            return fail(databaseMessage(profileError.code));
          }
        }
      } else if (section === "pasakumi") {
        const documentIds = record.document_ids;
        delete record.document_ids;
        const { error } = await client.rpc("cms_save_event", { entry: { ...record, ...(id ? { id } : {}) }, document_ids: documentIds });
        if (error) return fail(databaseMessage(error.code));
      } else {
        const query = id ? client.from(sections[section].table).update(record).eq("id", id) : client.from(sections[section].table).insert(record);
        const { error } = await query.select("id").single();
        if (error) return fail(section === "partneri" && error.code === "23505" && record.main_partner ? "Galvenais partneris jau izvēlēts. Vispirms noņem atzīmi iepriekšējam partnerim." : databaseMessage(error.code));
      }
    }
    revalidateTag("cms-content", { expire: 0 });
    revalidateTag("contact-content", { expire: 0 });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) { return fail(error instanceof SyntaxError ? "Nederīgi dati." : error instanceof Error ? error.message : "Neizdevās saglabāt."); }
}
