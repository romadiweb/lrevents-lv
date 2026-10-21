import { HeroSection } from "@/components/home/hero-section";
import { SponsorBelt } from "@/components/home/sponsor-belt";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { ArticlesSection } from "@/components/home/articles-section";
import { GallerySection } from "@/components/home/gallery-section";
import { StandingsSection } from "@/components/home/standings-section";
import { articlePreviews, upcomingEvents } from "@/lib/mock-events";

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <SponsorBelt />
      <UpcomingEvents events={upcomingEvents} />
      <ArticlesSection articles={articlePreviews} />
      <StandingsSection />
      <GallerySection />
    </main>
  );
}
