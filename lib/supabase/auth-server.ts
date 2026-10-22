import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

export async function createAuthClient() {
  await connection();
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(values) { try { values.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* Server Component: proxy refreshes the session. */ } },
    },
  });
}
export async function getCmsIdentity() {
  const client = await createAuthClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await client.from("cms_users").select("id,first_name,last_name,email,active").eq("id", user.id).eq("active", true).maybeSingle();
  return profile ? { client, user, profile } : null;
}
