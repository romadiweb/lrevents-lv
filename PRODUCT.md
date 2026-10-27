# LR Events

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Latvian-language LR Events website presenting motorsport events, participant information, results, and articles. The existing repository supplies these capabilities; no new positioning claims are established here.

## Capabilities and Constraints

- Public CMS content and the homepage support prerendering and prefetching. Server data revalidates after 60 seconds; CMS edits invalidate the existing content tags. The homepage does not wait on request-time CMS reads or show a loader in place of its content. Date-based event lists refresh using Europe/Riga time.
- Public headings omit trailing periods. The homepage hero reads “Sacensību gars. Latvijas ceļi!”.

- A protected Supabase CMS manages team members, articles, categories, partners, documents, events, gallery, users and competition results. Public pages read published CMS records. Editorial content has local availability fallbacks; result tables remain empty until real results are entered and published.
- Authenticated CMS editors can change their own password at `/admin/parole` without email confirmation. The browser renews its session with the new password afterward.
- The article archive uses category filtering only, without a race or year selector.
- The first archive page has a featured story, image tiles, and five older article rows. Subsequent pages show article rows only.
- Preserve the established LR Events identity and colors when adapting supplied visual references.
- The event directory uses the same card component as the homepage, in a single column below a current-month calendar. Event dates open event pages.
- Iepriekšējie pasākumi is a separate list-only page using the same cards, with ended events sorted newest first.
- Event pages show venue, schedule, participation and documents, with the current season standings below.
- CMS results are organized as seasons, rounds, classes, racing teams, participants, season entries, round results and individual runs. Scoped season/round/class/team filters, search and publication filters support ongoing entry. Teams assigned to season entries preserve historical season membership independently of a participant's default team.
- Each season configures points by position, run-point sums or manual entry, optional best-N rounds, and optional top-N team starts per round. Explicit round points override automatic calculation. Equal totals are resolved by counts of first places, then second places and so on; otherwise the rank is shared.
- Public round results, overall standings, archived seasons and a live view read the same published results. The live view requests fresh results every 30 seconds while visible. Official round placements are entered by editors; optional run timing is stored in milliseconds.
- The homepage team standings use calculated published season points, selected car-make logo watermarks and anonymous driver silhouettes. There is no demonstration standings fallback.
- The supplied legacy 2026 autosprint results are imported into the CMS (first two scored rounds, five configured rounds). Historical round dates may remain unknown; no dates or vehicle brands are inferred. Standings and gallery have a light gap, and empty standings use a readable light surface.
- Partners support an optional alternative homepage-belt logo and a single optional main footer partner. The footer uses the main logo; neutral grey preview backing remains CMS-only.
- Gallery images are managed in CMS with an exclusive URL/upload choice, optional titles/categories and explicit publication. The homepage loops through the first four published images; `/galerija` shows square tiles, category filtering and larger image viewing.
- Desktop article text uses a wider 900px maximum column. When no upcoming event exists, the hero's event link opens the past-event archive.

## Evidence on Hand

Event registration is implemented per event, with a public registration hub, open/closed/full status, scheduled deadlines in Europe/Riga, a configurable participant limit, and accepted participant lists. CMS opens to an application inbox with a polling notification count, private contact/payment review, and explicit identity matching against the shared participant registry. Acceptance reuses existing season/class entries without creating results or overwriting history. Setup and operational details are in `docs/registration.md`.

The repository contains the LR Events brand, motorsport photographs, local fallback previews, and DESIGN.md. The user supplied article-archive and podium layout references. The Supabase CMS and results schema are implemented; editors supply real competition records, scoring rules, editorial copy and team car assignments. CMS loading uses a local black Romadi mark with an animated surrounding ring; the cached contact page has no separate text-loading placeholder.
