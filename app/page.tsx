import { HeroSection } from "@/components/home/hero-section";
import { UpcomingEvents } from "@/components/events/upcoming-events";
import { ArticlesSection } from "@/components/home/articles-section";
import { articlePreviews, upcomingEvents } from "@/lib/mock-events";

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <UpcomingEvents events={upcomingEvents} />
      <ArticlesSection articles={articlePreviews} />
    </main>
  );
}
