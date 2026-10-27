"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nameKey, reviewLabels } from "@/lib/registration/types";
type Person = { id: string; first_name: string; last_name: string; car: string };
type Request = { id: string; event_id: string; first_name: string; last_name: string; email: string; phone: string; car: string; class_ids: string[]; team_id: string | null; start_number: string; licence_number: string; status: string; payment_status: string; participant_id: string | null; known_person: string | null; rules_url: string; created_at: string; reviewed_at: string | null };
type Inbox = { pending: number; total: number; rows: Request[]; events: { id: string; title: string; event_date: string; registration_capacity: number; registration_status: string }[]; people: Person[]; classes: { id: string; name: string }[] };
function Review({ request, inbox, saved }: { request: Request; inbox: Inbox; saved: () => void }) {
  const [person, setPerson] = useState(request.participant_id || request.known_person || "");
  const [payment, setPayment] = useState(request.payment_status);
  const [number, setNumber] = useState(request.start_number);
  const [newPerson, setNewPerson] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const matches = inbox.people.filter(item => nameKey(item.first_name, item.last_name) === nameKey(request.first_name, request.last_name));
  const locked = !!(request.participant_id || request.known_person);
  async function decide(decision: string) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: request.id, decision, person_id: person || null, payment, number, new_person: newPerson }) });
      const result = await response.json(); if (!response.ok) throw Error(result.error); saved();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Savienojums neizdevās."); } finally { setBusy(false); }
  }
  return <details className="cms-registration-request"><summary><span><strong>{request.first_name} {request.last_name}</strong><small>{inbox.events.find(event => event.id === request.event_id)?.title || "Pasākums"} · {request.car}</small></span><span>{reviewLabels[request.status]}<small>{new Date(request.created_at).toLocaleString("lv-LV", { timeZone: "Europe/Riga" })} · #{request.id.slice(0, 8)}</small></span></summary>
    <div className="cms-registration-detail"><dl><div><dt>E-pasts</dt><dd><a href={`mailto:${request.email}`}>{request.email}</a></dd></div><div><dt>Tālrunis</dt><dd>{request.phone}</dd></div><div><dt>Klases</dt><dd>{request.class_ids.map(id => inbox.classes.find(item => item.id === id)?.name || id).join(", ")}</dd></div><div><dt>Licence</dt><dd>{request.licence_number || "Nav norādīta"}</dd></div><div><dt>Pieņemtais nolikums</dt><dd><a href={request.rules_url} target="_blank" rel="noopener noreferrer">Atvērt nolikumu ↗</a></dd></div></dl>
      <fieldset disabled={busy}><legend>Dalībnieka pārbaude un lēmums</legend>
        <p>{locked ? "Pieteikums ir saistīts ar esošu dalībnieku. Tiks izmantots tas pats profils un sezonas starti." : matches.length ? "Atrasts dalībnieks ar tādu pašu vārdu. Pārbaudi personu un izvēlies esošo profilu. Ja tas ir cits cilvēks, apstiprini jauna profila izveidi." : "Pārbaudi, vai šis cilvēks jau nav reģistrēts ar citu vārda rakstību. Ja nav, apstiprinot tiks izveidots viens dalībnieka profils."}</p>
        <label className="cms-field">Esošais dalībnieks<select value={person} disabled={locked || busy} onChange={event => { setPerson(event.target.value); setNewPerson(false); }}><option value="">Izveidot jaunu dalībnieku</option>{inbox.people.map(item => <option key={item.id} value={item.id}>{item.first_name} {item.last_name} · {item.car || item.id.slice(0, 8)}{matches.some(match => match.id === item.id) ? " (vārds sakrīt)" : ""}</option>)}</select></label>
        {!locked && !person && matches.length > 0 && <label className="cms-checkbox"><input type="checkbox" checked={newPerson} onChange={event => setNewPerson(event.target.checked)} />Pārbaudīju: tas ir cits cilvēks ar tādu pašu vārdu</label>}
        <div className="cms-registration-controls"><label className="cms-field">Dalības maksa<select value={payment} onChange={event => setPayment(event.target.value)}><option value="unpaid">Nav saņemta</option><option value="paid">Saņemta</option><option value="exempt">Atbrīvots no maksas</option></select></label><label className="cms-field">Apstiprinātais starta numurs<input value={number} maxLength={20} onChange={event => setNumber(event.target.value)} /></label></div>
        <p className="cms-guide">Apstiprināšana izveido tikai trūkstošos sezonas startus izvēlētajās klasēs. Iepriekšējie rezultāti un sezonas startu dati netiek pārrakstīti. Rezultātus ievadi sadaļās “Rezultāti” un “Braucienu laiki”.</p>
        {error && <p role="alert" className="cms-registration-error">{error}</p>}
        <div className="cms-registration-actions"><button className="cms-primary" disabled={busy || payment === "unpaid" || !person && matches.length > 0 && !newPerson} onClick={() => void decide("accepted")}>{busy ? "Saglabā…" : request.status === "accepted" ? "Saglabāt apstiprinājumu" : "Apstiprināt dalību"}</button>{request.status !== "accepted" && <button onClick={() => void decide("waitlisted")}>Gaidīšanas sarakstā</button>}<button onClick={() => void decide(request.status === "accepted" ? "cancelled" : "rejected")}>{request.status === "accepted" ? "Atcelt dalību" : "Noraidīt"}</button></div>
      </fieldset>
    </div>
  </details>;
}
export function RegistrationInbox() {
  const [inbox, setInbox] = useState<Inbox | null>(null); const [status, setStatus] = useState("pending"); const [event, setEvent] = useState(""); const [page, setPage] = useState(0); const [error, setError] = useState(""); const [loading, setLoading] = useState(true); const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/registrations?${new URLSearchParams({ status, event, page: String(page) })}`, { signal: controller.signal })
      .then(async response => { const result = await response.json(); if (!response.ok) throw Error(result.error); return result as Inbox; })
      .then(result => { setInbox(result); setError(""); })
      .catch(cause => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Savienojums neizdevās."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [status, event, page, revision]);
  return <><div className="cms-heading"><div><h1>Sacensību pieteikumi</h1><p className="cms-guide">{inbox ? `${inbox.pending} jauni pieteikumi` : "Pieteikumu pārbaude un dalības apstiprināšana"}. Pieteikumi parādās šeit; publiskajā sarakstā nonāk tikai apstiprinātie dalībnieki.</p></div><button onClick={() => { setLoading(true); setRevision(value => value + 1); }} disabled={loading}>Atjaunot</button></div><p className="cms-guide">Reģistrācijas statusu, nolikumu, termiņus un vietu skaitu iestati sadaļā <Link href="/admin/pasakumi">Pasākumi</Link>. Kopējais cilvēku reģistrs: <Link href="/admin/dalibnieki">Dalībnieki</Link>.</p>
    <div className="cms-registration-filters"><label>Statuss<select value={status} onChange={e => { setLoading(true); setStatus(e.target.value); setPage(0); }}><option value="all">Visi</option>{Object.entries(reviewLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Pasākums<select value={event} onChange={e => { setLoading(true); setEvent(e.target.value); setPage(0); }}><option value="">Visi pasākumi</option>{inbox?.events.map(item => <option key={item.id} value={item.id}>{item.title} · {item.event_date}</option>)}</select></label></div>
    {error && <p role="alert">{error}</p>}{loading && <p role="status">Atjauno pieteikumus…</p>}
    {inbox && <div aria-busy={loading}>{inbox.rows.length ? inbox.rows.map(request => <Review key={`${request.id}-${request.reviewed_at || "new"}`} request={request} inbox={inbox} saved={() => { setLoading(true); setRevision(value => value + 1); window.dispatchEvent(new Event("registration-reviewed")); }} />) : <p className="cms-guide">Šajā atlasē pieteikumu nav.</p>}<div className="cms-registration-pagination"><button disabled={page === 0 || loading} onClick={() => { setLoading(true); setPage(value => value - 1); }}>Iepriekšējie</button><span>{page + 1}. lapa · {inbox.total} pieteikumi</span><button disabled={(page + 1) * 50 >= inbox.total || loading} onClick={() => { setLoading(true); setPage(value => value + 1); }}>Nākamie</button></div></div>}
  </>;
}
export function RegistrationNotification() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() { if (document.visibilityState !== "visible") return; try { const response = await fetch("/api/admin/registrations?count=1", { signal: controller.signal }); if (response.ok) setCount((await response.json()).pending); } catch { /* Retain badge until next successful refresh. */ } }
    void refresh(); const timer = setInterval(refresh, 30000); window.addEventListener("focus", refresh); window.addEventListener("registration-reviewed", refresh);
    return () => { clearInterval(timer); controller.abort(); window.removeEventListener("focus", refresh); window.removeEventListener("registration-reviewed", refresh); };
  }, []);
  return count ? <span className="cms-notification-count" aria-label={`${count} jauni pieteikumi`}>{count}</span> : null;
}
