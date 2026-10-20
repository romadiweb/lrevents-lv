"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SocialLinks } from "./social-links";
import { Brand } from "./brand";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";
export function SiteHeader() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setCompact((previous) => window.scrollY > (previous ? 8 : 32));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <Link className="skip-link" href="#main-content">
        Pāriet uz saturu
      </Link>
      <div className="header-space">
        <header className={`site-header${compact ? " is-compact" : ""}`}>
          <div className="utility-bar" inert={compact}>
            <div className="container utility-inner">
              <span>Autosporta pasākumi Latvijā</span>
              <SocialLinks />
            </div>
          </div>
          <div className="main-header">
            <div className="container main-header-inner">
              <Brand />
              <div className="main-header-actions">
                <DesktopNavigation />
                <Link
                  className="primary-button header-cta"
                  href="/dalibniekiem"
                >
                  Reģistrācija
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
                <MobileNavigation />
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
