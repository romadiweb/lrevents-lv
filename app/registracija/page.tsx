import type { Metadata } from "next";
import Link from "next/link";
import { getEvents, getTodayInRiga } from "@/lib/cms/content";
import { getRegistration } from "@/lib/registration/content";
import { registrationLabels } from "@/lib/registration/types";
import { formatEventDate } from "@/lib/events";
import "./registration.css";
export const metadata: Metadata = { title: "Reģistrācija sacensībām | LR Events", description: "Izvēlies sacensības, apskati reģistrācijas statusu un piesakies dalībai." };
export default async function Page() {
  const [events, today] = await Promise.all([getEvents(), getTodayInRiga()]);
  const snapshots = (await Promise.all(events.filter(event => !event.isDemo && event.date >= today).map(event => getRegistration(event.id)))).filter(item => item !== null);
  return <main id="main-content" className="container registration-page site-content-page"><p className="registration-eyebrow">Dalībniekiem</p><h1>Piesakies sacensībām</h1><p>Katram pasākumam ir atsevišķs pieteikums. Izvēlies sacensības un iepazīsties ar nolikumu. Organizators pārbaudīs pieteikumu un apstiprinās dalību.</p>{snapshots.length ? <ul className="registration-events">{snapshots.map(event => <li key={event.id}><h2><Link href={`/pasakumi/${event.slug}`}>{event.title}</Link></h2><span className={`registration-state is-${event.state}`}>{registrationLabels[event.state]}</span><p>{formatEventDate(event.date)} · Apstiprināti {event.accepted} no {event.capacity} dalībniekiem</p><Link className="event-inline-link" href={event.state === "open" ? `/pasakumi/${event.slug}/registracija` : `/pasakumi/${event.slug}#dalibnieki`}>{event.state === "open" ? "Pieteikties →" : "Dalībnieki un informācija →"}</Link></li>)}</ul> : <p className="registration-section">Pašlaik nav publicētu gaidāmo sacensību. Reģistrācija būs pieejama, kad organizators publicēs nākamo pasākumu.</p>}<Link href="/dalibniekiem">Dalības nosacījumi un noderīga informācija →</Link></main>;
}
