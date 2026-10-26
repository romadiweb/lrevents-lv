import assert from "node:assert/strict";
import { extractLegacy, convertLegacy, parseLegacyTime } from "./legacy-results.mjs";

const participant = points => ({ name: "Ada Test", start_nr: "7", rounds: [{ place: "1", points }, { place: "", points: "" }] });
const fixture = {
  NUM_ROUNDS: 2, CLASSES: ["A", "B"], roundNames: ["Round 1", "Round 2"],
  teamsRoster: { Team: ["Ada Test"] }, pointsOverrides: {},
  appData: {
    A: { participants: [participant("15")], round_details: [{ "Ada Test": { place: "1", run1: "1:00,000", pen1: "0:10,000", res1: "1:10,000", pos1: "1", run2: "DNF", res2: "DNF" } }, {}] },
    B: { participants: [participant("0")], round_details: [{ "Ada Test": { place: "1", run1: "DNS", res1: "DNS" } }, {}] },
  },
};
const source = Object.entries(fixture).map(([key, value]) => `let ${key} = ${JSON.stringify(value)};`).join("\n");
const parsed = extractLegacy(source);
const tables = convertLegacy(parsed, { year: 2026, name: "Test" });
assert.deepEqual(tables, convertLegacy(parsed, { year: 2026, name: "Test" }), "IDs and records are deterministic for safe restarts");
assert.equal(tables.cms_participants.length, 1);
assert.equal(tables.cms_entries.length, 2, "class entries share the same participant identity");
assert.equal(tables.cms_results.length, 2, "future rounds do not acquire zero-point results");
assert.equal(tables.cms_results[1].points, 0, "explicit zero remains a recorded score");
assert.equal(tables.cms_rounds[0].event_date, null, "unknown dates are not invented");
assert.equal(tables.cms_runs[0].result_ms, 70000);
assert.equal(tables.cms_runs[0].penalty_ms, 10000);
assert.equal(tables.cms_runs[0].points, 30);
assert.equal(tables.cms_runs[1].status, "DNF");
assert.equal(tables.cms_runs[2].status, "DNS");
assert.equal(parseLegacyTime("0:00,000"), 0);
assert.equal(parseLegacyTime("1:60,000"), null);
assert.equal(parseLegacyTime(""), null);
assert.throws(() => extractLegacy("let appData = (() => { throw Error('must never run'); })();"), SyntaxError, "non-JSON code is rejected without execution");
assert.throws(() => convertLegacy({ ...parsed, teamsRoster: { Team: ["Unknown"] } }, { year: 2026, name: "Test" }), /Unmatched team member/);
console.log("Legacy import tests passed: safe JSON extraction, stable IDs, class identities, zero/future results, unknown dates, penalties, run points, DNS/DNF, and unmatched roster rejection.");
