import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRegistration } from "@/lib/registration/content";
import { registrationError, validateApplication } from "@/lib/registration/server";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("event") || "";
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return NextResponse.json({ error: "Pasākums nav atrasts." }, { status: 404 });
  const snapshot = await getRegistration(slug);
  return NextResponse.json(snapshot ?? { error: "Pasākums nav pieejams." }, { status: snapshot ? 200 : 404, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: NextRequest) {
  const fail = (error: string, status = 400) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("origin") !== request.nextUrl.origin) return fail("Nederīgs pieprasījums.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail("Nederīgs datu formāts.", 415);
  if (Number(request.headers.get("content-length") || 0) > 16000) return fail("Pieprasījums ir pārāk liels.", 413);
  try {
    const body = await request.text();
    if (Buffer.byteLength(body) > 16000) return fail("Pieprasījums ir pārāk liels.", 413);
    const input = JSON.parse(body);
    if (!input || typeof input !== "object" || Array.isArray(input)) return fail("Nederīgi dati.");
    if (input.website) return fail("Pieteikumu neizdevās nosūtīt.");
    const payload = validateApplication(input);
    const secret = process.env.REGISTRATION_RATE_LIMIT_SECRET || process.env.SUPABASE_SECRET_KEY;
    if (!secret) return fail("Reģistrācija īslaicīgi nav pieejama.", 503);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const fingerprint = createHmac("sha256", secret).update(ip).digest("hex");
    const { data, error } = await createAdminClient().rpc("cms_submit_event_registration", { payload, fingerprint });
    if (error) return fail(registrationError(error.message, error.code), error.message.includes("REG_LIMIT") ? 429 : 409);
    return NextResponse.json({ ok: true, reference: String(data).slice(0, 8) }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return fail(error instanceof SyntaxError ? "Nederīgi dati." : error instanceof Error ? error.message : "Pieteikumu neizdevās nosūtīt."); }
}
