import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createContentClient } from "@/lib/supabase/server";
import { articles as demoArticles, articleCategories, type Article } from "@/lib/articles";
import { events as demoEvents, type MotorsportEvent } from "@/lib/events";
import { sponsors as demoSponsors, type Sponsor } from "@/lib/sponsors";
import { eventDocuments } from "@/lib/documents";
import { team as defaultTeam } from "@/lib/contacts";

type Row = Record<string, unknown>;
async function read(table: string): Promise<Row[] | null> {
  "use cache";
  cacheTag("cms-content");
  cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const client = createContentClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from(table).select("*").abortSignal(AbortSignal.timeout(5000));
    if (error) return null;
    return data;
  } catch { return null; }
}
const text = (row: Row, key: string) => typeof row[key] === "string" ? row[key] as string : "";
export async function getCategories() {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const rows = await read("cms_categories");
  return rows === null ? [...articleCategories] : rows.map(row => ({ id: text(row, "slug"), label: text(row, "name"), uuid: text(row, "id") })).sort((a,b) => a.label.localeCompare(b.label, "lv"));
}
export async function getArticles(): Promise<Article[]> {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const [rows, categories] = await Promise.all([read("cms_articles"), read("cms_categories")]);
  if (rows === null || categories === null) return demoArticles;
  return rows.filter(row => row.published === true && row.published_at).map(row => ({
    id: text(row, "slug"), title: text(row, "title"), summary: text(row, "summary") || text(row, "body").slice(0, 180),
    category: text(categories.find(category => category.id === row.category_id) ?? {}, "slug"),
    categoryLabel: text(categories.find(category => category.id === row.category_id) ?? {}, "name"),
    publishedAt: text(row, "published_at"), date: new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium", timeZone: "Europe/Riga" }).format(new Date(text(row, "published_at"))),
    image: text(row, "image"), href: `/raksti/${text(row, "slug")}`, body: text(row, "body").split(/\n\s*\n/).filter(Boolean), isDemo: false,
  })).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt));
}
export async function getSponsors(): Promise<Sponsor[]> {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const rows = await read("cms_partners");
  return rows === null ? demoSponsors : rows.filter(row => row.published === true).sort((a,b) => Number(a.sort_order)-Number(b.sort_order)).map(row => ({ id: text(row,"id"), label: text(row,"name"), logoSrc: text(row,"image"), href: text(row,"url") }));
}
export async function getTeam(): Promise<{ name: string; role: string; email: string; image?: string }[]> {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const rows = await read("cms_team");
  return rows === null ? defaultTeam : rows.filter(row => row.published === true).sort((a,b) => Number(a.sort_order)-Number(b.sort_order)).map(row => ({ name: `${text(row,"first_name")} ${text(row,"last_name")}`, role: text(row,"position"), email: text(row,"email"), image: text(row,"image") }));
}
export async function getDocuments() {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const rows = await read("cms_documents");
  return rows === null ? eventDocuments.map(document => ({ ...document, id: document.href, fileType: "PDF" })) : rows.filter(row => row.published === true).sort((a,b) => text(b,"created_at").localeCompare(text(a,"created_at"))).map(row => ({ id: text(row,"id"), title: text(row,"title"), description: text(row,"description"), href: text(row,"url"), fileType: text(row,"file_type"), category: "Dokuments" }));
}
// Convert local event date/time through Europe/Riga, including summer time.
export function eventTimestamp(date: string, time: string) {
  const wall = Date.parse(`${date}T${time.slice(0,5)}:00Z`);
  const formatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Riga", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  let guess = wall;
  for (let i=0;i<2;i++) { const local = formatter.format(new Date(guess)).replace(" ", "T"); guess += wall - Date.parse(`${local}Z`); }
  return new Date(guess).toISOString();
}
export async function getEvents(): Promise<MotorsportEvent[]> {
  "use cache";
  cacheTag("cms-content"); cacheLife({ stale: 0, revalidate: 60, expire: 300 });
  const [rows, links, docs] = await Promise.all([read("cms_events"), read("cms_event_documents"), getDocuments()]);
  if (rows === null || links === null) return demoEvents;
  return rows.filter(row => row.published === true).map(row => {
    const date = text(row,"event_date"), time = text(row,"start_time").slice(0,5), image = text(row,"image"), id = text(row,"slug");
    return { id, title: text(row,"title"), date, day: date.slice(8), month: new Intl.DateTimeFormat("lv-LV", { month:"short", timeZone:"UTC" }).format(new Date(`${date}T12:00Z`)).replace(".","").toUpperCase(), year:date.slice(0,4), city:text(row,"city"), venue:text(row,"venue"), image, venueImage:image, href:`/pasakumi/${id}`, startsAt:eventTimestamp(date,time), startLabel:`Starts ${time.replace(":",".")}`, summary:text(row,"description"), venueDescription:"", participantDescription:text(row,"participant_description"), directionsQuery:`${text(row,"venue")} ${text(row,"city")}`, schedule:[{time,title:"Pasākuma sākums"}], documents:docs.filter(doc => links.some(link=>link.event_id === row.id && link.document_id === doc.id)).map(doc=>({title:doc.title,href:doc.href})), isDemo:false };
  }).sort((a,b)=>a.date.localeCompare(b.date));
}
