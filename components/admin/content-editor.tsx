"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { carBrands } from "@/lib/car-brands";
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

export function ContentEditor({ section, records, categories, documents, currentUserId, lookups = {} }: { section: CmsSection; records: CmsRecord[]; categories: { id: string; name: string }[]; documents: { id: string; title: string; published: boolean }[]; currentUserId: string; lookups?: Record<string, CmsRecord[]> }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const pending = busy || uploading;
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filters,setFilters]=useState<Record<string,string>>({});
  const [search,setSearch]=useState("");
  const config = sections[section];
  const resultSection=["sezonas","posmi","klases","komandas","dalibnieki","starti","rezultati","braucieni"].includes(section);
  function lookup(table:string,id:unknown){return lookups[table]?.find(row=>row.id===id);}
  function label(table:string,row:CmsRecord):string {
    if(table==="cms_runs")return `${label("cms_results",lookup("cms_results",row.result_id)||{id:""})} · brauciens ${row.run_number}`;
    if(table==="cms_entries")return `${label("cms_participants",lookup("cms_participants",row.participant_id)||{id:""})} · ${lookup("cms_classes",row.class_id)?.name||""} · ${row.start_number||"—"}`;
    if(table==="cms_results")return `${lookup("cms_rounds",row.round_id)?.name||""} · ${label("cms_entries",lookup("cms_entries",row.entry_id)||{id:""})}`;
    return String(row.name||row.title||`${row.first_name||""} ${row.last_name||""}`).trim()+(table==="cms_seasons"?` · ${row.year}`:"");
  }
  function relation(row:CmsRecord,key:string):unknown {
    if(row[key])return row[key];
    const result=lookup("cms_results",row.result_id);
    const entry=lookup("cms_entries",row.entry_id||result?.entry_id);
    return result?.[key]||entry?.[key]||"";
  }
  const filterFields=[{key:"season_id",label:"Sezona",table:"cms_seasons"},{key:"round_id",label:"Posms",table:"cms_rounds"},{key:"class_id",label:"Klase",table:"cms_classes"},{key:"team_id",label:"Komanda",table:"cms_racing_teams"}].filter(field=>records.some(row=>relation(row,field.key)) || fieldsForSection(field.key) || (["rezultati","braucieni"].includes(section) && ["season_id","round_id","class_id","team_id"].includes(field.key)));
  function fieldsForSection(key:string){return (config.fields as CmsField[]).some(field=>field.key===key);}
  const visibleRecords=records.filter(row=>(!search||`${label(config.table,row)} ${row.car||""} ${row.start_number||""} ${row.notes||""}`.toLocaleLowerCase("lv").includes(search.toLocaleLowerCase("lv")))&&Object.entries(filters).every(([key,value])=>!value||(key==="published"?String(row.published)===value:key==="archived"?String(row.archived)===value:String(relation(row,key))===value)));
  function lookupOptions(field:CmsField){return (lookups[field.table||""]||[]).filter(row=>{
    if(field.table==="cms_seasons"||field.table==="cms_racing_teams"||field.table==="cms_participants"||field.table==="cms_events")return true;
    const keys=["season_id",...(field.table==="cms_entries"||field.table==="cms_results"?["class_id","team_id"]:[]),...(field.table==="cms_results"?["round_id"]:[])];
    return keys.every(key=>!editing?.[key]||String(relation(row,key))===String(editing[key]));
  });}

  const fields = config.fields as CmsField[];
  function open(record?: CmsRecord) {
    if (pending) return;
    setEditing(record ? { ...record } : { id: "", published: false, active: true, sort_order: 0, year: new Date().getFullYear(), archived: false, scoring_mode: "position", points_scale: "40,32,26,20,18,16,12,10", best_rounds: 0, team_best: 0, status: "OK", run_number: 1, ...Object.fromEntries(Object.entries(filters).filter(([key]) => key.endsWith("_id"))), file_type: "PDF", document_ids: [], image_source: "upload" }); setMessage(""); setDeleting(null);
  }
  function change(key: string, value: string | boolean | string[]) { setEditing(current => {
    if(!current)return current;
    const updated={...current,[key]:value};
    if(key==="season_id"){updated.class_id="";updated.round_id="";updated.entry_id="";}
    if(key==="participant_id"){const person=lookup("cms_participants",value);updated.team_id=person?.team_id||"";updated.car=person?.car||"";}
    return updated;
  }); }
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
  function title(record: CmsRecord) { return resultSection ? label(config.table,record) : String(record.title || record.name || record.alt || `${record.first_name ?? ""} ${record.last_name ?? ""}`); }
  function recordLabel(record: CmsRecord) { return section === "galerija" ? <span className="cms-gallery-row"><Image src={String(record.image)} alt="" width={56} height={56} unoptimized /><span>{title(record)}</span></span> : title(record); }
  return <>
    <header className="cms-heading"><div><h1>{config.title}</h1><p>{records.length} {records.length === 1 ? "ieraksts" : "ieraksti"}</p></div><button type="button" onClick={() => open()} disabled={pending}><Plus size={18} />Pievienot</button></header>
    {resultSection && <p className="cms-guide">Izveido sezonu, klases un posmus, pievieno dalībniekus un viņu sezonas startus, tad ievadi rezultātus. Publicē arī saistītos ierakstus. Komanda sezonas startā saglabā konkrētās sezonas piederību. Vienādu kopvērtējuma punktu gadījumā salīdzina 1. vietu skaitu, tad 2., 3. un tālāk. Ja arī tās sakrīt, vieta ir dalīta.</p>}
    {!editing && resultSection && <div className="cms-filters"><label>Meklēt<input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Nosaukums, dalībnieks, auto…"/></label>{filterFields.map(field=><label key={field.key}>{field.label}<select value={filters[field.key]||""} onChange={event=>setFilters(current=>({...current,[field.key]:event.target.value,...(field.key==="season_id"?{round_id:"",class_id:""}:{})}))}><option value="">Visi</option>{(lookups[field.table]||[]).filter(row=>!filters.season_id||!row.season_id||row.season_id===filters.season_id).map(row=><option key={row.id} value={row.id}>{label(field.table,row)}</option>)}</select></label>)}<label>Publicēšana<select value={filters.published||""} onChange={event=>setFilters(current=>({...current,published:event.target.value}))}><option value="">Visi</option><option value="true">Publicēti</option><option value="false">Melnraksti</option></select></label>{section==="sezonas"&&<label>Sezonas statuss<select value={filters.archived||""} onChange={event=>setFilters(current=>({...current,archived:event.target.value}))}><option value="">Visas</option><option value="false">Aktīvas</option><option value="true">Arhivētas</option></select></label>}<button className="cms-secondary" onClick={()=>{setFilters({});setSearch("");}}>Notīrīt filtrus</button><p className="cms-filter-count">Atrasti {visibleRecords.length} no {records.length}</p></div>}
    {!editing && <p className="cms-message" role="status" aria-live="polite">{message}</p>}
    {editing ? <section className="cms-editor" aria-label={editing.id ? "Rediģēt ierakstu" : "Jauns ieraksts"}>
      <div className="cms-editor-heading"><h2>{editing.id ? "Rediģēt ierakstu" : "Jauns ieraksts"}</h2><button type="button" className="cms-secondary" disabled={pending} onClick={() => setEditing(null)}><X size={17} />Aizvērt</button></div>
      <form aria-busy={pending} onSubmit={event => { event.preventDefault(); void mutate(editing); }}>
        <fieldset disabled={pending} className="cms-fields">
          {fields.map(field => <div className={`cms-field${["textarea", "image", "gallery-image", "documents"].includes(field.type ?? "") ? " cms-field-wide" : ""}`} key={field.key}>
            {field.type === "checkbox" ? <label className="cms-checkbox"><input type="checkbox" checked={editing[field.key]===true} onChange={event=>change(field.key,event.target.checked)}/>{field.label}</label> : field.type === "lookup" ? <><label htmlFor={`cms-${field.key}`}>{field.label}{field.required?" *":""}</label><select id={`cms-${field.key}`} required={field.required} value={String(editing[field.key]||"")} onChange={event=>change(field.key,event.target.value)}><option value="">Izvēlies…</option>{lookupOptions(field).map(row=><option key={row.id} value={row.id}>{label(field.table!,row)}{!row.published?" (melnraksts)":""}</option>)}</select>{lookupOptions(field).length===0&&<small>Vispirms izveido saistītos ierakstus un izvēlies sezonu.</small>}</> : field.type === "gallery-image" ? <GalleryImageInput value={String(editing.image ?? "")} source={String(editing.image_source ?? "upload")} onChange={value => change("image", value)} onSourceChange={source => { if (!pending) setEditing(current => current ? { ...current, image_source: source, image: "" } : current); }} onBusyChange={setUploading} disabled={pending} /> :
            field.type === "image" ? <><span className="cms-field-label">{field.label}{field.required ? " *" : ""}</span><ImageUpload key={`${editing.id || "new"}-${field.key}`} onBusyChange={setUploading} value={String(editing[field.key] ?? "")} onChange={value => change(field.key, value)} logo={section === "partneri"} disabled={pending} />{field.key === "belt_image" && <small>Ja nav pievienots, joslā izmanto galveno logotipu. Kājene vienmēr izmanto galveno logotipu.</small>}</> : field.type === "documents" ? <fieldset className="cms-document-picker"><legend>{field.label}</legend>{documents.length === 0 ? <p>Vispirms pievieno dokumentus sadaļā “Dokumenti”.</p> : documents.map(document => <label className="cms-checkbox" key={document.id}><input type="checkbox" checked={Array.isArray(editing.document_ids) && editing.document_ids.includes(document.id)} onChange={event => change("document_ids", event.target.checked ? [...(Array.isArray(editing.document_ids) ? editing.document_ids : []), document.id] : (Array.isArray(editing.document_ids) ? editing.document_ids : []).filter(id => id !== document.id))} />{document.title}{!document.published && <small>(melnraksts)</small>}</label>)}</fieldset> : <>
              <label htmlFor={`cms-${field.key}`}>{field.label}{field.required ? " *" : ""}</label>
              {field.type === "textarea" ? <textarea id={`cms-${field.key}`} value={String(editing[field.key] ?? "")} required={field.required} rows={field.key === "body" ? 12 : 5} onChange={event => change(field.key, event.target.value)} /> : field.type === "category" || field.type === "select" ? <select id={`cms-${field.key}`} required={field.required} value={String(editing[field.key] ?? "")} onChange={event => change(field.key, event.target.value)}><option value="">Izvēlies…</option>{field.type === "category" ? categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>) : field.options?.map(option => <option key={option} value={option}>{field.key === "car_brand" ? carBrands.find(brand=>brand.id===option)?.name || option : field.key === "scoring_mode" ? ({position:"Pēc vietas posmā",run_sum:"Braucienu punktu summa",manual:"Manuāli ievadīti punkti"}[option] || option) : option}</option>)}</select> : <input id={`cms-${field.key}`} type={field.type === "decimal" ? "number" : field.type ?? "text"} step={field.type === "decimal" ? "any" : undefined} required={field.required} value={String(editing[field.key] ?? "")} readOnly={section === "lietotaji" && !!editing.id && field.key === "email"} onChange={event => change(field.key, event.target.value)} />}
            </>}
          {field.help&&<small>{field.help}</small>}</div>)}
          {section === "lietotaji" && !editing.id && <label className="cms-field">Sākotnējā parole<input type="password" autoComplete="new-password" minLength={12} maxLength={128} required onChange={event => change("password", event.target.value)} /><small>Vismaz 12 rakstzīmes. Nodod paroli lietotājam privāti.</small></label>}
          {section === "lietotaji" ? <label className="cms-checkbox"><input type="checkbox" checked={editing.active !== false} disabled={editing.id === currentUserId} onChange={event => change("active", event.target.checked)} />Aktīva pieeja CMS</label> : section !== "kategorijas" && <label className="cms-checkbox"><input type="checkbox" checked={editing.published === true} onChange={event => change("published", event.target.checked)} />Publicēts mājaslapā</label>}
        </fieldset>
        {section === "raksti" && editing.published_at && <p>Publicēts: {new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Riga" }).format(new Date(String(editing.published_at)))}</p>}
        <p className="cms-message" role="status" aria-live="polite">{message}</p><div className="cms-form-actions"><button disabled={pending} type="submit">{uploading ? "Augšupielādē attēlu…" : busy ? "Saglabā…" : "Saglabāt"}</button><button type="button" className="cms-secondary" disabled={pending} onClick={() => setEditing(null)}>Atcelt</button></div>
      </form>
    </section> : <><p className="cms-scroll-hint">Ritini tabulu pa labi, lai redzētu visus laukus un darbības.</p><div className="cms-table-wrap" role="region" aria-label={`${config.title}: ierakstu tabula`} tabIndex={0}><table><thead><tr><th>{section === "lietotaji" || section === "komanda" ? "Vārds, uzvārds" : "Nosaukums"}</th><th>{section === "lietotaji" || section === "komanda" ? "E-pasts" : section === "raksti" ? "Publicēšanas datums" : "Informācija"}</th>{resultSection&&<><th>Sezona / posms</th><th>Klase / komanda</th><th>Vērtējums</th></>}<th>Statuss</th><th><span className="sr-only">Darbības</span></th></tr></thead><tbody>
      {visibleRecords.map(record => <tr key={record.id}><th scope="row">{recordLabel(record)}</th><td>{String((resultSection ? (record.season_id ? lookup("cms_seasons",record.season_id)?.name : record.car || record.year || "") : "") || record.email || (record.published_at ? new Intl.DateTimeFormat("lv-LV", { dateStyle: "medium", timeZone: "Europe/Riga" }).format(new Date(String(record.published_at))) : record.event_date || record.file_type || record.url || "—"))}</td>{resultSection&&<><td>{String(lookup("cms_seasons",relation(record,"season_id"))?.name||"—")}<br/>{String(lookup("cms_rounds",relation(record,"round_id"))?.name||"")}</td><td>{String(lookup("cms_classes",relation(record,"class_id"))?.name||"—")}<br/>{String(lookup("cms_racing_teams",relation(record,"team_id"))?.name||"")}</td><td>{section==="rezultati"?<>{record.status !== "OK"?record.status:record.position?`${record.position}. vieta`:"Vieta nav ievadīta"}<br/>{record.points==null?"Punkti: pēc sezonas sistēmas":`${record.points} punkti`}</>:section==="braucieni"?<>{record.time_ms??"—"} ms<br/>{record.points??"—"} punkti</>:"—"}</td></>}<td>{section === "kategorijas" ? "Pieejama" : section === "lietotaji" ? record.active ? "Aktīvs" : "Neaktīvs" : record.published ? "Publicēts" : "Melnraksts"}</td><td><div className="cms-row-actions"><button className="cms-secondary" onClick={() => open(record)} disabled={pending} aria-label={`Rediģēt: ${title(record)}`}><Pencil size={16} /><span>Rediģēt</span></button>{section !== "lietotaji" && <button className="cms-secondary" onClick={() => setDeleting(record.id)} disabled={pending} aria-label={`Dzēst: ${title(record)}`}><Trash2 size={16} /></button>}</div>{deleting === record.id && <div className="cms-delete-confirm"><p>Dzēst šo ierakstu?</p><button disabled={pending} onClick={() => void mutate({ action: "delete", id: record.id })}>Dzēst</button><button disabled={pending} className="cms-secondary" onClick={() => setDeleting(null)}>Atcelt</button></div>}</td></tr>)}
      {!visibleRecords.length && <tr><td colSpan={resultSection?7:4} className="cms-empty">Nav atbilstošu ierakstu. Notīri filtrus vai spied “Pievienot”, lai izveidotu ierakstu.</td></tr>}
    </tbody></table></div></>}
  </>;
}
