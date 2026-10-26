import { createHash } from "node:crypto";
import ts from "typescript";

export function extractLegacy(source) {
  const file = ts.createSourceFile("legacy.js", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const data = {};
  const keys = ["NUM_ROUNDS", "CLASSES", "roundNames", "appData", "teamsRoster", "pointsOverrides"];
  for (const statement of file.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const name = declaration.name.getText(file);
      if (keys.includes(name) && declaration.initializer) data[name] = JSON.parse(declaration.initializer.getText(file));
    }
  }
  if (!data.appData || !Array.isArray(data.CLASSES) || !Array.isArray(data.roundNames) || data.NUM_ROUNDS !== data.roundNames.length) throw Error("Incomplete legacy results data.");
  return data;
}

export function parseLegacyTime(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d+):(\d{2}),(\d{3})$/);
  if (!match || Number(match[2]) > 59) return null;
  return (Number(match[1]) * 60 + Number(match[2])) * 1000 + Number(match[3]);
}

const numeric = value => {
  if (value === "" || value == null) return null;
  const result = Number(value);
  if (!Number.isFinite(result)) throw Error("Invalid legacy numeric value.");
  return result;
};

export function convertLegacy(data, { year, name }) {
  if (!Number.isInteger(year) || year < 1900 || year > 2200 || !name) throw Error("A valid season year and name are required.");
  // Stable IDs allow interrupted imports to resume without duplicating or overwriting edits.
  const id = key => {
    const hash = createHash("sha256").update(`lrevents-legacy:${year}:${name}:${key}`).digest("hex").slice(0, 32);
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20)}`;
  };
  const published = { published: true };
  const seasonId = id("season");
  const tables = Object.fromEntries(["cms_seasons", "cms_rounds", "cms_classes", "cms_racing_teams", "cms_participants", "cms_entries", "cms_results", "cms_runs"].map(table => [table, []]));
  tables.cms_seasons.push({ ...published, id: seasonId, name, year, archived: false, scoring_mode: "position", points_scale: "15,12,10,8,6,5,4,3,2,1", best_rounds: 0, team_best: 3 });
  data.roundNames.forEach((round, i) => tables.cms_rounds.push({ ...published, id: id(`round:${i}`), season_id: seasonId, name: round, event_date: null, sort_order: i }));
  const memberships = new Map();
  for (const [team, members] of Object.entries(data.teamsRoster || {})) {
    tables.cms_racing_teams.push({ ...published, id: id(`team:${team}`), name: team, car_brand: "" });
    for (const member of members) {
      if (memberships.has(member)) throw Error("A source participant belongs to multiple teams.");
      memberships.set(member, id(`team:${team}`));
    }
  }
  const people = new Set();
  for (const [classIndex, cls] of data.CLASSES.entries()) {
    const group = data.appData[cls];
    if (!group) throw Error("Missing legacy class.");
    const classId = id(`class:${cls}`);
    tables.cms_classes.push({ ...published, id: classId, season_id: seasonId, name: cls, sort_order: classIndex });
    for (const person of group.participants) {
      const participantId = id(`person:${person.name}`);
      const teamId = memberships.get(person.name) ?? null;
      if (!people.has(person.name)) {
        const [firstName, ...lastName] = person.name.trim().split(/\s+/);
        tables.cms_participants.push({ ...published, id: participantId, first_name: firstName, last_name: lastName.join(" "), car: "", team_id: teamId });
        people.add(person.name);
      }
      const entryId = id(`entry:${cls}:${person.name}`);
      tables.cms_entries.push({ ...published, id: entryId, season_id: seasonId, class_id: classId, participant_id: participantId, team_id: teamId, start_number: person.start_nr || "", car: "" });
      person.rounds.forEach((round, index) => {
        const detail = group.round_details[index]?.[person.name];
        const position = numeric(round.place);
        const points = numeric(round.points);
        if (position === null && points === null) {
          if (detail) throw Error("Unmatched round details need review before import.");
          return;
        }
        if (detail?.place && numeric(detail.place) !== position) throw Error("Source placements disagree.");
        const resultId = id(`result:${cls}:${person.name}:${index}`);
        tables.cms_results.push({ ...published, id: resultId, season_id: seasonId, round_id: id(`round:${index}`), entry_id: entryId, position, points, status: "OK", notes: `Importēts no sākotnējās ${year}. gada rezultātu tabulas. Posma datums avotā nav norādīts.` });
        if (!detail) return;
        for (let run = 1; run <= 3; run++) {
          const rawTime = detail[`run${run}`], rawPenalty = detail[`pen${run}`], rawResult = detail[`res${run}`];
          const rawStatus = [rawResult, rawTime].find(value => ["DNS", "DNF", "DQ", "DSQ"].includes(value));
          for (const value of [rawTime, rawPenalty, rawResult]) {
            if (value && !["DNS", "DNF", "DQ", "DSQ"].includes(value) && parseLegacyTime(value) === null) throw Error("Unrecognized legacy time; stopped instead of guessing.");
          }
          const runPosition = numeric(detail[`pos${run}`]);
          if (!rawTime && !rawPenalty && !rawResult && runPosition === null) continue;
          tables.cms_runs.push({ ...published, id: id(`run:${cls}:${person.name}:${index}:${run}`), result_id: resultId, run_number: run, time_ms: parseLegacyTime(rawTime), penalty_ms: parseLegacyTime(rawPenalty), result_ms: parseLegacyTime(rawResult), points: rawStatus ? 0 : runPosition === null ? null : Math.max(31 - runPosition, 0), status: rawStatus === "DQ" ? "DSQ" : rawStatus || "OK" });
        }
      });
    }
  }
  if ([...memberships.keys()].some(member => !people.has(member))) throw Error("Unmatched team member; source identity needs review.");
  if (Object.keys(data.pointsOverrides || {}).length) throw Error("Manual team overrides need review before import.");
  return tables;
}
