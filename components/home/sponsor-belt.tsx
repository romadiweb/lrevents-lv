import { getSponsors } from "@/lib/cms/content";
import { SponsorMark } from "@/components/layout/sponsor-mark";
import "./sponsor-belt.css";

export async function SponsorBelt() {
  const sponsors = await getSponsors();

  return <section className="sponsor-belt" aria-label="LR Events atbalstītāji">
    <div className="container sponsor-belt-inner">
      <div className="sponsor-belt-window">
        <div className="sponsor-belt-track">
          {[0, 1].map(copy => <ul className="sponsor-belt-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{sponsors.map(sponsor => <li className="sponsor-belt-mark" key={sponsor.id}><SponsorMark sponsor={sponsor} variant="belt" duplicate={copy === 1} /></li>)}</ul>)}
        </div>
      </div>
    </div>
  </section>;
}
