import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Mail,
  Phone,
} from "lucide-react";
import "./tiesnesiem.css";

export const metadata: Metadata = {
  title: "Tiesnešiem — LR Events",
  description:
    "Informācija LR Events sacensību tiesnešiem un kārtībniekiem: licences saskaņošana, darba pienākumi un saziņa ar biedrību.",
};

const roles = [
  {
    title: "Trases tiesneši",
    description:
      "Uzrauga piešķirto trases posmu, seko norises drošībai un ziņo par situācijām trasē atbilstoši sacensību vadības norādījumiem.",
  },
  {
    title: "Kārtībnieki",
    description:
      "Palīdz nodrošināt kārtību norises vietā, apmeklētāju plūsmu un piekļuvi noteiktajām zonām atbilstoši organizatoru norādījumiem.",
  },
] as const;

export default function JudgesPage() {
  return (
    <main id="main-content" className="judges-page container">
      <nav className="judges-breadcrumb" aria-label="Atrašanās vieta">
        <Link href="/">Sākums</Link>
        <span aria-hidden="true">/</span>
        <span>Informācija</span>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Tiesnešiem</span>
      </nav>

      <header className="judges-header">
        <h1>Tiesnešiem</h1>
        <p>
          Informācija par iesaisti LR Events sacensību norisē, tiesnešu
          licencēšanu un nepieciešamo saskaņošanu.
        </p>
      </header>

      <section className="judges-license" aria-labelledby="judges-license-title">
        <div className="judges-license-heading">
        </div>
        <div className="judges-license-main">
          <h2 id="judges-license-title">Tiesneša licences noformēšana</h2>
          <p className="judges-license-statement">
            Licences pasūtīšana ir pieejama <strong>tikai pēc iepriekšējas
            saskaņošanas ar LR Events biedrības vadītāju.</strong>
          </p>
          <p className="judges-license-detail">
            Pirms licences noformēšanas sazinies ar biedrību. Pēc saskaņošanas
            licences informāciju un pieejamos ierakstus vari apskatīt LAF
            licencēšanas sistēmā.
          </p>
          <div className="judges-license-actions">
            <a
              className="judges-primary-link"
              href="https://www.laflicences.lv/licenses/category/2"
              target="_blank"
              rel="noopener noreferrer"
            >
              LAF tiesnešu licences
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a
              className="judges-secondary-link"
              href="mailto:kasparsbite@lrevents.lv?subject=Tiesne%C5%A1a%20licences%20saska%C5%86o%C5%A1ana"
            >
              Sazināties par saskaņošanu
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="judges-roles" aria-labelledby="judges-roles-title">
        <div className="judges-section-heading">
          <h2 id="judges-roles-title">Darbs sacensību norisē</h2>
          <p>
            Tiesneši un kārtībnieki palīdz nodrošināt sakārtotu un drošu
            pasākuma norisi. Konkrētos pienākumus nosaka attiecīgā pasākuma
            organizācija un piemērojamie noteikumi.
          </p>
        </div>
        <div className="judges-roles-grid">
          {roles.map((role) => (
            <article className="judges-role" key={role.title}>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
            </article>
          ))}
        </div>
        <div className="judges-documents">
          <FileText size={19} strokeWidth={1.7} aria-hidden="true" />
          <p>
            Pirms konkrēta pasākuma iepazīsties ar tā aktuālajiem nolikumiem,
            dokumentiem un organizatoru norādījumiem.
          </p>
          <Link href="/dokumenti">
            Dokumenti <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="judges-contact" aria-labelledby="judges-contact-title">
        <div className="judges-contact-intro">
          <h2 id="judges-contact-title">Jautājumi par iesaisti?</h2>
          <p>
            Par tiesnešu iesaisti un licences saskaņošanu sazinies ar
            LR Events biedrības vadītāju Kasparu Biti.
          </p>
        </div>
        <div className="judges-contact-details">
          <a href="mailto:kasparsbite@lrevents.lv">
            <Mail size={19} strokeWidth={1.6} aria-hidden="true" />
            <span>kasparsbite@lrevents.lv</span>
            <ArrowUpRight className="judges-contact-arrow" size={18} aria-hidden="true" />
          </a>
          <a href="tel:+37127098323">
            <Phone size={19} strokeWidth={1.6} aria-hidden="true" />
            <span>+371 27 098 323</span>
            <ArrowUpRight className="judges-contact-arrow" size={18} aria-hidden="true" />
          </a>
          <Link className="judges-all-contacts" href="/kontakti">
            Visi kontakti <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
