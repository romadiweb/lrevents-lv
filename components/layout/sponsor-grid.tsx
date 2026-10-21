import "./sponsor-grid.css";
import { sponsors } from "@/lib/sponsors";
import { SponsorMark } from "./sponsor-mark";

export function SponsorGrid() {
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
