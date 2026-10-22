import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock3, FileText, MapPin } from "lucide-react";
import { events as demoEvents, formatEventDate, rigaDate } from "@/lib/events";
import { getEvents } from "@/lib/cms/content";
import { StandingsSection } from "@/components/home/standings-section";
import "../pasakumi.css";

type EventPageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return demoEvents.map((event) => ({ slug: event.id })); }
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((item) => item.id === slug);
  return { title: event ? `${event.title} — LR Events` : "Pasākums nav atrasts — LR Events", description: event?.summary, robots: event?.isDemo ? { index: false } : undefined };
}

async function EventContent({ params }: EventPageProps) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((item) => item.id === slug);
  if (!event) notFound();
  await connection();
  const hasEnded = (event.endDate ?? event.date) < rigaDate(new Date());
  return <main id="main-content" className="event-detail-page site-content-page">
    <header className="event-detail-hero">
      <Image src={event.image} alt="" fill sizes="100vw" loading="eager" className="event-detail-hero-image" />
      <div className="event-detail-hero-shade" aria-hidden="true" />
      <div className="container event-detail-hero-content">
        <nav className="events-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><Link href="/pasakumi">Pasākumi</Link><span aria-hidden="true">/</span><span aria-current="page">{event.title}</span></nav>
        <h1>{event.title}</h1>
        <div className="event-detail-hero-meta"><span><MapPin size={17} aria-hidden="true" />{event.city} · {event.venue}</span><span><CalendarDays size={17} aria-hidden="true" /><time dateTime={event.date}>{formatEventDate(event.date)}</time></span></div>
        <div className="event-detail-actions">
          {hasEnded ? <a href="#norises-vieta" className="primary-button">Pasākuma informācija<ArrowRight size={17} aria-hidden="true" /></a> : event.registrationHref ? <a href={event.registrationHref} className="primary-button">Reģistrēties<ArrowUpRight size={17} aria-hidden="true" /></a> : <a href="#daliba" className="primary-button">Dalībnieku informācija<ArrowRight size={17} aria-hidden="true" /></a>}
          <a href="#norises-vieta" className="event-detail-secondary">Norises vieta</a>
          <a href="#pasakuma-dokumenti" className="event-detail-secondary">Dokumenti</a>
        </div>
        {event.isDemo && <p className="event-hero-demo">Paraugpasākums — datums un norises informācija vēl nav apstiprināta.</p>}
      </div>
    </header>

    <div className="container event-detail-information">
      <section className="event-venue" id="norises-vieta" aria-labelledby="event-venue-title">
        <div className="event-venue-heading"><h2 id="event-venue-title">Norises vieta</h2><span>{event.city}</span></div>
        <div className="event-venue-grid"><div className="event-venue-copy"><h3>{event.venue}</h3><p>{event.summary}</p><p>{event.venueDescription}</p>
          <dl className="event-facts"><div><dt>Datums</dt><dd>{formatEventDate(event.date)}</dd></div><div><dt>Norise</dt><dd>{event.startLabel}</dd></div><div><dt>Pilsēta</dt><dd>{event.city}</dd></div></dl>
          {event.directionsQuery ? <a className="event-inline-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.directionsQuery)}`} target="_blank" rel="noopener noreferrer">Atvērt norises vietu kartē<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(jaunā cilnē)</span></a> : <p className="event-pending"><MapPin size={17} aria-hidden="true" />Precīza adrese tiks publicēta vēlāk.</p>}
        </div><figure className="event-venue-photo"><div><Image src={event.venueImage} alt={event.title} fill sizes="(max-width: 767px) 100vw, 55vw" /></div>{event.isDemo && <figcaption>Ilustratīvs attēls. Trases shēma un piekļuves informācija meklējama nolikumā.</figcaption>}</figure></div>
      </section>

      <div className="event-utility-grid">
        <section className="event-programme" aria-labelledby="event-programme-title"><h2 id="event-programme-title">Dienas programma</h2>
          {event.schedule.length > 0 ? <><ol>{event.schedule.map((item) => <li key={`${item.time}-${item.title}`}><span><Clock3 size={16} aria-hidden="true" />{item.time}</span><strong>{item.title}</strong></li>)}</ol><p>{hasEnded ? "Pasākums ir noslēdzies." : "Pilna programma un dalībnieku ierašanās laiks tiks precizēts nolikumā."}</p></> : <p>{hasEnded ? "Šī pasākuma programma nav pievienota." : "Programma un sākuma laiks tiks publicēts pēc apstiprināšanas."}</p>}
        </section>
        <section className="event-participation" id="daliba" aria-labelledby="event-participation-title"><h2 id="event-participation-title">Dalībniekiem</h2>
          {event.participantDescription && <p style={{ whiteSpace: "pre-line" }}>{event.participantDescription}</p>}
          <p>{hasEnded ? "Pasākums ir noslēdzies. Reģistrācija vairs nav pieejama." : event.registrationHref ? "Pirms reģistrācijas iepazīsties ar pasākuma nolikumu un dalības nosacījumiem." : "Reģistrācijas saite un dalības nosacījumi tiks publicēti kopā ar pasākuma nolikumu."}</p>
          {!hasEnded && event.registrationHref ? <a className="event-inline-link" href={event.registrationHref}>Reģistrēties pasākumam<ArrowRight size={17} aria-hidden="true" /></a> : <Link className="event-inline-link" href="/dalibniekiem">Informācija par dalību<ArrowRight size={17} aria-hidden="true" /></Link>}
        </section>
      </div>

      <section className="event-documents" id="pasakuma-dokumenti" aria-labelledby="event-documents-title"><div><h2 id="event-documents-title">Pasākuma dokumenti</h2><Link className="event-inline-link" href="/dokumenti">Visi dokumenti<ArrowRight size={17} aria-hidden="true" /></Link></div>
        {event.documents.length ? <ul>{event.documents.map((document) => <li key={document.href}><a href={document.href}><FileText size={20} aria-hidden="true" /><span>{document.title}</span><ArrowUpRight size={18} aria-hidden="true" /></a></li>)}</ul> : <p>Šī pasākuma nolikums un citi dokumenti vēl nav publicēti.</p>}
      </section>
      <Link className="event-back" href={hasEnded ? "/pasakumi/arhivs" : "/pasakumi"}><ArrowLeft size={18} aria-hidden="true" />{hasEnded ? "Iepriekšējie pasākumi" : "Visi pasākumi"}</Link>
    </div>
    <StandingsSection />
  </main>;
}

export default function EventPage(props: EventPageProps) {
  return <Suspense fallback={<main id="main-content" className="events-page container"><p className="events-loading" role="status">Ielādē pasākumu…</p></main>}><EventContent {...props} /></Suspense>;
}
