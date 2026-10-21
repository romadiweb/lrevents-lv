import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "./organizet-pasakumu.css";

export const metadata: Metadata = {
  title: "Pasākumu organizēšana | LR Events",
  description:
    "LR Events palīdz organizēt auto, moto un sporta pasākumus: trases sagatavošana, tiesneši, kārtībnieki, drošības dienestu koordinēšana un privāti treniņi.",
};

const services = [
  {
    title: "Pasākumu organizēšana",
    description:
      "No sākotnējās ieceres līdz norises sagatavošanai un koordinēšanai. Palīdzam savienot vienā plānā cilvēkus, darbus un pasākuma vajadzības.",
  },
  {
    title: "Trases un ceļa sagatavošana",
    description:
      "Palīdzam sagatavot pasākuma norises vietu, trasi vai ceļa posmu atbilstoši izvēlētajam pasākuma formātam un saskaņotajiem nosacījumiem.",
  },
  {
    title: "Tiesneši un kārtībnieki",
    description:
      "Nodrošinām trases tiesnešus un kārtībniekus, lai sacensību norises organizatoriskā puse būtu pārdomāta un skaidri sadalīta.",
  },
  {
    title: "Drošības koordinēšana",
    description:
      "Sadarbībā ar atbildīgajiem dienestiem palīdzam organizēt NMPD un VUGD klātbūtni, ja tā nepieciešama pasākuma norisei.",
  },
  {
    title: "Privāti autosporta treniņi",
    description:
      "Organizējam privātus treniņus slēgtās trasēs un, ievērojot nepieciešamos saskaņojumus, arī koplietošanas ceļu posmos.",
  },
] as const;

const conversationTopics = [
  {
    title: "Pasākuma iecere",
    detail: "Kāds ir formāts — sacensības, treniņš vai cits sporta notikums?",
  },
  {
    title: "Vieta un laiks",
    detail: "Kur un aptuveni kad tas varētu notikt? Ja vēl nav zināms, tas netraucē sazināties.",
  },
  {
    title: "Nepieciešamais atbalsts",
    detail: "Pilna organizēšana vai konkrēts darbs — trase, personāls, drošības koordinēšana?",
  },
] as const;

export default function EventOrganizationPage() {
  return (
    <main id="main-content" className="event-org-page">
      {/* One image-led hero: deliberately different from the About and Membership layouts. */}
      <section className="event-org-hero" aria-labelledby="event-org-title">
        <div className="event-org-hero-photo" aria-hidden="true" />
        <div className="event-org-hero-overlay" aria-hidden="true" />
        <div className="event-org-container event-org-hero-inner">
          <div className="event-org-hero-bottom">
            <h1 id="event-org-title">
              Pasākums sākas <span>pirms starta.</span>
            </h1>
            <div className="event-org-hero-side">
              <p>
                Organizēšana, trase, cilvēki un drošība. Palīdzam sagatavot auto,
                moto un sporta pasākumus no pirmās ieceres līdz norises dienai.
              </p>
              <a className="event-org-hero-link" href="#sazinaties">
                Sazināties par pasākumu
                <ArrowDownRight size={19} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* A service dossier, not an icon-card marketing grid. */}
      <section className="event-org-services event-org-section" aria-labelledby="event-org-services-title">
        <div className="event-org-container">
          <div className="event-org-services-intro">
            <h2 id="event-org-services-title">
              Aiz sacensību dienas ir <span>liels darbs.</span>
            </h2>
            <p>
              Ne katram pasākumam vajadzīgs viens un tas pats. Varat uzticēt mums
              organizēšanas darbus kopumā vai piesaistīt LR Events konkrētam
              uzdevumam.
            </p>
          </div>

          <div className="event-org-service-list">
            {services.map((service) => (
              <article className="event-org-service" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Useful preparation guidance instead of a generic three-arrow process diagram. */}
      <section className="event-org-brief" aria-labelledby="event-org-brief-title">
        <div className="event-org-container event-org-brief-grid">
          <div className="event-org-brief-intro">
            <h2 id="event-org-brief-title">
              Sāksim ar <span>sarunu.</span>
            </h2>
            <p>
              Nav jābūt gatavam pilnam pasākuma plānam. Svarīgāk ir saprast,
              ko vēlaties sarīkot un kur mūsu komanda var palīdzēt.
            </p>
          </div>
          <div className="event-org-brief-topics">
            {conversationTopics.map((topic) => (
              <div className="event-org-brief-topic" key={topic.title}>
                <h3>{topic.title}</h3>
                <p>{topic.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genuine, direct contacts; the full team remains on the Contacts page. */}
      <section id="sazinaties" className="event-org-contact event-org-section" aria-labelledby="event-org-contact-title">
        <div className="event-org-container event-org-contact-grid">
          <div className="event-org-contact-intro">
            <h2 id="event-org-contact-title">
              Pastāstiet par <span>savu pasākumu.</span>
            </h2>
            <p>
              Arī tad, ja vēl tikai apsverat iespējas. Sazinieties tieši, un
              varēsim izrunāt ieceri un nepieciešamo nodrošinājumu.
            </p>
          </div>

          <div className="event-org-contact-details">
            <p className="event-org-contact-person">
              <strong>Kaspars Bite</strong>
              <span>LR Events biedrības vadītājs</span>
            </p>
            <div className="event-org-contact-methods">
              <a href="mailto:kasparsbite@lrevents.lv?subject=Pas%C4%81kuma%20organiz%C4%93%C5%A1ana" className="event-org-contact-method">
                <span>E-pasts</span>
                <span className="event-org-contact-value">
                  kasparsbite@lrevents.lv
                  <ArrowUpRight size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>
              </a>
              <a href="tel:+37127098323" className="event-org-contact-method">
                <span>Tālrunis</span>
                <span className="event-org-contact-value">
                  +371 27 098 323
                  <ArrowUpRight size={19} strokeWidth={1.7} aria-hidden="true" />
                </span>
              </a>
            </div>
            <Link href="/kontakti" className="event-org-all-contacts">
              Pārējie kontakti
              <ArrowUpRight size={17} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
