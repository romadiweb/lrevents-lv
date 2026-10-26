import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferences } from "@/components/layout/cookie-preferences";
import "@/components/layout/cookie-settings.css";
import "./sikdatnu-iestatijumi.css";

export const metadata: Metadata = {
  title: "Sīkdatņu iestatījumi — LR Events",
  description: "Informācija par LR Events sīkdatnēm un tavas sīkdatņu izvēles pārvaldība.",
};

export default function CookieSettingsPage() {
  return (
    <main id="main-content" className="cookie-page site-content-page container">
      <nav className="cookie-breadcrumb" aria-label="Atrašanās vieta"><Link href="/">Sākums</Link><span aria-hidden="true">/</span><span aria-current="page">Sīkdatņu iestatījumi</span></nav>
      <h1>Sīkdatņu iestatījumi</h1>
      <p className="cookie-page-intro">Tu nosaki savu sīkdatņu izvēli. Šeit vari uzzināt, ko izmantojam, un jebkurā laikā mainīt saglabāto izvēli.</p>
      <CookiePreferences />
      <section aria-labelledby="cookie-essential-title">
        <div className="cookie-section-title"><h2 id="cookie-essential-title">Nepieciešamās sīkdatnes</h2><span>Vienmēr aktīvas</span></div>
        <p>Nodrošina vietnes pamatfunkcijas. Tās saglabā sīkdatņu izvēli un ļauj autorizētiem CMS lietotājiem droši strādāt ar saturu. Šīs sīkdatnes netiek izmantotas reklāmai.</p>
        <dl className="cookie-inventory">
          <div><dt>Sīkdatņu izvēle <code>lrevents_cookie_choice</code></dt><dd>Saglabā tavu atbildi šajā pārlūkā 180 dienas, lai paziņojums netiktu rādīts katrā apmeklējumā.</dd></div>
          <div><dt>CMS autorizācija</dt><dd>Autorizācijas pakalpojuma sesijas sīkdatnes, kas nepieciešamas CMS lietotāju pierakstīšanai un sesijas atjaunošanai.</dd></div>
        </dl>
      </section>
      <section aria-labelledby="cookie-optional-title">
        <div className="cookie-section-title"><h2 id="cookie-optional-title">Analītika un reklāma</h2><span>Netiek izmantotas</span></div>
        <p>Pašlaik vietnē nav ieslēgtas analītikas vai reklāmas sīkdatnes. Pieņemšana neieslēdz papildu izsekošanu. Ja šādus pakalpojumus pievienosim, pirms to aktivizēšanas lūgsim jaunu piekrišanu.</p>
      </section>
      <section aria-labelledby="cookie-manage-title">
        <h2 id="cookie-manage-title">Kā mainīt izvēli?</h2>
        <p>Atver “Sīkdatņu iestatījumi” lapas kājenē un saglabā jaunu izvēli. Izvēle attiecas uz šo pārlūku. Dzēšot vietnes sīkdatnes vai pēc izvēles glabāšanas termiņa beigām, paziņojums tiks parādīts vēlreiz.</p>
      </section>
    </main>
  );
}
