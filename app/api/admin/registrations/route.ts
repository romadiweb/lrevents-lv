import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/cms/validation";
import { registrationError } from "@/lib/registration/server";
import { reviewLabels } from "@/lib/registration/types";
const headers = { "Cache-Control": "private, no-store" };
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status, headers });
export async function GET(request: NextRequest) {
  const identity = await getCmsIdentity(); if (!identity) return fail("Lūdzu, pieslēdzies vēlreiz.", 401);
  const client = identity.client;
  const { count, error: countError } = await client.from("cms_event_registrations").select("id", { count: "exact", head: true }).eq("status", "pending");
  if (countError) return fail("Pieteikumu saraksts nav pieejams.", 503);
  if (request.nextUrl.searchParams.get("count") === "1") return NextResponse.json({ pending: count }, { headers });
  const status = request.nextUrl.searchParams.get("status") || "pending";
  const event = request.nextUrl.searchParams.get("event") || "";
  const page = Math.max(0, Math.min(10000, Number(request.nextUrl.searchParams.get("page")) || 0));
  if (!(status in reviewLabels) && status !== "all" || event && !isUuid(event) || !Number.isInteger(page)) return fail("Nederīgs filtrs.");
  let query = client.from("cms_event_registrations").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(page * 50, page * 50 + 49);
  if (status !== "all") query = query.eq("status", status);
  if (event) query = query.eq("event_id", event);
  const [requests, events, people, classes] = await Promise.all([
    query, client.from("cms_events").select("id,title,event_date,registration_capacity,registration_status").order("event_date", { ascending: false }),
    client.from("cms_participants").select("id,first_name,last_name,car").order("last_name").limit(10000), client.from("cms_classes").select("id,name"),
  ]);
  if (requests.error || events.error || people.error || classes.error) return fail("Neizdevās ielādēt pieteikumus.", 503);
  const rows = requests.data ?? [];
  const identities = rows.length ? await client.from("cms_participant_identities").select("name_key,email_key,participant_id").in("name_key", [...new Set(rows.map(row => row.name_key))]) : { data: [], error: null };
  if (identities.error) return fail("Neizdevās pārbaudīt dalībnieku saistību.", 503);
  return NextResponse.json({ pending: count, total: requests.count, rows: rows.map(row => ({ ...row, known_person: identities.data?.find(item => item.name_key === row.name_key && item.email_key === row.email)?.participant_id || null })), events: events.data, people: people.data, classes: classes.data }, { headers });
}
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) return fail("Nederīgs pieprasījums.", 403);
  const identity = await getCmsIdentity(); if (!identity) return fail("Lūdzu, pieslēdzies vēlreiz.", 401);
  try {
    const body = await request.text(); if (Buffer.byteLength(body) > 4000) return fail("Pieprasījums ir pārāk liels.", 413);
    const input = JSON.parse(body);
    if (!input || !isUuid(input.id) || !["accepted", "waitlisted", "rejected", "cancelled"].includes(input.decision) || input.person_id && !isUuid(input.person_id) || !["unpaid", "paid", "exempt"].includes(input.payment) || typeof input.number !== "string" || input.number.length > 20) return fail("Pārbaudi ievadītos datus.");
    // Auth is checked above. The service-only RPC validates the actor and changes identity, entries and public list atomically.
    const { error } = await createAdminClient().rpc("cms_review_event_registration", { request_id: input.id, decision: input.decision, actor: identity.user.id, person_id: input.person_id || null, payment: input.payment, number: input.number.trim(), new_person: input.new_person === true });
    if (error) return fail(registrationError(error.message, error.code), 409);
    revalidateTag("cms-content", { expire: 0 }); revalidateTag("registrations", { expire: 0 }); revalidatePath("/", "layout");
    return NextResponse.json({ ok: true }, { headers });
  } catch { return fail("Neizdevās izskatīt pieteikumu. Pārbaudi datus un mēģini vēlreiz."); }
}
