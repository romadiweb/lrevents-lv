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
      <ul className="sponsor-grid">
        {sponsors.map((sponsor) => (
          <li className="sponsor-placeholder" key={sponsor.id}>
            <SponsorMark sponsor={sponsor} />
          </li>
        ))}
      </ul>
    </section>
  );
}
