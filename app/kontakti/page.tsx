import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getContactContent } from "@/lib/contact-content";
import { TeamGrid } from "@/components/contact/team-grid";
import "./kontakti.css";

export const metadata: Metadata = {
  title: "Kontakti — LR Events",
  description:
    "Sazinies ar LR Events komandu. Biedrības kontakti, rekvizīti un informācija sadarbībai.",
};

export default function ContactsPage() {
  return <Suspense fallback={<main id="main-content" className="contact-page container" aria-busy="true"><h1>Kontakti</h1><p role="status">Ielādē kontaktinformāciju…</p></main>}><ContactContentPage /></Suspense>;
}

async function ContactContentPage() {
  const { associationName, associationDetails, introduction, email, team } = await getContactContent();
  return (
    <main id="main-content" className="contact-page container">
      <nav className="contact-breadcrumb" aria-label="Atrašanās vieta">
        <Link href="/">Sākums</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Kontakti</span>
      </nav>
      <h1>Kontakti</h1>
      <div className="contact-overview">
        <section
          className="contact-details"
          aria-labelledby="association-heading"
        >
          <h2 id="association-heading">{associationName}</h2>
          <dl>
            {associationDetails.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          className="contact-introduction"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading">Sazinies ar mums</h2>
          <p>{introduction}</p>
          <a
            className="contact-main-email"
            href={`mailto:${email}`}
          >
            {email}
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </section>
      </div>
      <section className="contact-team" aria-labelledby="team-heading">
        <h2 id="team-heading">Mūsu komanda</h2>
        <TeamGrid team={team} />
      </section>
    </main>
  );
}
