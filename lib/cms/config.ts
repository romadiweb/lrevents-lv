export type CmsField = { key: string; label: string; type?: "text" | "email" | "url" | "textarea" | "image" | "number" | "date" | "time" | "category" | "documents" | "select"; required?: boolean; options?: string[] };
export const sections = {
  komanda: { title: "Mūsu komanda", table: "cms_team", fields: [
    { key: "image", label: "Foto", type: "image" }, { key: "first_name", label: "Vārds", required: true }, { key: "last_name", label: "Uzvārds", required: true }, { key: "position", label: "Amats", required: true }, { key: "email", label: "E-pasts", type: "email", required: true }, { key: "sort_order", label: "Secība", type: "number" },
  ] },
  raksti: { title: "Raksti", table: "cms_articles", fields: [
    { key: "image", label: "Attēls", type: "image", required: true }, { key: "title", label: "Virsraksts", required: true }, { key: "slug", label: "Lapas adrese (aizpildās automātiski)" }, { key: "category_id", label: "Kategorija", type: "category", required: true }, { key: "summary", label: "Īss apraksts", type: "textarea" }, { key: "body", label: "Raksta teksts", type: "textarea", required: true },
  ] },
  kategorijas: { title: "Kategorijas", table: "cms_categories", fields: [{ key: "name", label: "Nosaukums", required: true }, { key: "slug", label: "Adrese (aizpildās automātiski)" }] },
  partneri: { title: "Partneri", table: "cms_partners", fields: [{ key: "image", label: "Logotips", type: "image", required: true }, { key: "name", label: "Partnera nosaukums", required: true }, { key: "url", label: "Mājaslapas saite", type: "url", required: true }, { key: "sort_order", label: "Secība", type: "number" }] },
  dokumenti: { title: "Dokumenti", table: "cms_documents", fields: [{ key: "title", label: "Dokumenta nosaukums", required: true }, { key: "url", label: "Saite", type: "url", required: true }, { key: "file_type", label: "Faila veids", type: "select", options: ["PDF", "DOCX", "XLSX", "ZIP", "Saite"], required: true }, { key: "description", label: "Īss apraksts", type: "textarea" }] },
  pasakumi: { title: "Pasākumi", table: "cms_events", fields: [{ key: "image", label: "Attēls", type: "image", required: true }, { key: "title", label: "Nosaukums", required: true }, { key: "slug", label: "Lapas adrese (aizpildās automātiski)" }, { key: "venue", label: "Norises vieta / adrese", required: true }, { key: "city", label: "Pilsēta", required: true }, { key: "event_date", label: "Datums", type: "date", required: true }, { key: "start_time", label: "Sākuma laiks (Latvijas laiks)", type: "time", required: true }, { key: "description", label: "Pasākuma apraksts", type: "textarea", required: true }, { key: "participant_description", label: "Dalībniekiem", type: "textarea" }, { key: "document_ids", label: "Saistītie dokumenti", type: "documents" }] },
  lietotaji: { title: "Lietotāji", table: "cms_users", fields: [{ key: "first_name", label: "Vārds", required: true }, { key: "last_name", label: "Uzvārds", required: true }, { key: "email", label: "E-pasts", type: "email", required: true }] },
} satisfies Record<string, { title: string; table: string; fields: CmsField[] }>;
export type CmsSection = keyof typeof sections;
export function isCmsSection(value: string): value is CmsSection { return Object.hasOwn(sections, value); }
export type CmsRecord = Record<string, string | number | boolean | string[] | null> & { id: string };
