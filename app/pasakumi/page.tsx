import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { rigaDate } from "@/lib/events";
import { getEvents } from "@/lib/cms/content";
import { EventCard } from "@/components/events/event-card";
import { EventCalendar } from "@/components/events/event-calendar";
import "./pasakumi.css";

export const metadata: Metadata = { title: "Pasākumi — LR Events", description: "LR Events pasākumu kalendārs, tuvākās sacensības un informācija dalībniekiem." };
type EventsPageProps = { searchParams: Promise<{ skats?: string | string[] }> };

async function EventDirectory({ searchParams }: EventsPageProps) {
  await connection();
  const today = rigaDate(new Date());
  const params = await searchParams;
  const events = await getEvents();
  if (params.skats === "arhivs") redirect("/pasakumi/arhivs");
  const listed = events.filter((event) => (event.endDate ?? event.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const calendarEvents = events.map(({ id, title, href, date, endDate, city }) => ({ id, title, href, date, endDate, city }));

  return <>
    {events.some(event => event.isDemo) && <p className="events-demo-note">Maketa saturs — pasākumu datumi un norises informācija ir ilustratīva.</p>}
    <EventCalendar events={calendarEvents} today={today} />
    <section className="events-directory" aria-labelledby="events-list-title">
      <div className="events-directory-heading"><h2 id="events-list-title">Tuvākie pasākumi</h2><span>{listed.length} {listed.length === 1 ? "pasākums" : "pasākumi"}</span></div>
      <nav className="events-view-nav" aria-label="Pasākumu saraksta skats">
        <Link href="/pasakumi#events-list-title" aria-current="page">Tuvākie pasākumi</Link>
        <Link href="/pasakumi/arhivs">Iepriekšējie pasākumi</Link>
      </nav>
      {listed.length ? <div className="events-single-column">{listed.map((event) => <EventCard event={event} key={event.id} sizes="(max-width: 1280px) 100vw, 1180px" />)}</div>
        : <div className="events-empty"><h3>Jauni pasākumi būs drīzumā</h3><p>Seko līdzi kalendāram — informācija tiks papildināta.</p><Link href="/kontakti">Sazināties ar mums<ArrowRight size={17} aria-hidden="true" /></Link></div>}
    </section>
  </>;
}

export default function EventsPage(props: EventsPageProps) {
  return <main className="events-page site-content-page" id="main-content"><div className="container">
    <nav className="events-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><span aria-current="page">Pasākumi</span></nav>
    <header className="events-page-heading"><h1>Pasākumi</h1><p>Atrodi savu nākamo startu.<br />Kalendārs, norises vietas un viss par dalību.</p></header>
    <Suspense fallback={<p className="events-loading" role="status">Ielādē pasākumu kalendāru…</p>}><EventDirectory {...props} /></Suspense>
  </div></main>;
}
