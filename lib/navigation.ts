export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };
export const navigation: NavItem[] = [
  { label: "Pasākumi", href: "/pasakumi" },
  {
    label: "Rezultāti",
    href: "/rezultati",
    children: [
      {
        label: "Sacensību rezultāti",
        href: "/rezultati",
      },
      { label: "Kopvērtējums", href: "/rezultati#kopvertejums" },
    ],
  },
  {
    label: "Dalībniekiem",
    href: "/dalibniekiem",
    children: [
      {
        label: "Reģistrācija un dalībnieki",
        href: "/dalibniekiem",
      },
      { label: "Nolikumi un dokumenti", href: "/dokumenti" },
      { label: "Tiesnešiem", href: "/tiesnesiem" },
    ],
  },
  { label: "Skatītājiem", href: "/skatitajiem" },
  { label: "Par mums", href: "/par-mums" },
  { label: "Kontakti", href: "/kontakti" },
];
export const utilityLinks: NavLink[] = [
  { label: "WhatsApp kopiena", href: "/kopiena" },
  { label: "Kļūsti par biedru", href: "/biedriem" },
  { label: "Kontakti", href: "/kontakti" },
];

