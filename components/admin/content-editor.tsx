"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { sections, type CmsField, type CmsRecord, type CmsSection } from "@/lib/cms/config";

function ImageUpload({ value, onChange, onBusyChange, logo, disabled }: { value: string; onChange: (value: string) => void; onBusyChange: (busy: boolean) => void; logo: boolean; disabled: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function upload(file?: File) {
    if (!file || uploading || disabled) return;
    const active = new AbortController(); controller.current = active;
    setUploading(true); onBusyChange(true); setError("");
    try {
      if (file.size > 10 * 1024 * 1024) throw Error("Attēla maksimālais izmērs ir 10 MB.");
      const data = new FormData(); data.set("file", file); data.set("kind", logo ? "logo" : "photo");
      const response = await fetch("/api/admin/upload", { method: "POST", body: data, signal: active.signal });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || "Augšupielāde neizdevās.");
      if (!active.signal.aborted) onChange(result.url);
    } catch (error) { if (!active.signal.aborted) setError(error instanceof Error ? error.message : "Savienojums neizdevās."); }
    finally { if (!active.signal.aborted) { setUploading(false); onBusyChange(false); if (input.current) input.current.value = ""; } }
  }
  return <div className="cms-image-field">
    <div className={`cms-dropzone${over ? " is-over" : ""}`} onDragOver={event => { event.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={event => { event.preventDefault(); setOver(false); void upload(event.dataTransfer.files[0]); }}>
      {/* Storage URLs are already compressed and restricted to image uploads. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value && <img className={logo ? "cms-logo-preview" : undefined} src={value} alt="Izvēlētā attēla priekšskatījums" />}
      <button type="button" disabled={uploading || disabled} onClick={() => input.current?.click()}><Upload size={18} />{uploading ? "Saspiež un augšupielādē…" : value ? "Mainīt attēlu" : "Pievienot attēlu"}</button>
      <span>Ievelc failu šeit · {logo ? "SVG, PNG, JPG, WebP, AVIF" : "PNG, JPG, WebP, AVIF"} · līdz 10 MB</span>
      <small>{logo ? "Logotipu saglabā WebP formātā, saglabājot caurspīdīgumu. SVG tiek pārveidots par attēlu." : "Attēlu automātiski samazina un saglabā WebP formātā."}</small>
    </div>
    <input ref={input} type="file" accept={`image/png,image/jpeg,image/webp,image/avif${logo ? ",image/svg+xml,.svg" : ""}`} hidden onChange={event => void upload(event.target.files?.[0])} />
    {value && <button className="cms-text-button" type="button" disabled={disabled || uploading} onClick={() => onChange("")}>Noņemt attēlu</button>}
    {error && <p role="alert">{error}</p>}
  </div>;
}

function GalleryImageInput({ value, source, onChange, onSourceChange, onBusyChange, disabled }: { value: string; source: string; onChange: (value: string) => void; onSourceChange: (value: "upload" | "url") => void; onBusyChange: (busy: boolean) => void; disabled: boolean }) {
  return <div className="cms-gallery-image">
    <fieldset className="cms-image-source"><legend>Attēla pievienošanas veids</legend>
      <label className="cms-checkbox"><input type="radio" name="gallery-image-source" value="upload" checked={source === "upload"} onChange={() => onSourceChange("upload")} />Augšupielādēt failu</label>
      <label className="cms-checkbox"><input type="radio" name="gallery-image-source" value="url" checked={source === "url"} onChange={() => onSourceChange("url")} />Attēla adrese</label>
    </fieldset>
    {source === "url" ? <div className="cms-field"><label htmlFor="gallery-image-url">Attēla adrese *</label><input id="gallery-image-url" type="url" placeholder="https://…" required value={value} onChange={event => onChange(event.target.value)} /><small>Izmanto tiešu saiti uz publiski pieejamu attēlu.</small></div> : <ImageUpload value={value} onChange={onChange} onBusyChange={onBusyChange} logo={false} disabled={disabled} />}
  </div>;
}

export function ContentEditor({ section, records, categories, documents, currentUserId }: { section: CmsSection; records: CmsRecord[]; categories: { id: string; name: string }[]; documents: { id: string; title: string; published: boolean }[]; currentUserId: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pending = busy || uploading;
  const [deleting, setDeleting] = useState<string | null>(null);
  const config = sections[section];
  const fields = config.fields as CmsField[];
  function open(record?: CmsRecord) {
    if (pending) return;
    setEditing(record ? { ...record } : { id: "", published: false, active: true, sort_order: 0, file_type: "PDF", document_ids: [], image_source: "upload" }); setMessage(""); setDeleting(null);
  }
  function change(key: string, value: string | boolean | string[]) { setEditing(current => current ? { ...current, [key]: value } : current); }
  async function mutate(payload: Record<string, unknown>) {
    if (pending) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/${section}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Neizdevās saglabāt.");
      setEditing(null); setDeleting(null); setMessage("Izmaiņas saglabātas."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Savienojums neizdevās. Mēģini vēlreiz."); }
    finally { setBusy(false); }
  }
  function title(record: CmsRecord) { return String(record.title || record.name || record.alt || `${record.first_name ?? ""} ${record.last_name ?? ""}`); }
  function recordLabel(record: CmsRecord) { return section === "galerija" ? <span className="cms-gallery-row"><Image src={String(record.image)} alt="" width={56} height={56} unoptimized /><span>{title(record)}</span></span> : title(record); }
  return <>
    <header className="cms-heading"><div><h1>{config.title}</h1><p>{records.length} {records.length === 1 ? "ieraksts" : "ieraksti"}</p></div><button type="button" onClick={() => open()} disabled={pending}><Plus size={18} />Pievienot</button></header>
    {!editing && <p className="cms-message" role="status" aria-live="polite">{message}</p>}
    {editing ? <section className="cms-editor" aria-label={editing.id ? "Rediģēt ierakstu" : "Jauns ieraksts"}>
      <div className="cms-editor-heading"><h2>{editing.id ? "Rediģēt ierakstu" : "Jauns ieraksts"}</h2><button type="button" className="cms-secondary" disabled={pending} onClick={() => setEditing(null)}><X size={17} />Aizvērt</button></div>
      <form aria-busy={pending} onSubmit={event => { event.preventDefault(); void mutate(editing); }}>
        <fieldset disabled={pending} className="cms-fields">
          {fields.map(field => <div className={`cms-field${["textarea", "image", "gallery-image", "documents"].includes(field.type ?? "") ? " cms-field-wide" : ""}`} key={field.key}>
            {field.type === "gallery-image" ? <GalleryImageInput value={String(editing.image ?? "")} source={String(editing.image_source ?? "upload")} onChange={value => change("image", value)} onSourceChange={source => { if (!pending) setEditing(current => current ? { ...current, image_source: source, image: "" } : current); }} onBusyChange={setUploading} disabled={pending} /> :
            field.type === "image" ? <><span className="cms-field-label">{field.label}{field.required ? " *" : ""}</span><ImageUpload key={`${editing.id || "new"}-${field.key}`} onBusyChange={setUploading} value={String(editing[field.key] ?? "")} onChange={value => change(field.key, value)} logo={section === "partneri"} disabled={pending} />{field.key === "belt_image" && <small>Ja nav pievienots, joslā izmanto galveno logotipu. Kājene vienmēr izmanto galveno logotipu.</small>}</> : field.type === "documents" ? <fieldset className="cms-document-picker"><legend>{field.label}</legend>{documents.length === 0 ? <p>Vispirms pievieno dokumentus sadaļā “Dokumenti”.</p> : documents.map(document => <label className="cms-checkbox" key={document.id}><input type="checkbox" checked={Array.isArray(editing.document_ids) && editing.document_ids.includes(document.id)} onChange={event => change("document_ids", event.target.checked ? [...(Array.isArray(editing.document_ids) ? editing.document_ids : []), document.id] : (Array.isArray(editing.document_ids) ? editing.document_ids : []).filter(id => id !== document.id))} />{document.title}{!document.published && <small>(melnraksts)</small>}</label>)}</fieldset> : <>
              <label htmlFor={`cms-${field.key}`}>{field.label}{field.required ? " *" : ""}</label>
              {field.type === "textarea" ? <textarea id={`cms-${field.key}`} value={String(editing[field.key] ?? "")} required={field.required} rows={field.key === "body" ? 12 : 5} onChange={event => change(field.key, event.target.value)} /> : field.type === "category" || field.type === "select" ? <select id={`cms-${field.key}`} required={field.required} value={String(editing[field.key] ?? "")} onChange={event => change(field.key, event.target.value)}><option value="">Izvēlies…</option>{field.type === "category" ? categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>) : field.options?.map(option => <option key={option}>{option}</option>)}</select> : <input id={`cms-${field.key}`} type={field.type ?? "text"} required={field.required} value={String(editing[field.key] ?? "")} readOnly={section === "lietotaji" && !!editing.id && field.key === "email"} onChange={event => change(field.key, event.target.value)} />}
            </>}
          </div>)}
          {section === "lietotaji" && !editing.id && <label className="cms-field">Sākotnējā parole<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required onChange={event => change("password", event.target.value)} /><small>Vismaz 12 rakstzīmes. Nodod paroli lietotājam privāti.</small></label>}
          {section === "lietotaji" ? <label className="cms-checkbox"><input type="checkbox" checked={editing.active !== false} disabled={editing.id === currentUserId} onChange={event => change("active", event.target.checked)} />Aktīva pieeja CMS</label> : section !== "kategorijas" && <label className="cms-checkbox"><input type="checkbox" checked={editing.published === true} onChange={event => change("published", event.target.checked)} />Publicēts mājaslapā</label>}
        </fieldset>
        {section === "raksti" && editing.published_at && <p>Publicēts: {new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Riga" }).format(new Date(String(editing.published_at)))}</p>}
        <p className="cms-message" role="status" aria-live="polite">{message}</p><div className="cms-form-actions"><button disabled={pending} type="submit">{uploading ? "Augšupielādē attēlu…" : busy ? "Saglabā…" : "Saglabāt"}</button><button type="button" className="cms-secondary" disabled={pending} onClick={() => setEditing(null)}>Atcelt</button></div>
      </form>
    </section> : <><p className="cms-scroll-hint">Ritini tabulu pa labi, lai redzētu visus laukus un darbības.</p><div className="cms-table-wrap" role="region" aria-label={`${config.title}: ierakstu tabula`} tabIndex={0}><table><thead><tr><th>{section === "lietotaji" || section === "komanda" ? "Vārds, uzvārds" : "Nosaukums"}</th><th>{section === "lietotaji" || section === "komanda" ? "E-pasts" : section === "raksti" ? "Publicēšanas datums" : "Informācija"}</th><th>Statuss</th><th><span className="sr-only">Darbības</span></th></tr></thead><tbody>
      {records.map(record => <tr key={record.id}><th scope="row">{recordLabel(record)}</th><td>{String(record.email || (record.published_at ? new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium", timeZone: "Europe/Riga" }).format(new Date(String(record.published_at))) : record.event_date || record.file_type || record.url || "—"))}</td><td>{section === "kategorijas" ? "Pieejama" : section === "lietotaji" ? record.active ? "Aktīvs" : "Neaktīvs" : record.published ? "Publicēts" : "Melnraksts"}</td><td><div className="cms-row-actions"><button className="cms-secondary" onClick={() => open(record)} disabled={pending} aria-label={`Rediģēt: ${title(record)}`}><Pencil size={16} /><span>Rediģēt</span></button>{section !== "lietotaji" && <button className="cms-secondary" onClick={() => setDeleting(record.id)} disabled={pending} aria-label={`Dzēst: ${title(record)}`}><Trash2 size={16} /></button>}</div>{deleting === record.id && <div className="cms-delete-confirm"><p>Dzēst šo ierakstu?</p><button disabled={pending} onClick={() => void mutate({ action: "delete", id: record.id })}>Dzēst</button><button disabled={pending} className="cms-secondary" onClick={() => setDeleting(null)}>Atcelt</button></div>}</td></tr>)}
      {!records.length && <tr><td colSpan={4} className="cms-empty">Šeit vēl nav ierakstu. Spied “Pievienot”, lai izveidotu pirmo.</td></tr>}
    </tbody></table></div></>}
  </>;
}
