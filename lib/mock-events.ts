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

// Temporary presentation data. This shape can later be populated from Supabase.
export const upcomingEvents: EventPreview[] = [
  {
    id: "rudens-sprints",
    city: "Rīga",
    day: "14",
    month: "NOV",
    year: "2026",
    title: "Rudens autosprints",
    venue: "Biķernieku trase",
    startLabel: "Starts 10.00",
    href: "#rudens-sprints",
    image: "/images/event-action.jpg",
  },
  {
    id: "ziemas-kauss",
    city: "Jelgava",
    day: "12",
    month: "DEC",
    year: "2026",
    title: "Ziemas kausa posms",
    venue: "Sacensību norises vieta tiks precizēta",
    startLabel: "Programma sekos",
    href: "#ziemas-kauss",
    image: "/images/event-start.jpg",
  },
];

export const featuredEvent = {
  ...upcomingEvents[0],
  startsAt: "2026-11-14T10:00:00+02:00",
};

export type ArticlePreview = {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  href: string;
};

export const articlePreviews: ArticlePreview[] = [
  {
    id: "sezonas-aizkulises",
    title: "Autosprints pilsētvidē: sezonas aizkulises",
    summary:
      "Ieskats trasē, komandās un cilvēkos, kas veido LR Events sacensību dienu.",
    date: "Demo raksts",
    image: "/images/event-paddock.jpg",
    href: "#sezonas-aizkulises",
  },
  {
    id: "trases-ritms",
    title: "Trases ritms un precizitāte",
    summary: "",
    date: "Demo raksts",
    image: "/images/event-track.jpg",
    href: "#trases-ritms",
  },
  {
    id: "dalibnieku-stasti",
    title: "Dalībnieku stāsti no piektā posma",
    summary: "",
    date: "Demo raksts",
    image: "/images/event-start.jpg",
    href: "#dalibnieku-stasti",
  },
  {
    id: "diena-kustiba",
    title: "Sacensību diena kustībā",
    summary: "",
    date: "Demo raksts",
    image: "/images/event-action.jpg",
    href: "#diena-kustiba",
  },
];
