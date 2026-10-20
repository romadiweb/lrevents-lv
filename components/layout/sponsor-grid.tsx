const sponsorSlots = Array.from({ length: 12 }, (_, index) => ({
  id: `sponsor-${index + 1}`,
  label: `Atbalstītājs ${String(index + 1).padStart(2, "0")}`,
}));

export function SponsorGrid() {
  return (
    <section
      className="footer-sponsors"
      aria-label="Atbalstītāju logotipu vietas"
    >
      <ul className="sponsor-grid">
        {sponsorSlots.map(({ id, label }) => (
          <li className="sponsor-placeholder" key={id}>
            <span>{label}</span>
            <span className="sponsor-placeholder-caption">Logotipa vieta</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
