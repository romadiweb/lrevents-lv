"use client";

import { useState } from "react";
import { clearCookieChoice, saveCookieChoice, useCookieChoice, type CookieChoice } from "@/lib/cookie-consent";

export function CookiePreferences() {
  const choice = useCookieChoice();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  function save(next: CookieChoice) {
    const saved = saveCookieChoice(next);
    setError(!saved);
    setMessage(saved ? "Tava izvēle ir saglabāta." : "Neizdevās saglabāt izvēli. Atļauj sīkdatņu saglabāšanu pārlūkā un mēģini vēlreiz.");
  }
  function clear() {
    const cleared = clearCookieChoice();
    setError(!cleared);
    setMessage(cleared ? "Saglabātā izvēle ir dzēsta. Nākamajā lapā paziņojums tiks parādīts vēlreiz." : "Neizdevās dzēst izvēli. Mēģini vēlreiz.");
  }
  return (
    <section className="cookie-preferences" aria-labelledby="cookie-choice-title">
      <h2 id="cookie-choice-title">Tava izvēle</h2>
      <p>Pašreizējā izvēle: <strong>{choice === "pending" ? "Ielādē izvēli…" : choice === "accepted" ? "Papildu sīkdatnes pieņemtas" : choice === "rejected" ? "Tikai nepieciešamās sīkdatnes" : "Izvēle vēl nav saglabāta"}</strong>.</p>
      <p>Abos gadījumos vietne pašlaik izmanto tikai nepieciešamās sīkdatnes. Ja pievienosim analītikas vai reklāmas pakalpojumus, lūgsim jaunu piekrišanu.</p>
      <div className="cookie-preferences-actions">
        <button className="cookie-button cookie-accept" type="button" onClick={() => save("accepted")}>Pieņemt</button>
        <button className="cookie-button cookie-reject" type="button" onClick={() => save("rejected")}>Noraidīt papildu sīkdatnes</button>
      </div>
      <button className="cookie-reset" type="button" onClick={clear}>Dzēst saglabāto izvēli</button>
      <p className={error ? "cookie-error" : "cookie-save-message"} role={error ? "alert" : "status"}>{message}</p>
    </section>
  );
}
