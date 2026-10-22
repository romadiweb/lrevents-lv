"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { eventOccursOn, eventsInMonth, formatEventDate, getCalendarMonth, shiftCalendarMonth, type CalendarEvent } from "@/lib/events";
import "./event-calendar.css";

const weekdays = [["P", "Pirmdiena"], ["O", "Otrdiena"], ["T", "Trešdiena"], ["C", "Ceturtdiena"], ["P", "Piektdiena"], ["S", "Sestdiena"], ["Sv", "Svētdiena"]];

export function EventCalendar({ events, today }: { events: CalendarEvent[]; today: string }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const calendar = getCalendarMonth(month);
  const monthEvents = eventsInMonth(events, month);
  const visibleEvents = selectedDay ? monthEvents.filter((event) => eventOccursOn(event, selectedDay)) : monthEvents;
  const nextEvent = [...events].filter((event) => (event.endDate ?? event.date) >= today).sort((a, b) => a.date.localeCompare(b.date))[0];

  const changeMonth = (value: string) => { setMonth(value); setSelectedDay(null); };

  return <section className="event-calendar" aria-label="Pasākumu kalendārs">
    <div className="calendar-heading">
      <h2 id="event-calendar-title" aria-live="polite" aria-atomic="true">{calendar.label}</h2>
      <div className="calendar-controls">
        <button className="calendar-today-button" type="button" onClick={() => changeMonth(today.slice(0, 7))} aria-pressed={month === today.slice(0, 7)}>Šomēnes</button>
        <button className="calendar-arrow" type="button" aria-label="Iepriekšējais mēnesis" onClick={() => changeMonth(shiftCalendarMonth(month, -1))}><ChevronLeft size={19} aria-hidden="true" /></button>
        <button className="calendar-arrow" type="button" aria-label="Nākamais mēnesis" onClick={() => changeMonth(shiftCalendarMonth(month, 1))}><ChevronRight size={19} aria-hidden="true" /></button>
      </div>
    </div>

    <div className="calendar-layout">
      <div className="calendar-month">
        <table aria-labelledby="event-calendar-title">
          <thead><tr>{weekdays.map(([short, full]) => <th scope="col" key={full}><abbr title={full}>{short}</abbr></th>)}</tr></thead>
          <tbody>{Array.from({ length: 6 }, (_, week) => <tr key={week}>{calendar.days.slice(week * 7, week * 7 + 7).map((day) => {
            const dayEvents = day.inMonth ? monthEvents.filter((event) => eventOccursOn(event, day.date)) : [];
            const classes = `calendar-day${day.date === today ? " calendar-day--today" : ""}${!day.inMonth ? " calendar-day--outside" : ""}${dayEvents.length ? " calendar-day--event" : ""}`;
            const label = `${formatEventDate(day.date)}${day.date === today ? ", šodien" : ""}${dayEvents.length ? `: ${dayEvents.map((event) => event.title).join(", ")}` : ""}`;
            return <td key={day.date}>
              {dayEvents.length === 1 ? <Link className={classes} href={dayEvents[0].href} aria-label={label} aria-current={day.date === today ? "date" : undefined}>{day.day}</Link>
                : dayEvents.length > 1 ? <button type="button" className={classes} aria-label={label} aria-expanded={selectedDay === day.date} aria-controls="calendar-agenda" onClick={() => setSelectedDay(selectedDay === day.date ? null : day.date)}>{day.day}<small>{dayEvents.length}</small></button>
                  : <span className={classes} aria-label={day.inMonth ? label : undefined} aria-current={day.date === today ? "date" : undefined} aria-hidden={!day.inMonth || undefined}>{day.day}</span>}
            </td>;
          })}</tr>)}</tbody>
        </table>
        <p className="calendar-legend"><span className="calendar-legend-circle" aria-hidden="true" />Pasākuma diena — atver pasākumu<span className="calendar-legend-today" aria-hidden="true" />Šodiena</p>
      </div>

      <div className="calendar-agenda" id="calendar-agenda" aria-live="polite" aria-atomic="true">
        <div className="calendar-agenda-heading"><h3>{selectedDay ? formatEventDate(selectedDay) : "Pasākumi šajā mēnesī"}</h3>{selectedDay && <button type="button" onClick={() => setSelectedDay(null)}>Viss mēnesis</button>}</div>
        {visibleEvents.length > 0 ? <ul>{visibleEvents.map((event) => <li key={event.id}><Link href={event.href}>
          <time dateTime={event.date}>{formatEventDate(event.date)}{event.endDate && event.endDate !== event.date && <> – {formatEventDate(event.endDate)}</>}</time>
          <strong>{event.title}</strong><span>{event.city}<ArrowRight size={17} aria-hidden="true" /></span>
        </Link></li>)}</ul> : <div className="calendar-empty"><p>Šajā mēnesī nav ieplānotu pasākumu.</p><p>Pārskati citus mēnešus vai apskati tuvākos pasākumus zemāk.</p>{nextEvent && <button type="button" onClick={() => changeMonth((nextEvent.date < today ? today : nextEvent.date).slice(0, 7))}>Uz nākamo pasākumu<ArrowRight size={17} aria-hidden="true" /></button>}</div>}
      </div>
    </div>
  </section>;
}
