import "./sponsor-grid.css";
import { getSponsors } from "@/lib/cms/content";
import { SponsorMark } from "./sponsor-mark";

export async function SponsorGrid() {
  const sponsors = await getSponsors();
  return (
    <section
      className="footer-sponsors"
      aria-label="Atbalstītāju logotipu vietas"
    >
      {sponsors.filter(sponsor => sponsor.mainPartner).map(sponsor => <div className="sponsor-main" key={sponsor.id}><p>Galvenais partneris</p><SponsorMark sponsor={sponsor}/></div>)}
      <ul className="sponsor-grid">
        {sponsors.filter(sponsor => !sponsor.mainPartner).map((sponsor) => (
          <li className="sponsor-placeholder" key={sponsor.id}>
            <SponsorMark sponsor={sponsor} />
          </li>
        ))}
      </ul>
    </section>
  );
}
