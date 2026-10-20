import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { featuredEvent } from "@/lib/mock-events";
import { EventCountdown } from "./event-countdown";
import "./hero-section.css";

export function HeroSection() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <Image
        className="home-hero-image"
        src="/images/lr-events-hero.jpg"
        alt="Autosporta dalībnieki un automašīnas LR Events pasākuma norises vietā"
        fill
        preload
        sizes="100vw"
      />
      <div className="home-hero-shade" />
      <div className="container home-hero-grid">
        <div className="hero-introduction">
          <h1 id="home-hero-title">Sacensību gars. Latvijas ceļi.</h1>
          <p>
            LR Events veido autosporta notikumus, kuros precīza organizācija
            satiekas ar īstu sacensību atmosfēru.
          </p>
          <Link className="hero-text-link" href="#upcoming-events">
            Atklāt pasākumus
            <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="next-event-panel">
          <p className="next-event-label">Nākamais pasākums · demo saturs</p>
          <h2>{featuredEvent.title}</h2>
          <div className="next-event-meta">
            <MapPin size={16} aria-hidden="true" />
            <span>
              {featuredEvent.city} · {featuredEvent.venue} · {featuredEvent.day}. {featuredEvent.month.toLowerCase()}.
            </span>
          </div>
          <EventCountdown target={featuredEvent.startsAt} />
          <div className="hero-event-actions">
            <Link className="primary-button hero-event-cta" href={featuredEvent.href}>
              Skatīt pasākumu
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link className="hero-secondary-button" href="/dalibniekiem">
              Reģistrēties
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
