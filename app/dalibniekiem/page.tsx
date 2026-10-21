import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Mail,
  Trophy,
} from "lucide-react";
import "./dalibniekiem.css";

export const metadata: Metadata = {
  title: "Dalībniekiem | LR Events",
  description:
    "Informācija LR Events sacensību dalībniekiem: nolikumi, dalības prasības, norēķini, rēķinu pieprasīšana un noderīgas saites.",
};

const preparation = [
  {
    title: "Iepazīsties ar nolikumu",
    text: "Pirms pieteikšanās izlasi izvēlētā pasākuma un attiecīgās sezonas nolikumu. Tajā noteikta sacensību kārtība, dalības nosacījumi un svarīgie termiņi.",
  },
  {
    title: "Pārbaudi dalības prasības",
    text: "Noskaidro, kādas licences, apdrošināšana, tehniskās prasības un dokumenti attiecas tieši uz sacensībām un klasi, kurā vēlies startēt.",
  },
  {
    title: "Sagatavojies sacensību dienai",
    text: "Pārbaudi pasākuma vietu, ierašanās laiku, reģistrācijas un tehniskās pārbaudes kārtību. Aktuālā informācija pieejama konkrētā pasākuma materiālos.",
  },
] as const;

const resources = [
  {
    href: "/pasakumi",
    title: "Pasākumu kalendārs",
    description: "Datumi, norises vietas un informācija par katru pasākumu.",
    icon: CalendarDays,
  },
  {
    href: "/dokumenti",
    title: "Dokumenti un nolikumi",
    description: "Sezonas nolikumi, posmu noteikumi un biļeteni.",
    icon: FileText,
  },
  {
    href: "/rezultati",
    title: "Sacensību rezultāti",
    description: "Rezultāti un kopvērtējumi pēc sacensībām.",
    icon: Trophy,
  },
] as const;

export default function ParticipantsPage() {
  return (
    <main id="main-content" className="participants-page">
      <header className="participants-header">
        <div className="participants-container">
          <nav className="participants-breadcrumbs" aria-label="Atrašanās vieta">
            <Link href="/">Sākums</Link>
            <span aria-hidden="true">/</span>
            <span>Informācija</span>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Dalībniekiem</span>
          </nav>

          <div className="participants-header-layout">
            <div className="participants-header-copy">
              <h1>Dalībniekiem</h1>
              <p>
                Dalības nosacījumi, sacensību dokumenti un praktiska informācija
                vienuviet. Pirms starta pārliecinies, ka esi iepazinies ar
                konkrētā pasākuma noteikumiem.
              </p>
            </div>
            <div className="participants-header-action">
              <span className="participants-action-label">Meklē sacensības?</span>
              <p>Datumi, vietas un pieteikšanās iespējas atrodamas pasākumu sadaļā.</p>
              <Link href="/pasakumi" className="participants-action-link">
                Skatīt pasākumus
                <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="participants-container participants-main-layout">
        <div className="participants-content">
          <section id="pirms-starta" className="participants-block" aria-labelledby="participants-preparation-title">
            <h2 id="participants-preparation-title">Pirms starta</h2>
            <p className="participants-block-lead">
              Galvenais, kas jānoskaidro pirms dalības sacensībās.
            </p>
            <div className="participants-preparation-list">
              {preparation.map((item) => (
                <article className="participants-preparation-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="nolikumi" className="participants-block participants-documents" aria-labelledby="participants-documents-title">
            <h2 id="participants-documents-title">Nolikumi un dokumenti</h2>
            <p className="participants-block-lead">
              Pirms reģistrēšanās iepazīsties ar attiecīgajām prasībām.
              Sacensību nolikums ir galvenais informācijas avots par dalības
              maksu, klasēm, norisi un noteikumiem.
            </p>
            <div className="participants-document-feature">
              <div className="participants-document-feature-icon" aria-hidden="true">
                <FileText size={23} strokeWidth={1.5} />
              </div>
              <div className="participants-document-feature-copy">
                <span>Publicēts sezonas dokuments</span>
                <h3>LR Events Kausa izcīņa autosprintā — 2026. gada sezonas nolikums</h3>
                <p>Dokuments attiecas uz norādīto sezonu; citam pasākumam pārbaudi tā aktuālo nolikumu.</p>
              </div>
              <a
                className="participants-document-feature-link"
                href="https://drive.google.com/file/d/1fVtnBwwBigGPqNknJToy2xzcgMJ5QOVQ/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Atvērt 2026. gada sezonas nolikumu jaunā cilnē"
              >
                Atvērt <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
            <Link href="/dokumenti" className="participants-inline-link">
              Visi dokumenti un biļeteni
              <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          </section>

          <section id="noreikini" className="participants-block participants-payments" aria-labelledby="participants-payments-title">
            <h2 id="participants-payments-title">Dalības maksa un rēķini</h2>
            <p className="participants-block-lead">
              Informācija par dalības maksu un apmaksas kārtību ir atrodama
              attiecīgā pasākuma nolikumā.
            </p>
            <div className="participants-invoice">
              <div className="participants-invoice-top">
                <div>
                  <span className="participants-invoice-label">Rēķina pieprasījums</span>
                  <h3>Nepieciešams rēķins?</h3>
                </div>
                <Mail size={24} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p>
                Nosūti pieprasījumu, norādot savu vārdu un uzvārdu, sacensību
                klases, kurās startēsi, to skaitu un rēķina izrakstīšanai
                nepieciešamos rekvizītus.
              </p>
              <a href="mailto:invoice@lrevents.lv" className="participants-email">
                invoice@lrevents.lv
                <ArrowUpRight size={19} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section id="noderigas-saites" className="participants-block participants-resources" aria-labelledby="participants-resources-title">
            <h2 id="participants-resources-title">Noderīgas saites</h2>
            <div className="participants-resource-list">
              {resources.map(({ href, title, description, icon: Icon }) => (
                <Link href={href} className="participants-resource" key={href}>
                  <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                  <span className="participants-resource-text">
                    <strong>{title}</strong>
                    <span>{description}</span>
                  </span>
                  <ArrowUpRight className="participants-resource-arrow" size={20} strokeWidth={1.7} aria-hidden="true" />
                </Link>
              ))}
            </div>
            <p className="participants-resources-note">
              Reģistrācija un reģistrēto dalībnieku saraksts ir saistīti ar
              konkrēto pasākumu. Izvēlies pasākumu kalendārā, lai piekļūtu tā
              informācijai, kad tā ir publicēta.
            </p>
          </section>

          <div className="participants-questions">
            <div>
              <h2>Palika jautājumi?</h2>
              <p>Ja neatradi nepieciešamo informāciju, sazinies ar LR Events.</p>
            </div>
            <Link href="/kontakti">
              Kontakti <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
