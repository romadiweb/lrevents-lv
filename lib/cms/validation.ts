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
    if (value && field.type === "image" && !(value.startsWith("/images/") || httpUrl(value))) throw Error("Augšupielādē derīgu attēlu.");
    if (value && field.type === "category" && !isUuid(value)) throw Error("Izvēlies kategoriju.");
    if (value && field.type === "select" && !field.options?.includes(value)) throw Error("Izvēlies faila veidu.");
    if (value && field.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(`${value}T12:00Z`).toISOString().slice(0, 10) !== value)) throw Error("Ievadi derīgu datumu.");
    if (value && field.type === "time" && !/^([01]\d|2[0-3]):[0-5]\d(?::00)?$/.test(value)) throw Error("Ievadi laiku formātā HH:MM.");
    result[field.key] = field.type === "email" ? value.toLowerCase() : value;
  }
  if ("slug" in result) {
    result.slug = slugify(String(result.slug || result.title || result.name));
    if (!result.slug) throw Error("Norādi lapas adresi ar latīņu burtiem.");
    if (section === "pasakumi" && result.slug === "arhivs") throw Error("Adrese “arhivs” ir rezervēta.");
  }
  if (section !== "lietotaji" && section !== "kategorijas") result.published = input.published === true;
  return result;
}
