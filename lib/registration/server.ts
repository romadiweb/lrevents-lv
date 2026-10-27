import "server-only";
import { isUuid } from "@/lib/cms/validation";
export function registrationError(message: string, code?: string) {
  if (code === "23505") return "Pieteikums šim dalībniekam jau pastāv. Ja jāmaina dati, sazinies ar organizatoru.";
  const errors: Record<string, string> = {
    REG_CLOSED: "Reģistrācija pašlaik ir slēgta.", REG_FULL: "Visas dalībnieku vietas ir aizņemtas.",
    REG_CONFIG: "Lai atvērtu reģistrāciju, izvēlies publicētu rezultātu posmu, klases un nolikuma saiti.",
    REG_ROUND: "Izvēlies publicētu posmu, kas nav piesaistīts citam pasākumam.", REG_ROUND_LOCKED: "Pasākumam jau ir pieteikumi. Saistīto posmu vairs nevar mainīt.",
    REG_DATES: "Reģistrācijas sākumam jābūt pirms beigu datuma.", REG_CAPACITY: "Vietu skaits nevar būt mazāks par apstiprināto dalībnieku skaitu.",
    REG_CLASSES: "Pārbaudi izvēlētās klases un pasākuma rezultātu posmu.", REG_TEAM: "Izvēlētā komanda nav pieejama.",
    REG_CONSENT: "Nolikums ir mainījies. Pārlādē lapu un iepazīsties ar aktuālo nolikumu.", REG_LIMIT: "Pārāk daudz mēģinājumu. Pamēģini vēlāk.",
    REG_PAYMENT: "Pirms apstiprināšanas atzīmē saņemtu dalības maksu vai atbrīvojumu no maksas.",
    REG_IDENTITY: "Pieteikums jau piesaistīts citam dalībniekam. Pārbaudi izvēlēto personu.", REG_MATCH: "Atrasts dalībnieks ar tādu pašu vārdu. Izvēlies esošo personu vai apstiprini, ka tas ir cits cilvēks.",
    REG_DUPLICATE_PERSON: "Dalībnieks ar šādu vārdu jau pastāv. Izmanto esošo ierakstu. Citam cilvēkam ar tādu pašu vārdu atzīmē attiecīgo lauku.",
    REG_MISSING: "Pieteikums nav atrasts.",
    REG_LINK_LOCKED: "Posmam jau ir reģistrācijas pieteikumi. Tā sezonu un saistīto pasākumu vairs nevar mainīt.",
  };
  return Object.entries(errors).find(([key]) => message.includes(key))?.[1] || "Neizdevās saglabāt. Pārbaudi datus un mēģini vēlreiz.";
}
export function validateApplication(input: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [key, min, max] of [["first_name", 1, 80], ["last_name", 1, 80], ["email", 3, 254], ["phone", 5, 40], ["car", 1, 120], ["start_number", 0, 20], ["licence_number", 0, 80]] as const) {
    const value = typeof input[key] === "string" ? input[key].trim().replace(/\s+/g, " ") : "";
    if (value.length < min || value.length > max || /[\u0000-\u001f]/.test(value)) throw Error("Pārbaudi obligātos laukus un teksta garumu.");
    result[key] = value;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(result.email))) throw Error("Ievadi derīgu e-pasta adresi.");
  if (!isUuid(input.event_id) || !Array.isArray(input.class_ids) || input.class_ids.length < 1 || input.class_ids.length > 3 || !input.class_ids.every(isUuid)) throw Error("Izvēlies pasākumu un vienu līdz trim klasēm.");
  if (input.team_id && !isUuid(input.team_id)) throw Error("Izvēlies derīgu komandu.");
  if (input.consent !== true || typeof input.rules_url !== "string" || input.rules_url.length > 2048) throw Error("Apstiprini iepazīšanos ar nolikumu un datu izmantošanu.");
  return { ...result, event_id: input.event_id, class_ids: [...new Set(input.class_ids)], team_id: input.team_id || null, consent: true, rules_url: input.rules_url };
}
