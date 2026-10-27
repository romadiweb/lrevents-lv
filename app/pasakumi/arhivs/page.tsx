import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { getPastEvents } from "@/lib/events";
import { getEvents, getTodayInRiga } from "@/lib/cms/content";
import "../pasakumi.css";

export const metadata: Metadata = {
  title: "Iepriekšējie pasākumi — LR Events",
  description: "LR Events iepriekšējo pasākumu saraksts un informācija par noslēgušām sacensībām.",
};

async function PastEventsList() {
  const [events, today] = await Promise.all([getEvents(), getTodayInRiga()]);
  const pastEvents = getPastEvents(events, today);

  return <section className="events-archive-list" aria-labelledby="past-events-title">
    {events.some(event => event.isDemo) && <p className="events-demo-note">Paraugpasākumi — nosaukumi, datumi un norises informācija ir ilustratīva.</p>}
    <h2 id="past-events-title" className="sr-only">Iepriekšējo pasākumu saraksts</h2>
    <p className="events-archive-count">{pastEvents.length} {pastEvents.length === 1 ? "pasākums" : "pasākumi"}<span>Jaunākie vispirms</span></p>
    {pastEvents.length > 0 ? <div className="events-single-column">{pastEvents.map((event) => <EventCard event={event} key={event.id} sizes="(max-width: 1280px) 100vw, 1180px" />)}</div>
      : <div className="events-empty"><h3>Vēl nav publicētu iepriekšējo pasākumu</h3><p>Noslēgušās sacensības šeit parādīsies pēc to publicēšanas.</p><Link href="/pasakumi">Tuvākie pasākumi<ArrowRight size={17} aria-hidden="true" /></Link></div>}
  </section>;
}

export default function EventArchivePage() {
  return <main className="events-page events-archive-page site-content-page" id="main-content"><div className="container">
    <nav className="events-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><Link href="/pasakumi">Pasākumi</Link><span aria-hidden="true">/</span><span aria-current="page">Iepriekšējie pasākumi</span></nav>
    <header className="events-page-heading"><h1>Iepriekšējie pasākumi</h1><p>Noslēgušās sacensības un<br />to norises informācija vienuviet.</p></header>
    <nav className="events-view-nav" aria-label="Pasākumu saraksta skats"><Link href="/pasakumi">Tuvākie pasākumi</Link><Link href="/pasakumi/arhivs" aria-current="page">Iepriekšējie pasākumi</Link></nav>
    <PastEventsList />
  </div></main>;
}
