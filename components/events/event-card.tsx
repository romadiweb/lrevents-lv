import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { EventPreview } from "@/lib/events";
import "./upcoming-events.css";

/** Shared verbatim by the homepage and the event directory. */
export function EventCard({ event, sizes = "(max-width: 900px) 100vw, 50vw" }: { event: EventPreview; sizes?: string }) {
  return (
    <Link className="event-card" href={event.href} id={event.id} aria-label={`${event.title}, ${event.day}. ${event.month} ${event.year}. Skatīt pasākumu`}>
      <div className="event-card-date">
        <span className="event-card-day">{event.day}</span>
        <span className="event-card-month">{event.month}</span>
        <span className="event-card-year">{event.year}</span>
        <span className="event-card-city">{event.city}</span>
      </div>
      <div className="event-card-media">
        <Image src={event.image} alt="" fill sizes={sizes} className="event-card-image" />
        <div className="event-card-shade" aria-hidden="true" />
        <div className="event-card-content">
          <p>{event.venue} · {event.startLabel}</p>
          <h3>{event.title}</h3>
        </div>
        <ArrowRight className="event-card-arrow" size={20} strokeWidth={2.2} aria-hidden="true" />
      </div>
    </Link>
  );
}
