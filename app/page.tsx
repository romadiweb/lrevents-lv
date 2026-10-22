import { HeroSection } from "@/components/home/hero-section";
import { SponsorBelt } from "@/components/home/sponsor-belt";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { ArticlesSection } from "@/components/home/articles-section";
import { GallerySection } from "@/components/home/gallery-section";
import { StandingsSection } from "@/components/home/standings-section";
import { getArticles, getEvents } from "@/lib/cms/content";
import { rigaDate } from "@/lib/events";
import { Suspense } from "react";
import { connection } from "next/server";

async function HomeContent() {
  await connection();
  const [articles, events] = await Promise.all([getArticles(), getEvents()]);
  const upcomingEvents = events.filter(event => (event.endDate ?? event.date) >= rigaDate(new Date()));
  return (
    <main id="main-content">
      <HeroSection featuredEvent={upcomingEvents[0]} />
      <SponsorBelt />
      <UpcomingEvents events={upcomingEvents} />
      <ArticlesSection articles={articles.slice(0, 4)} />
      <StandingsSection />
      <GallerySection />
    </main>
  );
}
export default function Home() { return <Suspense fallback={<main id="main-content"><p className="container">Ielādē…</p></main>}><HomeContent /></Suspense>; }
