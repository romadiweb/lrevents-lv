import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { associationDetails, team } from "./contacts";
import { getTeam } from "./cms/content";

export const defaultContactContent = {
  associationName: "Biedrība “LR Events”",
  introduction: "Ja tev ir jautājumi vai idejas sadarbībai — droši sazinies ar mums!",
  email: "kasparsbite@lrevents.lv",
  associationDetails,
  team,
};
export type ContactContent = Omit<typeof defaultContactContent, "team"> & { team: { name: string; role: string; email: string; image?: string }[] };

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
  const currentTeam = await getTeam();
  return { ...defaultContactContent, team: currentTeam };
}

