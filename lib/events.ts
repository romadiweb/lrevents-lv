export type EventPreview = {
  id: string;
  city: string;
  day: string;
  month: string;
  year: string;
  title: string;
  venue: string;
  startLabel: string;
  href: string;
  image: string;
};

export type CalendarEvent = Pick<EventPreview, "id" | "title" | "href" | "city"> & {
  date: string;
  endDate?: string;
};

export type MotorsportEvent = EventPreview & CalendarEvent & {
  startsAt?: string;
  summary: string;
  venueDescription: string;
  venueImage: string;
  directionsQuery?: string;
  registrationHref?: string;
  schedule: { time: string; title: string }[];
  documents: { title: string; href: string }[];
  isDemo: boolean;
};

// Presentation data, not a verified calendar. Replace with published CMS records later.
export const upcomingEvents: MotorsportEvent[] = [
  {
    id: "rudens-sprints", date: "2026-11-14", city: "Rīga",
    day: "14", month: "NOV", year: "2026", title: "Rudens autosprints",
    venue: "Biķernieku trase", startLabel: "Starts 10.00",
    startsAt: "2026-11-14T10:00:00+02:00",
    href: "/pasakumi/rudens-sprints", image: "/images/event-action.jpg",
    summary: "Autosprinta diena dalībniekiem un skatītājiem. Informācija par norisi, dalību un dokumentiem vienuviet.",
    venueDescription: "Pasākuma norises vieta maketā ir Biķernieku trase Rīgā. Precīza iebraukšana, trases konfigurācija un dalībnieku zonas tiks norādītas posma nolikumā.",
    venueImage: "/images/event-paddock.jpg", directionsQuery: "Biķernieku trase Rīga",
    schedule: [{ time: "10.00", title: "Starts" }], documents: [], isDemo: true,
  },
  {
    id: "ziemas-kauss", date: "2026-12-12", city: "Jelgava",
    day: "12", month: "DEC", year: "2026", title: "Ziemas kausa posms",
    venue: "Sacensību norises vieta tiks precizēta", startLabel: "Programma sekos",
    href: "/pasakumi/ziemas-kauss", image: "/images/event-start.jpg",
    summary: "Ziemas autosprinta pasākuma parauglapa. Šeit būs atrodama norises vieta, programma un dalībniekiem nepieciešamā informācija.",
    venueDescription: "Norises vieta Jelgavā vēl nav precizēta. Adrese, piekļuve un trases informācija tiks publicēta pēc apstiprināšanas.",
    venueImage: "/images/event-track.jpg", schedule: [], documents: [], isDemo: true,
  },
];

// Archive fixtures are separate from the homepage's existing upcoming samples.
// These are illustrative records, not claims about historical LR Events races.
const archiveSamples = [
  { id: "rudens-kausa-posms", date: "2026-09-26", day: "26", month: "SEP", title: "Rudens kausa posms", image: "/images/event-track.jpg" },
  { id: "vasaras-autosprints", date: "2026-08-22", day: "22", month: "AUG", title: "Vasaras autosprints", image: "/images/event-paddock.jpg" },
  { id: "vasaras-kausa-posms", date: "2026-07-18", day: "18", month: "JŪL", title: "Vasaras kausa posms", image: "/images/event-action.jpg" },
];

export const events: MotorsportEvent[] = [
  ...upcomingEvents,
  ...archiveSamples.map((sample) => ({
    ...upcomingEvents[0], ...sample,
    href: `/pasakumi/${sample.id}`,
    startsAt: undefined,
    startLabel: "Pasākums noslēdzies",
    summary: "Noslēgušos sacensību parauglapa ar norises informāciju un vietu pasākuma dokumentiem.",
    venueDescription: "Paraugpasākuma norises vieta ir Biķernieku trase Rīgā. Oficiālā trases konfigurācija un piekļuves norādes šim paraugam nav pievienotas.",
    schedule: [], documents: [],
  })),
];

export const featuredEvent = { ...upcomingEvents[0], startsAt: upcomingEvents[0].startsAt! };

export function getPastEvents(source: MotorsportEvent[], today: string) {
  return source.filter((event) => (event.endDate ?? event.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function rigaDate(now: Date) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Europe/Riga", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("lv-LV", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

export function eventOccursOn(event: CalendarEvent, date: string) {
  return event.date <= date && (event.endDate ?? event.date) >= date;
}

export function getCalendarMonth(month: string) {
  const [year, index] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, index - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, day) => {
    const date = new Date(Date.UTC(year, index - 1, day + 1 - offset));
    return { date: date.toISOString().slice(0, 10), day: date.getUTCDate(), inMonth: date.getUTCMonth() === index - 1 };
  });
  const label = new Intl.DateTimeFormat("lv-LV", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  return { label: label.charAt(0).toUpperCase() + label.slice(1), days };
}

export function shiftCalendarMonth(month: string, direction: number) {
  const [year, index] = month.split("-").map(Number);
  return new Date(Date.UTC(year, index - 1 + direction, 1)).toISOString().slice(0, 7);
}

export function eventsInMonth(source: CalendarEvent[], month: string) {
  const last = new Date(`${shiftCalendarMonth(month, 1)}-01T12:00:00Z`);
  last.setUTCDate(0);
  return source.filter((event) => event.date <= last.toISOString().slice(0, 10) && (event.endDate ?? event.date) >= `${month}-01`)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
}
