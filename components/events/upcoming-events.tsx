import type { EventPreview } from "@/lib/mock-events";
import { EventCard } from "./event-card";
import "./upcoming-events.css";

export function UpcomingEvents({ events }: { events: EventPreview[] }) {
  return (
    <section className="upcoming-section" id="upcoming-events" aria-labelledby="upcoming-title">
      <div className="container">
        <div className="upcoming-heading">
          <h2 id="upcoming-title">Tuvākie pasākumi</h2>
          <p>Atrodi savu nākamo startu.</p>
        </div>

        <div className="event-card-grid">
          {events.length === 0 && <p>Jauni pasākumi tiks izziņoti drīzumā.</p>}
          {events.map((event) => <EventCard event={event} key={event.id} />)}
        </div>
      </div>
    </section>
  );
}
