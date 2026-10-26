import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import ts from "typescript";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { extractLegacy, convertLegacy } from "./legacy-results.mjs";

const argument = key => process.argv.find(value => value.startsWith(`--${key}=`))?.slice(key.length + 3);
if (!argument("source")) throw Error("Provide --source=path/to/kpv.js and --year=2026. Default is a dry run; --apply imports the verified records.");
const data = extractLegacy(await readFile(argument("source"), "utf8"));
const tables = convertLegacy(data, { year: Number(argument("year")), name: argument("name") || "LR Events kausa izcīņa autosprintā" });
const engine = ts.transpileModule(await readFile(new URL("../lib/results-engine.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { buildResults } = await import(`data:text/javascript;base64,${Buffer.from(engine).toString("base64")}`);
function verify(actual) {
  const built = buildResults(actual);
  const season = built.current.find(s => s.id === tables.cms_seasons[0].id);
  assert.ok(season, "Imported season must be published.");
  for (const cls of data.CLASSES) for (const participant of data.appData[cls].participants) {
    const entry = season.entries.find(e => e.classId === tables.cms_classes.find(c => c.name === cls).id && e.driver === participant.name);
    if (!participant.rounds.some(r => r.points !== "" || r.place !== "")) continue;
    assert.ok(entry, "Source participant must retain their class result.");
    assert.equal(entry.officialTotal, participant.rounds.reduce((total, r) => total + Number(r.points || 0), 0));
    participant.rounds.forEach((r, index) => assert.equal(entry.scores[tables.cms_rounds[index].id] ?? null, r.points === "" ? null : Number(r.points)));
  }
  for (const [team, members] of Object.entries(data.teamsRoster)) {
    const expected = data.roundNames.map((_, index) => {
      const points = members.map(member => Math.max(0, ...data.CLASSES.flatMap(cls => data.appData[cls].participants.filter(p => p.name === member).map(p => Number(p.rounds[index]?.points || 0))))).sort((a, b) => b - a);
      return points.slice(0, 3).reduce((sum, p) => sum + p, 0);
    });
    const actualTeam = built.teams[season.id].find(t => t.name === team);
    assert.deepEqual(actualTeam.rounds.map(p => p ?? 0), expected, "Team points must match the source's best-class/top-three calculation.");
  }
  return { teams: built.teams[season.id].map(t => ({ name: t.name, points: t.points, rounds: t.rounds })) };
}
console.log("Verified source:", JSON.stringify({ records: Object.fromEntries(Object.entries(tables).map(([table, rows]) => [table, rows.length])), ...verify(tables), dates: "Unknown; no dates invented." }, null, 2));
if (!process.argv.includes("--apply")) process.exit(0);

nextEnv.loadEnvConfig(process.cwd());
if (new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname !== "kvugvrxyqfaytgmmfdfx.supabase.co") throw Error("Unexpected target project.");
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const existing = {};
for (const table of Object.keys(tables)) {
  const { data: rows, error } = await client.from(table).select("*").limit(10000);
  if (error) throw Error(`${table}: ${error.message}`);
  existing[table] = rows;
  // Never merge this imported season with independently created records.
  if (rows.some(row => !tables[table].some(incoming => incoming.id === row.id))) throw Error(`${table} contains other records; review a merge before importing.`);
}
const backupDirectory = path.join(homedir(), ".codex/private/lrevents-results-backups");
await mkdir(backupDirectory, { recursive: true });
await writeFile(path.join(backupDirectory, `before-import-${Date.now()}.json`), JSON.stringify(existing, null, 2));
for (const [table, rows] of Object.entries(tables)) {
  if (!rows.length) continue;
  const { error } = await client.from(table).upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw Error(`${table}: ${error.message}. Existing records were preserved; the import may safely resume.`);
}
const imported = {};
for (const table of Object.keys(tables)) {
  const { data: rows, error } = await client.from(table).select("*").limit(10000);
  if (error) throw Error(`${table}: ${error.message}`);
  imported[table] = rows;
  assert.equal(rows.length, tables[table].length, `${table}: imported count mismatch`);
}
console.log("Database import verified:", JSON.stringify(verify(imported)));
