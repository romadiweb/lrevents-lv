import { sections, type CmsField, type CmsSection } from "./config";

export function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}
export function isUuid(value: unknown): value is string { return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value); }
export function httpUrl(value: string) {
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
export function validateRecord(section: CmsSection, input: Record<string, unknown>) {
  const result: Record<string, string | number | boolean | string[] | null> = {};
  for (const field of sections[section].fields as CmsField[]) {
    const raw = input[field.key];
    if (field.type === "documents") {
      if (!Array.isArray(raw) || raw.length > 100 || !raw.every(isUuid)) throw Error("Izvēlies derīgus dokumentus.");
      result[field.key] = [...new Set(raw)]; continue;
    }
    if (field.type === "checkbox") { result[field.key] = raw === true; continue; }
    if (field.type === "decimal") {
      if (raw === "" || raw == null) { if(field.required) throw Error(`Aizpildi lauku “${field.label}”.`); result[field.key]=null; continue; }
      const value=Number(raw); const timing=field.key.endsWith("_ms");
      if (!Number.isFinite(value) || Math.abs(value) > (timing ? 172800000 : 100000) || ((timing || field.key === "position") && (!Number.isSafeInteger(value) || value < (timing ? 0 : 1)))) throw Error(`${field.label}: nederīgs skaitlis.`);
      result[field.key]=value; continue;
    }
    if (field.type === "number") {
      const value = Number(raw ?? 0);
      if (!Number.isSafeInteger(value) || Math.abs(value) > 100000) throw Error(`${field.label}: ievadi veselu skaitli.`);
      result[field.key] = value; continue;
    }
    const value = typeof raw === "string" ? raw.trim() : "";
    if (field.required && !value) throw Error(`Aizpildi lauku “${field.label}”.`);
    if (value.length > (field.type === "textarea" ? 100000 : 2048)) throw Error(`${field.label}: teksts ir pārāk garš.`);
    if (value && field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw Error("Ievadi derīgu e-pasta adresi.");
    if (value && field.type === "url" && !httpUrl(value)) throw Error("Saitei jāsākas ar https:// vai http://.");
    if (value && (field.type === "image" || field.type === "gallery-image") && !(value.startsWith("/images/") || httpUrl(value))) throw Error("Augšupielādē derīgu attēlu.");
    if (value && field.type === "lookup" && !isUuid(value)) throw Error("Izvēlies derīgu saistīto ierakstu.");
    if (value && field.type === "category" && !isUuid(value)) throw Error("Izvēlies kategoriju.");
    if (value && field.type === "select" && !field.options?.includes(value)) throw Error("Izvēlies faila veidu.");
    if (value && field.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(`${value}T12:00Z`).toISOString().slice(0, 10) !== value)) throw Error("Ievadi derīgu datumu.");
    if (value && field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d(?::00)?$/.test(value)) throw Error("Ievadi laiku formātā HH:MM.");
    result[field.key] = (field.type === "category" || field.type === "lookup" || field.type === "date") && !value ? null : field.type === "email" ? value.toLowerCase() : value;
  }
  if ("slug" in result) {
    result.slug = slugify(String(result.slug || result.title || result.name));
    if (!result.slug) throw Error("Norādi lapas adresi ar latīņu burtiem.");
    if (section === "pasakumi" && result.slug === "arhivs") throw Error("Adrese “arhivs” ir rezervēta.");
  }
  if (section !== "lietotaji" && section !== "kategorijas") result.published = input.published === true;
  if (section === "galerija") {
    if (input.image_source !== "upload" && input.image_source !== "url") throw Error("Izvēlies vienu attēla pievienošanas veidu.");
    const image = String(result.image);
    if (input.image_source === "url" && (!httpUrl(image) || !image.startsWith("https://"))) throw Error("Attēla adresei jāsākas ar https://.");
    if (input.image_source === "upload" && !image.startsWith("/images/") && !image.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cms-media/`)) throw Error("Pievieno failu ar augšupielādes pogu vai izvēlies attēla adresi.");
    result.image_source = input.image_source;
  }
  if(section === "sezonas") {
    if(Number(result.year)<1900||Number(result.year)>2200||Number(result.best_rounds)<0||Number(result.best_rounds)>100||Number(result.team_best)<0||Number(result.team_best)>100)throw Error("Pārbaudi sezonas gadu un ieskaitāmo posmu/startu skaitu.");
    const scale=String(result.points_scale).split(",").map(value=>value.trim());
    if(!scale.length||scale.length>100||scale.some(value=>!/^\d+(?:\.\d{1,3})?$/.test(value)||Number(value)>100000))throw Error("Punktu sistēma: ievadi ar komatiem atdalītus pozitīvus punktus, piemēram, 40,32,26.");
    result.points_scale=scale.join(",");
  }
  return result;
}
