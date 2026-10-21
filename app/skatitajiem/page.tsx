import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Info,
  Mail,
} from "lucide-react";
import "./skatitajiem.css";

export const metadata: Metadata = {
  title: "Skatītājiem — LR Events",
  description:
    "Praktiska informācija LR Events autosporta sacensību skatītājiem: norises vietas, programma, drošība un aktuālie paziņojumi.",
};

const visitInformation = [
  {
    title: "Norises vieta",
    description:
      "Sacensības notiek dažādās trasēs. Precīzu adresi un nokļūšanas informāciju meklē izvēlētā pasākuma lapā.",
  },
  {
    title: "Dienas programma",
    description:
      "Pirms izbraukšanas pārbaudi pasākuma sākuma laiku un publicēto dienas norises kārtību.",
  },
  {
    title: "Ieeja un apmeklējums",
    description:
      "Ieejas nosacījumi var atšķirties. Ja pasākumam noteikta maksa vai īpaša kārtība, tā jānorāda pasākuma informācijā.",
  },
  {
    title: "Autostāvvietas",
    description:
      "Ierašanās un automašīnu novietošanas iespējas ir atkarīgas no konkrētās norises vietas. Seko norādēm uz vietas.",
  },
] as const;

const safetyGuidance = [
  "Uzturies skatītājiem paredzētajās zonās un ievēro norobežojumus.",
  "Ievēro organizatoru, kārtībnieku un trases tiesnešu norādījumus.",
  "Nešķērso sacensību trasi un neieej dalībniekiem vai personālam paredzētajās zonās bez atļaujas.",
  "Pieskati bērnus un ievēro drošu attālumu no kustībā esošas tehnikas.",
] as const;

const relatedLinks = [
  {
    title: "Pasākumi",
    detail: "Sacensību kalendārs un aktuālie pasākumi",
    href: "/pasakumi",
  },
  {
    title: "Rezultāti",
    detail: "Sacensību rezultāti un publicētie dati",
    href: "/rezultati",
  },
  {
    title: "Dokumenti",
    detail: "Nolikumi un citi oficiālie materiāli",
    href: "/dokumenti",
  },
  {
    title: "Kontakti",
    detail: "Jautājumiem par pasākuma apmeklējumu",
    href: "/kontakti",
  },
] as const;

export default function SpectatorsPage() {
  return (
    <main id="main-content" className="spectators-page container">
      <nav className="spectators-breadcrumb" aria-label="Atrašanās vieta">
        <Link href="/">Sākums</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span>Informācija</span>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">Skatītājiem</span>
      </nav>

      <header className="spectators-header">
        <h1>Skatītājiem</h1>
        <p>
          Sacensību diena sākas ar labu plānu. Šeit atradīsi svarīgāko par
          apmeklējumu, drošību un to, kur pārbaudīt aktuālo pasākuma informāciju.
        </p>
      </header>

      <section className="spectators-feature" aria-labelledby="spectators-feature-title">
        <div className="spectators-feature-photo" aria-hidden="true" />
        <div className="spectators-feature-panel">
          <CalendarDays size={23} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h2 id="spectators-feature-title">Pirms dodies uz trasi</h2>
            <p>
              Precīzu adresi, norises laiku un iespējamās izmaiņas vienmēr
              pārbaudi konkrētā pasākuma lapā.
            </p>
          </div>
          <Link href="/pasakumi" className="spectators-feature-link">
            Atvērt pasākumu kalendāru
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="spectators-visit spectators-section" aria-labelledby="spectators-visit-title">
        <div className="spectators-section-intro">
          <h2 id="spectators-visit-title">Plāno apmeklējumu</h2>
          <p>
            Apmeklējuma kārtība atkarīga no konkrētās trases un sacensībām.
            Šīs ir galvenās lietas, ko vērts pārbaudīt pirms došanās ceļā.
          </p>
        </div>
        <dl className="spectators-visit-grid">
          {visitInformation.map((item) => (
            <div className="spectators-visit-item" key={item.title}>
              <dt>{item.title}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="spectators-safety" aria-labelledby="spectators-safety-title">
        <div className="spectators-safety-intro">
          <h2 id="spectators-safety-title">Drošība sacensību laikā</h2>
          <p>
            Autosports prasa uzmanību arī no skatītājiem. Ievēro norādes un
            personāla norādījumus, lai sacensības būtu drošas visiem.
          </p>
        </div>
        <ul className="spectators-safety-list">
          {safetyGuidance.map((guidance) => (
            <li key={guidance}>{guidance}</li>
          ))}
        </ul>
      </section>

      <section className="spectators-updates spectators-section" aria-labelledby="spectators-updates-title">
        <div className="spectators-updates-icon" aria-hidden="true">
          <Info size={21} strokeWidth={1.7} />
        </div>
        <div className="spectators-updates-copy">
          <h2 id="spectators-updates-title">Ja mainās pasākuma norise</h2>
          <p>
            Laikapstākļi vai trases apstākļi var ietekmēt norises laiku.
            Pirms izbraukšanas iesakām pārbaudīt jaunākos paziņojumus
            attiecīgā pasākuma lapā.
          </p>
        </div>
        <Link href="/pasakumi" className="spectators-updates-link">
          Pasākumi <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>

      <section className="spectators-resources spectators-section" aria-labelledby="spectators-resources-title">
        <div className="spectators-section-intro spectators-resources-intro">
          <h2 id="spectators-resources-title">Noderīga informācija</h2>
          <p>Viss pārējais, kas var noderēt pirms sacensībām vai pēc tām.</p>
        </div>
        <div className="spectators-resource-grid">
          {relatedLinks.map((item) => (
            <Link key={item.href} href={item.href} className="spectators-resource-link">
              <span className="spectators-resource-title">{item.title}</span>
              <span className="spectators-resource-detail">{item.detail}</span>
              <ArrowUpRight className="spectators-resource-arrow" size={20} strokeWidth={1.7} aria-hidden="true" />
            </Link>
          ))}
        </div>
        <p className="spectators-contact-note">
          Neatradi atbildi? <Link href="/kontakti">Sazinies ar LR Events <Mail size={14} aria-hidden="true" /></Link>
        </p>
      </section>
    </main>
  );
}
