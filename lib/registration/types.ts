export type RegistrationState = "open" | "closed" | "full" | "scheduled" | "ended";
export type PublicParticipant = { registration_id: string; driver: string; car: string; class_names: string[]; team_name: string; start_number: string };
export type RegistrationSnapshot = {
  id: string; slug: string; title: string; date: string; state: RegistrationState;
  capacity: number; accepted: number; opensOn: string; closesOn: string; rulesUrl: string;
  classes: { id: string; name: string }[]; teams: { id: string; name: string }[];
  participants: PublicParticipant[];
};
export const registrationLabels: Record<RegistrationState, string> = { open: "Reģistrācija atvērta", closed: "Reģistrācija slēgta", full: "Visas vietas aizņemtas", scheduled: "Reģistrācija vēl nav sākusies", ended: "Pasākums noslēdzies" };
export function nameKey(first: string, last: string) { return `${first} ${last}`.trim().replace(/\s+/g, " ").toLocaleLowerCase("lv"); }
export const reviewLabels: Record<string, string> = { pending: "Jauns pieteikums", accepted: "Apstiprināts", waitlisted: "Gaidīšanas sarakstā", rejected: "Noraidīts", cancelled: "Atcelts" };
