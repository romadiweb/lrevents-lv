# LR Events

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Latvian-language LR Events website presenting motorsport events, participant information, results, and articles. The existing repository supplies these capabilities; no new positioning claims are established here.

## Capabilities and Constraints

- A protected Supabase CMS manages team members, articles, categories, partners, documents, events and users. Public pages read published CMS records; local illustrative content is an availability fallback only.
- The article archive uses category filtering only, without a race or year selector.
- The first archive page has a featured story, image tiles, and five older article rows. Subsequent pages show article rows only.
- Preserve the established LR Events identity and colors when adapting supplied visual references.
- The event directory uses the same card component as the homepage, in a single column below a current-month calendar. Event dates open event pages.
- Iepriekšējie pasākumi is a separate list-only page using the same cards, with ended events sorted newest first.
- Event pages show venue, schedule, participation and documents, with the existing season standings below (not event-specific winners).
- The homepage team standings use car-make logo watermarks and anonymous driver silhouettes until verified makes and portraits are available.
- Gallery images are managed in CMS with an exclusive URL/upload choice, optional titles/categories and explicit publication. The homepage loops through the first four published images; `/galerija` shows square tiles, category filtering and larger image viewing.
- Desktop article text uses a wider 900px maximum column. When no upcoming event exists, the hero's event link opens the past-event archive.

## Evidence on Hand

The repository contains the LR Events brand, motorsport photographs, local fallback previews, and DESIGN.md. The user supplied article-archive and podium layout references. The Supabase CMS schema is implemented; real editorial copy and team car assignments still need to be entered by the owner.
