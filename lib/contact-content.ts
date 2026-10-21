import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { associationDetails, team } from "./contacts";
import { createContentClient } from "./supabase/server";

export const defaultContactContent = {
  associationName: "Biedrība “LR Events”",
  introduction: "Ja tev ir jautājumi vai idejas sadarbībai — droši sazinies ar mums!",
  email: "kasparsbite@lrevents.lv",
  associationDetails,
  team,
};
export type ContactContent = typeof defaultContactContent;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function isEmail(value: unknown): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function isContactContent(value: unknown): value is ContactContent {
  if (!isRecord(value)) return false;
  return typeof value.associationName === "string" && typeof value.introduction === "string" && isEmail(value.email)
    && Array.isArray(value.associationDetails) && value.associationDetails.every(item => isRecord(item) && typeof item.label === "string" && typeof item.value === "string")
    && Array.isArray(value.team) && value.team.every(item => isRecord(item) && typeof item.name === "string" && typeof item.role === "string" && isEmail(item.email));
}

export async function getContactContent(): Promise<ContactContent> {
  "use cache";
  cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  cacheTag("contact-content");
  const client = createContentClient();
  if (!client) return defaultContactContent;
  try {
    const { data, error } = await client.from("site_content").select("content").eq("slug", "contacts").abortSignal(AbortSignal.timeout(5000)).maybeSingle();
    if (!error && data && isContactContent(data.content)) return data.content;
    console.warn("Supabase contact content unavailable; using local content.", error?.code ?? "missing-or-invalid-content");
  } catch {
    console.warn("Supabase contact request failed; using local content.");
  }
  return defaultContactContent;
}

