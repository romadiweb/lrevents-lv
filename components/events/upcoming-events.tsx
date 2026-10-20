import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { EventPreview } from "@/lib/mock-events";
import "./upcoming-events.css";

export function UpcomingEvents({ events }: { events: EventPreview[] }) {
  return (
    <section className="upcoming-section" id="upcoming-events" aria-labelledby="upcoming-title">
      <div className="container">
        <div className="upcoming-heading">
          <h2 id="upcoming-title">Tuvākie pasākumi</h2>
          <p>Datumi šobrīd ir maketa saturs un vēlāk tiks pārvaldīti CMS.</p>
        </div>

        <div className="event-card-grid">
          {events.map((event) => (
            <Link
              className="event-card"
              href={event.href}
              id={event.id}
              key={event.id}
              aria-label={`${event.title}, ${event.day}. ${event.month} ${event.year}. Skatīt pasākumu`}
            >
              <div className="event-card-date">
                <span className="event-card-day">{event.day}</span>
                <span className="event-card-month">{event.month}</span>
                <span className="event-card-year">{event.year}</span>
                <span className="event-card-city">{event.city}</span>
              </div>
              <div className="event-card-media">
                <Image
                  src={event.image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="event-card-image"
                />
                <div className="event-card-shade" aria-hidden="true" />
                <div className="event-card-content">
                  <p>{event.venue} · {event.startLabel}</p>
                  <h3>{event.title}</h3>
                </div>
                <ArrowRight className="event-card-arrow" size={20} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
