---
version: 1
slug: "app-pasakumi-page-tsx"
primary_target: "app/pasakumi/page.tsx"
related_targets: ["app/pasakumi/[slug]/page.tsx","components/events/event-card.tsx","components/events/event-calendar.tsx"]
---

# Pasākumi and event details

Mode: Operate / Read. Extend the existing LR Events visual system using the two supplied references.

## Direction contract

THESIS: A real current-month calendar leads into one column of the exact event cards used on the homepage. Calendar event days open the event detail directly; multiple events on one day remain individually reachable.

OWN-WORLD: Inherit DESIGN.md and the existing event-card styles: Cherry date blocks, Noir photo overlays, Geist typography, off-white content areas, sharp geometry. No new brand tokens.

STORY: Find a date, open an event, understand where and when it happens, then find participant information and documents. Month navigation, a today reset, and an upcoming-event shortcut handle empty months. An archive view remains useful as events accumulate.

FIRST VIEWPORT: A concise Pasākumi heading and breadcrumb, followed by a seven-column Monday-first calendar with Cherry circles on event dates and a month agenda. Below it, a single card column. Detail pages start with a photo hero, date/location, and anchors to participation, venue, and documents, then a two-column venue overview and schedule.

FORM: Direct adaptation of the user's supplied references; no alternate concept round. Existing homepage card markup becomes one shared EventCard component. The user explicitly requested reusing season standings below the event details, without presenting them as event-specific winners.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Content provenance

Reuse existing project photographs. Event dates and details remain demo data. No invented track map, circuit specifications, registration destination, event-specific documents, or historic winners. Current date is computed at request time in Europe/Riga, independent of build date or server timezone.

## Completion evidence

Archive follow-up: `/pasakumi/arhivs` is now a separate list-only page using EventCard and existing tokens. Ended events are sorted newest first using the current Riga date; three marked demo records illustrate it. No calendar or extra filters appear on the archive page. Legacy archive query links redirect here; ended-event details show registration closed and link back to this archive. The original directory/detail review below predates this local extension.

Finish review: **ship**, no material findings. Validated captures: `.impeccable/review/events/desktop.png`, `november.png`, `mobile.png`, `detail-desktop.png`, and `detail-mobile.png`. TypeScript, lint, production build, whitespace, date/helper assertions, and browser interaction checks passed; detail navigation produced no new warning or error logs. The initial October 2026 calendar is honestly empty, with only the original 14 November and 12 December samples and an upcoming-month shortcut. `docs/events.md` records calendar state, archive routing, detail fallbacks, shared-component provenance, and verification. All photographs predate this extension. `DESIGN.md` and system artifacts remain unchanged; incumbent italic-heading drift is recorded separately from this surface's choices.
