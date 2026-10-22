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
    section === "raksti" ? identity.client.from("cms_categories").select("id,name").order("name") : Promise.resolve({ data: [], error: null }),
    section === "pasakumi" ? identity.client.from("cms_documents").select("id,title,published").order("title") : Promise.resolve({ data: [], error: null }),
    section === "pasakumi" ? identity.client.from("cms_event_documents").select("event_id,document_id") : Promise.resolve({ data: [], error: null }),
  ]);
  const error = records.error || categories.error || documents.error || links.error;
  if (error) return <><h1>{sections[section].title}</h1><p role="alert">CMS datubāze nav pieejama. Pārbaudi savienojumu un piemēro CMS migrāciju, tad pārlādē lapu.</p></>;
  const rows = (records.data ?? []).map(row => section === "pasakumi" ? { ...row, document_ids: (links.data ?? []).filter(link => link.event_id === row.id).map(link => link.document_id) } : row) as CmsRecord[];
  return <ContentEditor key={section} section={section} records={rows} categories={categories.data ?? []} documents={documents.data ?? []} currentUserId={identity.user.id} />;
}
export default function EditorPage(props: { params: Promise<{ section: string }> }) { return <Suspense fallback={<p role="status">Ielādē ierakstus…</p>}><Editor {...props} /></Suspense>; }
