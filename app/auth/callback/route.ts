import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/auth-server";
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const client = await createAuthClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(request.nextUrl.searchParams.get("next") === "/auth/password" ? "/auth/password" : "/admin", request.url));
  }
  return NextResponse.redirect(new URL("/login?error=callback", request.url));
}
