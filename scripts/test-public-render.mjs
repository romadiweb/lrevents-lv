import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

// Run after `npm run build`: the main content must be in the generated HTML,
// rather than a header/footer shell waiting for request-time CMS reads.
for (const route of ["index", "kontakti", "biedrs", "par-mums", "partneriem", "organizet-pasakumu", "dokumenti", "galerija", "pasakumi/arhivs", "rezultati/kopvertejums", "rezultati/live", "rezultati/arhivs"]) {
  const html = await readFile(new URL(`../.next/server/app/${route}.html`, import.meta.url), "utf8");
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0];
  assert.ok(main, `${route}: main content must be prerendered`);
  assert.match(main, /<h1\b/, `${route}: the actual page title must be in the initial HTML`);
  for (const [, markup] of main.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
    const title = markup.replace(/<[^>]+>/g, "").trim();
    assert.ok(!title.endsWith("."), `${route}: heading ends with a period: ${title}`);
  }
  if (route === "index") {
    assert.match(main, /Sacensību gars\. Latvijas ceļi!/, "homepage hero keeps the requested punctuation");
    assert.match(main, /id="standings"/, "standings must ship in the initial HTML");
    assert.match(main, /id="upcoming-events"/, "event section must ship in the initial HTML");
    assert.doesNotMatch(main, /Ielādē…/, "homepage does not replace its content with a loader");
  }
}
console.log("Public render tests passed: complete prerendered page content, homepage sections, hero punctuation, and headings without trailing periods.");
