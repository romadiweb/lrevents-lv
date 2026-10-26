import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { isCmsSection, sections, type CmsRecord } from "@/lib/cms/config";
import { getCmsIdentity } from "@/lib/supabase/auth-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ContentEditor } from "@/components/admin/content-editor";
async function Editor({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isCmsSection(section)) notFound();
  const identity = await getCmsIdentity();
  if (!identity) redirect("/login");
  const client = section === "lietotaji" ? createAdminClient() : identity.client;
  const [records, categories, documents, links] = await Promise.all([
    client.from(sections[section].table).select("*").order("created_at", { ascending: false }),
    section === "raksti" || section === "galerija" ? identity.client.from("cms_categories").select("id,name").order("name") : Promise.resolve({ data: [], error: null }),
    section === "pasakumi" ? identity.client.from("cms_documents").select("id,title,published").order("title") : Promise.resolve({ data: [], error: null }),
    section === "pasakumi" ? identity.client.from("cms_event_documents").select("event_id,document_id") : Promise.resolve({ data: [], error: null }),
  ]);
  const error = records.error || categories.error || documents.error || links.error;
  if (error) return <><h1>{sections[section].title}</h1><p role="alert">CMS datubāze nav pieejama. Pārbaudi savienojumu un piemēro CMS migrāciju, tad pārlādē lapu.</p></>;
  const lookupTables=["cms_seasons","cms_rounds","cms_classes","cms_racing_teams","cms_participants","cms_entries","cms_results","cms_events"];
  const needsLookups=(sections[section].fields as {type?:string}[]).some(field=>field.type==="lookup")||["komandas","sezonas","dalibnieki"].includes(section);
  const lookupResults=needsLookups?await Promise.all(lookupTables.map(async table=>{const result=await identity.client.from(table).select("*").order("created_at");if(result.error)throw Error("Neizdevās ielādēt saistītos rezultātu ierakstus.");return [table,result.data] as const;})):[];
  const lookups=Object.fromEntries(lookupResults) as Record<string,CmsRecord[]>;
  const rows = (records.data ?? []).map(row => section === "pasakumi" ? { ...row, document_ids: (links.data ?? []).filter(link => link.event_id === row.id).map(link => link.document_id) } : row) as CmsRecord[];
  return <ContentEditor key={section} section={section} records={rows} categories={categories.data ?? []} documents={documents.data ?? []} currentUserId={identity.user.id} lookups={lookups} />;
}
export default function EditorPage(props: { params: Promise<{ section: string }> }) { return <Suspense fallback={<p className="cms-guide" role="status">Ielādē ierakstus…</p>}><Editor {...props} /></Suspense>; }
