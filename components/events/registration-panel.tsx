"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { registrationLabels, type RegistrationSnapshot } from "@/lib/registration/types";
export function RegistrationPanel({ initial, form = false }: { initial: RegistrationSnapshot; form?: boolean }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      try { const response = await fetch(`/api/registrations?event=${encodeURIComponent(initial.slug)}`, { signal: controller.signal }); if (response.ok) setSnapshot(await response.json()); } catch { /* Keep last successful snapshot. The submission rechecks availability. */ }
    }
    const timer = setInterval(refresh, 30000); window.addEventListener("focus", refresh);
    return () => { clearInterval(timer); controller.abort(); window.removeEventListener("focus", refresh); };
  }, [initial.slug]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const payload = { ...Object.fromEntries(data), class_ids: data.getAll("class_ids"), event_id: snapshot.id, rules_url: snapshot.rulesUrl, consent: data.get("rules") === "on" && data.get("privacy") === "on" };
    try {
      const response = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json(); if (!response.ok) throw Error(result.error || "Pieteikumu neizdevās nosūtīt."); setReceipt(result.reference);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Savienojums neizdevās. Mēģini vēlreiz."); } finally { setBusy(false); }
  }
  return <section id="dalibnieki" className="registration-section" aria-labelledby="registration-title">
    <div className="registration-heading"><div><p className="registration-eyebrow">Dalība sacensībās</p><h2 id="registration-title">{form ? "Pieteikšanās pasākumam" : "Reģistrācija un dalībnieki"}</h2></div><span className={`registration-state is-${snapshot.state}`}>{registrationLabels[snapshot.state]}</span></div>
    <p className="registration-capacity"><strong>{snapshot.accepted} / {snapshot.capacity}</strong> apstiprināti dalībnieki</p>
    <p>Pieteikšanās no {snapshot.opensOn.split("-").reverse().join(".")} līdz {snapshot.closesOn.split("-").reverse().join(".")} plkst. 18.00 (Latvijas laiks), kamēr pieejamas vietas. Pieteikuma nosūtīšana vēl negarantē dalību.</p>
    {snapshot.rulesUrl && <p><a className="event-inline-link" href={snapshot.rulesUrl} target="_blank" rel="noopener noreferrer">Lasīt sacensību nolikumu <span className="sr-only">(jaunā cilnē)</span>↗</a></p>}
    {!form && snapshot.state === "open" && <Link className="primary-button" href={`/pasakumi/${snapshot.slug}/registracija`}>Pieteikties pasākumam →</Link>}
    {form && receipt ? <div className="registration-receipt" role="status"><h3>Pieteikums saņemts</h3><p>Atsauce: <strong>{receipt}</strong>. Organizators pārbaudīs datus un dalības maksu. Pēc apstiprināšanas tavs vārds parādīsies šī pasākuma dalībnieku sarakstā.</p><p>Ja jāprecizē pieteikums, sazinies ar <Link href="/kontakti">organizatoru</Link>, norādot šo atsauci.</p></div> : form && snapshot.state === "open" && <form className="race-registration-form" onSubmit={submit}>
      <fieldset disabled={busy}><legend>Dalībnieka dati</legend><div className="registration-fields">
        <label>Vārds *<input name="first_name" autoComplete="given-name" maxLength={80} required /></label><label>Uzvārds *<input name="last_name" autoComplete="family-name" maxLength={80} required /></label>
        <label>E-pasts *<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Tālrunis *<input name="phone" type="tel" autoComplete="tel" minLength={5} maxLength={40} required /></label>
        <label>Automašīna *<input name="car" placeholder="Piemēram, BMW 325" maxLength={120} required /></label><label>Komanda<select name="team_id" defaultValue=""><option value="">Bez komandas</option>{snapshot.teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}</select></label>
        <label>Vēlamais starta numurs<input name="start_number" maxLength={20} /></label><label>Licences numurs (ja ir)<input name="licence_number" maxLength={80} /></label>
      </div></fieldset>
      <fieldset disabled={busy} className="registration-classes"><legend>Klases *</legend><p>Izvēlies no vienas līdz trim klasēm atbilstoši nolikumam.</p>{snapshot.classes.map(item => <label key={item.id}><input type="checkbox" name="class_ids" value={item.id} />{item.name}</label>)}</fieldset>
      <div className="registration-honeypot" aria-hidden="true"><label>Mājaslapa<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="registration-consents"><label><input type="checkbox" name="rules" required disabled={busy} /><span>Esmu iepazinies ar <a href={snapshot.rulesUrl} target="_blank" rel="noopener noreferrer">sacensību nolikumu</a> un piekrītu dalības nosacījumiem *</span></label><label><input type="checkbox" name="privacy" required disabled={busy} /><span>Esmu informēts, ka organizators izmantos manus kontaktus pieteikuma izskatīšanai un saziņai par sacensībām. Pēc apstiprināšanas publiski būs redzams vārds, uzvārds, auto, klases, komanda un starta numurs. Kontakti un licences numurs netiks publicēti *</span></label></div>
      <p className="registration-note">Dalību apstiprina organizators pēc dalības maksas saņemšanas vai atbrīvojuma no maksas. Šis pieteikums neaizstāj dokumentu parakstīšanu un tehnisko pārbaudi sacensību dienā. Nepilngadīgajiem jāievēro nolikumā norādītās papildu prasības.</p>
      {error && <p className="registration-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={busy}>{busy ? "Nosūta pieteikumu…" : "Nosūtīt pieteikumu →"}</button>
    </form>}
    <div className="registration-list"><h3>Apstiprinātie dalībnieki <span>({snapshot.accepted})</span></h3>{snapshot.participants.length ? <div className="registration-table-wrap"><table><caption className="sr-only">{snapshot.title}: apstiprinātie dalībnieki</caption><thead><tr><th scope="col">Nr.</th><th scope="col">Dalībnieks</th><th scope="col">Automašīna</th><th scope="col">Klases</th><th scope="col">Komanda</th></tr></thead><tbody>{snapshot.participants.map(person => <tr key={person.registration_id}><td>{person.start_number || "—"}</td><th scope="row">{person.driver}</th><td>{person.car}</td><td>{person.class_names.join(", ")}</td><td>{person.team_name || "—"}</td></tr>)}</tbody></table></div> : <p>Apstiprināto dalībnieku vēl nav. Šeit parādīsies organizatora apstiprinātie pieteikumi.</p>}</div>
  </section>;
}
