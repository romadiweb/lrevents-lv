"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import "./biedrs.css";

const reasons = [
  {
    number: "01",
    title: "Cilvēki ar kopīgu aizrautību.",
    description: "Pievienojies cilvēkiem, kuriem autosports ir vairāk nekā tikai sacensību diena.",
  },
  {
    number: "02",
    title: "Tuvāk notikumu norisei.",
    description: "Iepazīsti biedrības darbu, pasākumu sagatavošanu un komandu, kas tos īsteno.",
  },
  {
    number: "03",
    title: "Iespēja iesaistīties.",
    description: "Pastāsti par savu pieredzi un interesi, lai kopā atrastu piemērotu iesaistes veidu.",
  },
];

type SubmissionState = "idle" | "sending" | "success" | "error";

export default function MembershipPage() {
  const [submission, setSubmission] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submission === "sending") return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") ?? "").trim().replace(/\s+/g, " ");
    const declarationName = String(formData.get("declarationName") ?? "").trim().replace(/\s+/g, " ");

    if (fullName.toLocaleLowerCase("lv") !== declarationName.toLocaleLowerCase("lv")) {
      setErrorMessage("Apliecinājuma vārdam un uzvārdam jāsakrīt ar pieteikumā norādīto.");
      setSubmission("error");
      return;
    }

    setSubmission("sending");
    setErrorMessage("");

    try {
      // Implement POST /api/membership separately, including secure validation,
      // storage, rate limiting, and privacy handling. No client-side success
      // is shown until the server has confirmed acceptance.
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      if (!response.ok) throw new Error("Pieteikumu pašlaik neizdevās nosūtīt.");
      setSubmission("success");
      form.reset();
    } catch {
      setSubmission("error");
      setErrorMessage("Pieteikumu neizdevās nosūtīt. Lūdzu, mēģini vēlreiz vēlāk vai sazinies ar LR Events.");
    }
  }

  return (
    <main id="main-content" className="membership-page site-content-page">
      <section className="member-hero" aria-labelledby="member-title">
        <div className="member-container member-hero-copy">
          <h1 id="member-title">Kļūsti par <em>savējo.</em></h1>
          <div className="member-hero-bottom">
            <p>Autosports sākas ar cilvēkiem. Pievienojies LR Events kopienai un kļūsti par daļu no notikumiem, kas mūs vieno.</p>
            <a className="member-inline-link" href="#pieteikums">Aizpildīt pieteikumu <ArrowDownRight size={19} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="member-hero-media" role="img" aria-label="LR Events autosporta atmosfēras fotogrāfija">
          <div className="member-container member-photo-caption" aria-hidden="true"><span>LR / EVENTS</span><span>VIENOTI AUTOSPORTĀ.</span></div>
        </div>
      </section>

      <section className="member-benefits member-section" aria-labelledby="member-benefits-title">
        <div className="member-container">
          <div className="member-section-intro">
            <div><h2 id="member-benefits-title">Vairāk nekā <em>dalība.</em></h2><p>Biedrības pamatā ir cilvēki, iniciatīva un vēlme būt tuvāk autosportam.</p></div>
          </div>
          <div className="member-reason-grid">
            {reasons.map((reason) => (
              <article className="member-reason" key={reason.number}>
                <span className="member-reason-number">{reason.number}</span>
                <h3>{reason.title}</h3>
                <p>{reason.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="member-process" aria-labelledby="member-process-title">
        <div className="member-container">
          <div className="member-process-heading">
            <div className="member-process-copy">
              <p className="member-overline member-overline--light">KĀ PIEVIENOTIES</p>
              <h2 id="member-process-title">Viss sākas ar <em>pieteikumu.</em></h2>
            </div>
          </div>
          <ol className="member-process-track" aria-label="Pieteikšanās soļi">
            <li className="member-process-step">
              <span className="member-process-number">01</span>
              <div className="member-process-step-copy"><h3>Aizpildi pieteikumu</h3><p>Pastāsti par sevi un savu pieredzi.</p></div>
            </li>
            <li className="member-process-step">
              <span className="member-process-number">02</span>
              <div className="member-process-step-copy"><h3>Pieteikuma izskatīšana</h3><p>LR Events iepazīstas ar iesniegto informāciju.</p></div>
            </li>
            <li className="member-process-step">
              <span className="member-process-number">03</span>
              <div className="member-process-step-copy"><h3>Sazināmies ar tevi</h3><p>Vienojamies par turpmākajiem soļiem.</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section id="pieteikums" className="member-application member-section" aria-labelledby="member-form-title">
        <div className="member-container member-application-layout">
          <aside className="member-application-intro">
            <p className="member-overline">PIETEIKŠANĀS</p>
            <h2 id="member-form-title">Tavs nākamais <em>solis.</em></h2>
            <p>Aizpildi pieteikumu, lai izteiktu vēlmi kļūt par LR Events biedru. Lauki ar * ir obligāti.</p>
            <div className="member-privacy-note"><ShieldCheck size={19} aria-hidden="true"/><span>Norādītos datus izmanto biedra pieteikuma izskatīšanai. Pirms iesniegšanas iepazīsties ar datu apstrādes informāciju.</span></div>
          </aside>

          <div className="member-form-wrap">
            {submission === "success" ? (
              <div className="member-success" role="status"><Check size={28} aria-hidden="true"/><h3>Pieteikums saņemts.</h3><p>Paldies par interesi kļūt par LR Events biedru! Ar tevi sazināsies par nākamajiem soļiem.</p><button type="button" onClick={() => setSubmission("idle")}>Aizpildīt jaunu pieteikumu <ArrowUpRight size={16}/></button></div>
            ) : (
              <form className="member-form" onSubmit={handleSubmit}>
                <fieldset>
                  <legend><span>01</span> Kontaktinformācija</legend>
                  <div className="member-fields">
                    <div className="member-field"><label htmlFor="member-name">Vārds, uzvārds <span>*</span></label><input id="member-name" name="fullName" autoComplete="name" maxLength={150} required placeholder="Tavs vārds un uzvārds" /></div>
                    <div className="member-field"><label htmlFor="member-email">E-pasts <span>*</span></label><input id="member-email" type="email" name="email" autoComplete="email" maxLength={254} required placeholder="tavs@epasts.lv" /></div>
                    <div className="member-field member-field--full"><label htmlFor="member-phone">Mob. tālr. <span>*</span></label><input id="member-phone" type="tel" name="phone" autoComplete="tel" maxLength={30} required placeholder="+371 2XXXXXXX" /></div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend><span>02</span> Personas informācija</legend>
                  <div className="member-fields">
                    <div className="member-field"><label htmlFor="member-birth">Dzimšanas datums <span>*</span></label><input id="member-birth" type="date" name="birthDate" autoComplete="bday" required /></div>
                    <div className="member-field"><label htmlFor="member-id">Personas kods <span>*</span></label><input id="member-id" name="personalCode" inputMode="numeric" maxLength={12} pattern="[0-9]{6}-?[0-9]{5}" title="11 cipari, ar vai bez defises" required placeholder="000000-00000" /></div>
                    <div className="member-field member-field--full"><label htmlFor="member-address">Deklarētā dzīves adrese <span>*</span></label><input id="member-address" name="declaredAddress" autoComplete="street-address" maxLength={300} required placeholder="Iela, māja, pilsēta, pasta indekss" /></div>
                  </div>
                </fieldset>
                <fieldset>
                  <legend><span>03</span> Pieredze un apliecinājums</legend>
                  <div className="member-fields">
                    <div className="member-field member-field--full"><label htmlFor="member-experience">Iepriekšējā pieredze auto sporta pasākumos un citos pasākuma organizēšanas procesos <span>*</span></label><textarea id="member-experience" name="experience" rows={5} maxLength={3000} required placeholder="Pastāsti par savu pieredzi. Ja tās vēl nav, vari to norādīt." /></div>
                    <div className="member-field member-field--full"><label htmlFor="member-declaration">Lūdzu pieņemt mani biedrības LR Events biedru sastāvā. <span>*</span></label><p className="member-field-hint">Apliecini šo lūgumu, atkārtoti ierakstot savu vārdu un uzvārdu.</p><input id="member-declaration" name="declarationName" maxLength={150} required placeholder="Vārds un uzvārds" /></div>
                  </div>
                </fieldset>
                <label className="member-consent"><input type="checkbox" name="consent" value="true" required /><span>Es piekrītu sniegt un apstrādāt savus personas datus biedra reģistrācijas nolūkos. <strong>*</strong></span></label>
                {submission === "error" && <p className="member-form-error" role="alert">{errorMessage}</p>}
                <button type="submit" className="member-submit" disabled={submission === "sending"}>{submission === "sending" ? "Nosūta..." : "Nosūtīt pieteikumu"}<ArrowUpRight size={19} aria-hidden="true" /></button>
                <p className="member-form-footnote">Jautājumi par dalību? <Link href="/kontakti">Sazinies ar LR Events <ArrowUpRight size={14} aria-hidden="true" /></Link></p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
