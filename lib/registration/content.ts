import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createContentClient } from "@/lib/supabase/server";
import type { PublicParticipant, RegistrationSnapshot, RegistrationState } from "./types";

function offsetDate(date: string, days: number) { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
export async function getRegistration(slug: string): Promise<RegistrationSnapshot | null> {
  "use cache";
  cacheTag("cms-content", "registrations"); cacheLife({ stale: 60, revalidate: 30, expire: 3600 });
  const client = createContentClient();
  if (!client) return null;
  const { data: event, error } = await client.from("cms_events").select("id,slug,title,event_date,registration_status,registration_capacity,registration_opens_on,registration_closes_on,registration_round_id,registration_rules_url").eq("slug", slug).eq("published", true).abortSignal(AbortSignal.timeout(5000)).maybeSingle();
  if (error || !event) return null;
  const [{ data: round }, { data: teams }, { data: participants, count: participantCount, error: listError }] = await Promise.all([
    event.registration_round_id ? client.from("cms_rounds").select("season_id").eq("id", event.registration_round_id).maybeSingle() : Promise.resolve({ data: null }),
    client.from("cms_racing_teams").select("id,name").order("name"),
    client.from("cms_event_participants").select("registration_id,driver,car,class_names,team_name,start_number", { count: "exact" }).eq("event_id", event.id).order("driver").range(0, 999),
  ]);
  if (listError) return null;
  const allParticipants = [...(participants ?? [])];
  for (let offset = 1000; offset < (participantCount ?? 0); offset += 1000) {
    const page = await client.from("cms_event_participants").select("registration_id,driver,car,class_names,team_name,start_number").eq("event_id", event.id).order("driver").range(offset, offset + 999);
    if (page.error) return null;
    allParticipants.push(...page.data);
  }
  const { data: classes } = round ? await client.from("cms_classes").select("id,name").eq("season_id", round.season_id).order("sort_order") : { data: [] };
  const opensOn = event.registration_opens_on || offsetDate(event.event_date, -30);
  const closesOn = event.registration_closes_on || offsetDate(event.event_date, -2);
  const now = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Riga", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
  const accepted = participantCount ?? allParticipants.length;
  let state: RegistrationState = "closed";
  if (event.event_date < now.slice(0, 10)) state = "ended";
  else if (event.registration_status === "closed") state = "closed";
  else if (event.registration_status === "full" || accepted >= event.registration_capacity) state = "full";
  else if (event.registration_status === "open" && round && classes?.length && event.registration_rules_url) state = now < `${opensOn} 00:00` ? "scheduled" : now >= `${closesOn} 18:00` ? "closed" : "open";
  return { id: event.id, slug, title: event.title, date: event.event_date, state, capacity: event.registration_capacity, accepted, opensOn, closesOn, rulesUrl: event.registration_rules_url, classes: classes ?? [], teams: teams ?? [], participants: allParticipants as PublicParticipant[] };
}
