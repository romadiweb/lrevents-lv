import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import "./par-mums.css";

export const metadata: Metadata = {
  title: "Par LR Events | Autosports un pasākumu organizēšana",
  description:
    "Iepazīsti sporta biedrību LR Events: auto un moto sporta pasākumi, trases un tiesnešu nodrošināšana, privātie treniņi un braucieni ar sporta automašīnām.",
};

const activities = [
  {
    number: "01",
    title: "Auto, moto un sporta pasākumi",
    description:
      "Organizējam autosporta, motosporta un citus sporta pasākumus, pievēršot uzmanību gan sacensību norisei, gan dalībnieku un skatītāju pieredzei.",
    imageClass: "about-activity-photo--events",
    imageLabel: "Sacensību norise",
  },
  {
    number: "02",
    title: "Trases un personāla nodrošinājums",
    description:
      "Nodrošinām kārtībniekus un trases tiesnešus, sagatavojam ceļus un sadarbojamies ar atbildīgajiem dienestiem NMPD un VUGD klātbūtnes organizēšanā.",
    imageClass: "about-activity-photo--operations",
    imageLabel: "Trases sagatavošana",
  },
  {
    number: "03",
    title: "Treniņi un sporta auto pieredze",
    description:
      "Organizējam privātus autosporta treniņus atbilstoši saskaņotiem nosacījumiem uz koplietošanas ceļiem un slēgtās trasēs, kā arī piedāvājam braucienus ar sporta automašīnām un biedrības sporta auto izmantošanu treniņiem.",
    imageClass: "about-activity-photo--training",
    imageLabel: "Treniņi un braucieni",
  },
] as const;

const principles = [
  {
    number: "01",
    name: "Drošība",
    detail: "Pārdomāta norise, sagatavota trase un iesaistīto dienestu koordinēšana.",
  },
  {
    number: "02",
    name: "Organizācija",
    detail: "Nepieciešamie cilvēki, resursi un procesi vienotā pasākuma plānā.",
  },
  {
    number: "03",
    name: "Autosporta pieredze",
    detail: "Iespēja ne tikai vērot sacensības, bet arī piedalīties un trenēties.",
  },
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page site-content-page">
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-container about-hero-grid">
          <div className="about-hero-copy">
            <div className="about-kicker"><span className="about-kicker-line" /> SPORTA BIEDRĪBA · LR EVENTS</div>
            <h1 id="about-title">Mūs vieno <span>autosports.</span></h1>
            <p>
              Radām vietu sacensību garam. Organizējam auto, moto un sporta
              pasākumus, kuros līdzās aizrautībai ir pārdomāta un droša norise.
            </p>
            <a className="about-text-link" href="#musu-stasts">
              Iepazīsti LR Events <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="about-hero-art" role="img" aria-label="LR Events autosporta sacensību vide">
            <div className="about-hero-photo" />
            <div className="about-hero-photolabel"><span>LR / EVENTS</span><span>AUTO · MOTO · SPORTS</span></div>
            <div className="about-hero-corner" aria-hidden="true" />
          </div>
        </div>
        <div className="about-hero-baseline about-container" aria-hidden="true">
          <span>PAR MUMS</span><span>01 — 04</span>
        </div>
      </section>

      <section id="musu-stasts" className="about-story about-section" aria-labelledby="about-story-title">
        <div className="about-container about-story-grid">
          <div className="about-section-marker"><span className="about-section-index">01 /</span> MŪSU STĀSTS</div>
          <div className="about-story-body">
            <h2 id="about-story-title">Vairāk nekā <em>sacensības.</em></h2>
            <div className="about-story-columns">
              <p className="about-lead">
                LR Events ir sporta biedrība, kas specializējas auto, moto un
                sporta pasākumu organizēšanā.
              </p>
              <div className="about-story-details">
                <p>
                  Mūsu darbs ir ne tikai radīt aizraujošu sacensību atmosfēru,
                  bet arī nodrošināt cilvēkus, sagatavošanos un resursus,
                  kas nepieciešami kvalitatīvai un drošai norisei.
                </p>
                <p>
                  No trases un tiesnešu nodrošinājuma līdz privātiem
                  autosporta treniņiem — apvienojam praktisku organizāciju
                  ar iespēju piedzīvot autosportu tuvāk.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-image-interlude" aria-label="LR Events autosporta atmosfēra">
        <div className="about-image-interlude-bg" />
        <div className="about-container about-image-interlude-inner">
          <span className="about-image-note">TRASE. CILVĒKI. SACENSĪBU GARS.</span>
          <span className="about-image-monogram" aria-hidden="true">LRE</span>
        </div>
      </section>

      <section className="about-activities about-section" aria-labelledby="about-activities-title">
        <div className="about-container">
          <div className="about-section-heading">
            <div className="about-section-marker"><span className="about-section-index">02 /</span> MŪSU DARBĪBA</div>
            <div>
              <h2 id="about-activities-title">Ko mēs <em>darām.</em></h2>
              <p>Pasākuma kvalitāti nosaka detaļas, kas strādā kopā.</p>
            </div>
          </div>
          <div className="about-activity-list">
            {activities.map((activity) => (
              <article className="about-activity" key={activity.number}>
                <span className="about-activity-number">{activity.number}</span>
                <div className="about-activity-copy">
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
                <div className={`about-activity-photo ${activity.imageClass}`} role="img" aria-label={activity.imageLabel}>
                  <span>{activity.imageLabel}</span>
                </div>
                <ArrowUpRight className="about-activity-arrow" size={22} strokeWidth={1.4} aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="about-activities-footer">
            <span>VAJADZĪGS PASĀKUMA ORGANIZATORISKAIS ATBALSTS?</span>
            <Link href="/organizet-pasakumu" className="about-text-link">
              Pasākumu organizēšana <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-principles about-section" aria-labelledby="about-principles-title">
        <div className="about-container">
          <div className="about-section-marker about-section-marker--inverse"><span className="about-section-index">03 /</span> MŪSU PIEEJA</div>
          <div className="about-principles-intro">
            <h2 id="about-principles-title">Labs notikums <em>nerodas nejauši.</em></h2>
            <p>Plānošana, cilvēki un pieredze ir tikpat svarīga kā pati sacensību diena.</p>
          </div>
          <div className="about-principle-list">
            {principles.map((principle) => (
              <div className="about-principle" key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.name}</h3>
                <p>{principle.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-closing about-section" aria-labelledby="about-closing-title">
        <div className="about-container about-closing-grid">
          <div className="about-closing-content">
            <h2 id="about-closing-title">Autosports sākas <em>ar cilvēkiem.</em></h2>
            <p>
              Vēlies iesaistīties LR Events, piedalīties pasākumos vai uzzināt
              vairāk par biedrību? Sper nākamo soli.
            </p>
            <div className="about-closing-actions">
              <Link className="about-primary-link" href="/biedrs">
                Kļūsti par biedru <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <Link className="about-text-link" href="/kontakti">
                Sazinies ar mums <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
