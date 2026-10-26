"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { saveCookieChoice, useCookieChoice, type CookieChoice } from "@/lib/cookie-consent";
import "./cookie-settings.css";

export function CookieNotice() {
  const choice = useCookieChoice();
  const [error, setError] = useState("");
  function save(next: CookieChoice) {
    if (!saveCookieChoice(next)) setError("Neizdevās saglabāt izvēli. Atļauj sīkdatņu saglabāšanu pārlūkā un mēģini vēlreiz.");
  }
  if (choice) return null;
  return (
    <aside className="cookie-notice" aria-labelledby="cookie-notice-title">
      <div className="cookie-notice-inner">
        <div className="cookie-notice-copy">
          <h2 id="cookie-notice-title">Šī vietne izmanto sīkdatnes</h2>
          <p>Izmantojam nepieciešamās sīkdatnes vietnes darbībai un tavas izvēles saglabāšanai. Analītikas un reklāmas sīkdatnes šobrīd netiek izmantotas. Tu vari pieņemt vai noraidīt papildu sīkdatnes un jebkurā laikā mainīt savu izvēli.</p>
          <Link className="cookie-details-link" href="/sikdatnu-iestatijumi">Skatīt informāciju <ChevronRight size={18} aria-hidden="true" /></Link>
          {error && <p className="cookie-error" role="alert">{error}</p>}
        </div>
        <div className="cookie-actions">
          <button type="button" className="cookie-button cookie-accept" onClick={() => save("accepted")}>Pieņemt</button>
          <button type="button" className="cookie-button cookie-reject" onClick={() => save("rejected")}>Noraidīt</button>
        </div>
      </div>
    </aside>
  );
}
