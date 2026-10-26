import { Mail, Phone } from "lucide-react";
import { Brand } from "./brand";
import { SponsorGrid } from "./sponsor-grid";
import Image from "next/image";
import { CookieSettings } from "./cookie-settings";
import "./site-footer.css";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <SponsorGrid />
        <div className="footer-identity">
          <div className="footer-brand-row">
            <Brand tone="white" />
            <div
              className="footer-partner-placeholder"
              aria-label="Galvenā partnera logotipa vieta"
            >
              <span>Galvenais partneris</span>
              <span className="sponsor-placeholder-caption">
                Logotipa vieta
              </span>
            </div>
          </div>
          <address className="footer-contact">
            <div className="footer-contact-links">
              <a href="mailto:kasparsbite@lrevents.lv">
                <Mail size={14} aria-hidden="true" />
                kasparsbite@lrevents.lv
              </a>
              <a href="tel:+37127098323">
                <Phone size={14} aria-hidden="true" />
                +371 27 098 323
              </a>
            </div>
            <p>Brīvības iela 82 – 10/14, Liepāja, LV-3401</p>
          </address>
          <p className="footer-copyright">© 2026 Biedrība LR Events</p>
        </div>
        <div className="footer-bottom">
          <CookieSettings />
          <a className="romadi-credit" href="https://romadi.lv" aria-label="Designed by Romadi — romadi.lv"><Image className="romadi-signature" src="/brand/romadi-signature.svg" alt="Designed by Romadi" width={164} height={26} /></a>
        </div>
      </div>
    </footer>
  );
}
