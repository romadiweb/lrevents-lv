# Legacy results import

The supplied `kpv.js` results were imported into the CMS as the 2026 LR Events autosprint season. The source contains 57 distinct participant names, 96 class entries, 8 classes, 3 teams, 127 round results, and 381 individual runs. Only rounds 1 and 2 contain scores; rounds 3–5 remain unscored.

The importer reads only whitelisted JSON initializers through the TypeScript parser; it never executes the supplied JavaScript. It preserves names, placements, explicit championship points, timings, penalties, and DNS/DNF run statuses. Team totals use each participant's best class score per round, then the best three participant scores, matching the source: RUBĻOFKA Racing Team 84, ANG 58, Ē.R.K. Racing 31.

The files do not provide round dates or verified vehicle brands. Dates remain null and vehicle brands remain blank. Editors can supply these in the CMS. The nullable-date migration applies only to results rounds; event dates remain required.

Run a dry check with the original file:

```powershell
node scripts/import-legacy-results.mjs --source="path/to/kpv.js" --year=2026
```

Add `--apply` to import through the existing server credentials. The script checks the expected project, rejects unrelated existing results records, saves a private backup outside the repository, and uses stable IDs with insert-only upserts. Re-running cannot overwrite CMS edits or create duplicate imported rows. It verifies individual scores and team totals after reading the imported rows back from the database.

Public results and the homepage podium read the same CMS records. No hardcoded fallback results were added.
