import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import "./partneriem.css";

export const metadata: Metadata = {
  title: "Partneriem un atbalstītājiem | LR Events",
  description:
    "Sadarbība ar LR Events auto un moto sporta pasākumos. Iepazīstiet mūsu atbalstītājus, sadarbības iespējas un sazinieties ar komandu.",
};

// Based on the supporter logos published on the existing lrevents.lv homepage.
// Confirm official spelling and preferred logo treatment with LR Events before publishing.
const supporters = [
  "SK Vecpils",
  "Midzeņi",
  "Lucky Punch",
  "SKAIN",
  "Wooddesign",
  "NK",
  "Lucas Oil",
] as const;

// These are conversation starters, not fixed sponsorship packages or guaranteed benefits.
const collaboration = [
  {
    title: "Atbalsts sacensību norisei",
    description:
      "Ieguldījums konkrētā posmā, pasākumā vai organizatoriskajā darbā. Sadarbības apjomu un iespējas izrunājam individuāli.",
  },
  {
    title: "Balvas un produkcija",
    description:
      "Balvas dalībniekiem, noderīgi produkti vai cita veida atbalsts, kas iederas sacensību norisē.",
  },
  {
    title: "Tehniskais un praktiskais atbalsts",
    description:
      "Aprīkojums, materiāli, transports vai pakalpojumi, kas palīdz sagatavot un īstenot pasākumu.",
  },
  {
    title: "Kopīgas ieceres",
    description:
      "Ja jums ir sava ideja, pastāstiet par to. Izvērtēsim, vai un kā to varētu īstenot kopā ar LR Events.",
  },
] as const;

export default function PartnersPage() {
  return (
    <main id="main-content" className="partners-page site-content-page">
      {/* Editorial opening: a narrow trackside photograph rather than a repeat of the other pages' heroes. */}
      <section className="partners-hero" aria-labelledby="partners-title">
        <div className="partners-container partners-hero-layout">
          <div className="partners-hero-copy">
            <h1 id="partners-title">
              Autosports aug,
              <span> kad tam ir <em>atbalsts</em></span>
            </h1>
            <p>
              LR Events sadarbojas ar uzņēmumiem un cilvēkiem, kuri vēlas
              palīdzēt auto un moto sporta pasākumiem notikt. Atbalstam var būt
              dažādas formas — svarīgi, lai sadarbība būtu vērtīga abām pusēm.
            </p>
            <a href="#sadarbiba" className="partners-hero-link">
              Parunāsim par sadarbību
              <ArrowDownRight size={19} strokeWidth={1.7} aria-hidden="true" />
            </a>
          </div>
          <div
            className="partners-hero-image"
            role="img"
            aria-label="Autosporta pasākuma norise trasē"
          >
            <div className="partners-hero-image-caption" aria-hidden="true">
              <span>LR / EVENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Actual supporter names from the existing website; no invented partner statistics or logos. */}
      <section className="partners-supporters partners-section" aria-labelledby="partners-supporters-title">
        <div className="partners-container">
          <div className="partners-supporters-heading">
            <h2 id="partners-supporters-title">
              Tie, kas bijuši <em>līdzās</em>
            </h2>
            <p>
              Paldies atbalstītājiem, kuri palīdzējuši LR Events un autosporta
              notikumiem. Katrs ieguldījums ir nozīmīgs.
            </p>
          </div>
          <ul className="partners-supporters-list" aria-label="LR Events atbalstītāji">
            {supporters.map((name) => (
              <li key={name} className="partners-supporter">
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deliberately practical copy: not benefit cards or three-arrow process diagrams. */}
      <section className="partners-collaboration partners-section" aria-labelledby="partners-collaboration-title">
        <div className="partners-container partners-collaboration-layout">
          <div className="partners-collaboration-copy">
            <h2 id="partners-collaboration-title">
              Nav vienas pareizās <em>sadarbības formas</em>
            </h2>
            <p>
              Vienam uzņēmumam tuvāks ir atbalsts sacensību posmam, citam —
              balvas, aprīkojums vai praktiska palīdzība. Svarīgākais ir
              saprast, ko varam paveikt kopā.
            </p>
          </div>
          <div className="partners-collaboration-items">
            {collaboration.map((item) => (
              <article className="partners-collaboration-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Direct partnership contact, rather than a long and impersonal inquiry form. */}
      <section id="sadarbiba" className="partners-contact" aria-labelledby="partners-contact-title">
        <div className="partners-container partners-contact-layout">
          <div className="partners-contact-copy">
            <h2 id="partners-contact-title">
              Ir ideja? <em>Sazināsimies</em>
            </h2>
            <p>
              Nav nepieciešams sagatavot sponsoru prezentāciju vai gatavu
              sadarbības piedāvājumu. Sākumā pietiek ar sarunu par jūsu ieceri.
            </p>
          </div>
          <div className="partners-contact-details">
            <p className="partners-contact-person">
              <strong>Kārlis Ķipsts</strong>
              <span>Mārketinga un reklāmas speciālists</span>
            </p>
            <a
              className="partners-contact-email"
              href="mailto:karliskipsts@lrevents.lv?subject=Sadarb%C4%ABba%20ar%20LR%20Events"
            >
              <span>karliskipsts@lrevents.lv</span>
              <ArrowUpRight size={25} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a className="partners-contact-phone" href="tel:+37120378822">
              +371 20 378 822
              <ArrowUpRight size={17} strokeWidth={1.6} aria-hidden="true" />
            </a>
            <Link href="/kontakti" className="partners-contact-all">
              Visi kontakti
              <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
