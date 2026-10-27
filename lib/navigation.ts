export type NavLink = { label: string; href: string };
export type NavItem =
  | (NavLink & { children?: never })
  | { label: string; href?: string; children: NavLink[] };

export const navigation: NavItem[] = [
  { label: "Pasākumi", href: "/pasakumi", children: [
    { label: "Pasākumu kalendārs", href: "/pasakumi" },
    { label: "Reģistrācija sacensībām", href: "/registracija" },
    { label: "Iepriekšējie pasākumi", href: "/pasakumi/arhivs" },
  ] },
  { label: "Rezultāti", href: "/rezultati", children: [
    { label: "Posmu rezultāti", href: "/rezultati" },
    { label: "Kopvērtējums", href: "/rezultati/kopvertejums" },
    { label: "Rezultātu arhīvs", href: "/rezultati/arhivs" },
    { label: "Tiešsaistes rezultāti", href: "/rezultati/live" },
  ] },
  { label: "Informācija", children: [
    { label: "Dalībniekiem", href: "/dalibniekiem" },
    { label: "Skatītājiem", href: "/skatitajiem" },
    { label: "Tiesnešiem", href: "/tiesnesiem" },
    { label: "Dokumenti", href: "/dokumenti" },
    { label: "Galerija", href: "/galerija" },
  ] },
  { label: "Raksti", href: "/raksti" },
  { label: "Par mums", href: "/par-mums", children: [
    { label: "Par LR Events", href: "/par-mums" },
    { label: "Kļūsti par biedru", href: "/biedrs" },
    { label: "Pasākumu organizēšana", href: "/organizet-pasakumu" },
    { label: "Partneriem", href: "/partneriem" },
  ] },
  { label: "Kontakti", href: "/kontakti" },
];
export const membershipLink: NavLink = { label: "Pievienojies", href: "/biedrs#pieteiksanas" };
