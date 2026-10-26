import { getSponsors } from "@/lib/cms/content";
import { SponsorMark } from "@/components/layout/sponsor-mark";
import { SponsorBeltTrack } from "./sponsor-belt-track";
import "./sponsor-belt.css";

export async function SponsorBelt() {
  const sponsors = await getSponsors();

  return <section className="sponsor-belt" aria-label="LR Events atbalstītāji">
    <div className="container sponsor-belt-inner">
      <SponsorBeltTrack duplicate={<ul className="sponsor-belt-group" aria-hidden="true">{sponsors.map(sponsor => <li className="sponsor-belt-mark" key={sponsor.id}><SponsorMark sponsor={sponsor} variant="belt" duplicate /></li>)}</ul>}>
        <ul className="sponsor-belt-group">{sponsors.map(sponsor => <li className="sponsor-belt-mark" key={sponsor.id}><SponsorMark sponsor={sponsor} variant="belt" /></li>)}</ul>
      </SponsorBeltTrack>
    </div>
  </section>;
}
