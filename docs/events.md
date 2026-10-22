# Events and calendar

`lib/events.ts` owns the temporary `MotorsportEvent` source and calendar/date helpers. The two existing sample events retain their original November and December 2026 dates. No current-month event is fabricated to populate the calendar. All dates and details are labeled illustrative.

The samples are Rudens autosprints on 14 November 2026 and Ziemas kausa posms on 12 December 2026. At the October 2026 review, the initial calendar therefore honestly shows an empty month while both upcoming cards remain available below.

The homepage and directory both render `components/events/event-card.tsx` and the existing `upcoming-events.css`. Only the directory wrapper controls the single-column layout; card markup, styling, dimensions, and interactions are shared. Homepage event links and its featured-event action now open `/pasakumi/[slug]`.

`/pasakumi` computes today's date per request in `Europe/Riga`, inside Suspense after `connection()`. This avoids stale build-time dates and timezone hydration mismatches. The client calendar starts on that month; previous/next and Šomēnes controls change/reset it. Monday-first, six-week grids support year boundaries and leap days. Circles identify event dates. A single event links directly to its page; multiple events on one day open an agenda with separate links. Inclusive date ranges are supported. The calendar has a month agenda, empty-month messaging, and a shortcut to the next upcoming event.

Calendar month and day selection are local client state, not URL parameters. Changing or resetting the month clears the selected day. The empty-month shortcut opens the month containing the next upcoming event (or the current month for an ongoing event); the circled date or agenda link then opens the detail page.

`/pasakumi/arhivs` is a standalone list-only page: no calendar or filters. It shares the homepage EventCard, selects events whose end date is before today's date in Europe/Riga, and sorts newest first. Three explicitly illustrative archive samples (September, August, July 2026) provide visible examples; the homepage still uses only its original two upcoming samples. Empty published data has an empty state. The legacy `/pasakumi?skats=arhivs` URL now redirects to the standalone archive. Main navigation and list links use the dedicated route.

The default directory shows current/future events earliest first. Calendar and list selection are independent: changing months does not hide upcoming cards below. The calendar includes the archive samples on their historical dates. Event details evaluate whether the event has ended at request time; ended events have closed-registration copy and link back to the archive.

Detail pages adapt the supplied concept with a photo hero, date and location, working section links, venue overview/photo, schedule, participation, and documents. Unconfirmed maps, track specifications, registration links, and documents are not invented. A venue map search link appears only when the source supplies a confirmed demo search query; the unconfirmed venue has no map link. Existing document-library and participant pages remain reachable. Season standings are reused below by explicit user choice, with their existing season labels and mock-data note.

The detail slug is the event `id`; unknown slugs return 404. The winter sample has no map link, schedule, registration destination, or event documents and displays the corresponding pending information. The autumn sample retains its original illustrative 10.00 start and venue search link. Its photograph is not a circuit map or confirmed track configuration.

All photographs already existed under `public/images`; this change adds no photographic assets. The existing season watermark assets retain their own catalog provenance. Demo detail pages are noindex, and no fabricated Event structured data is emitted.

For CMS integration, replace the event source with published records, validate ISO dates/date ranges and URLs at the data boundary, derive the card date labels from those dates, and supply actual venue, schedule, registration, and document fields. Archive-year filtering and event-specific historical winners are not included. The homepage's two sample event exports preserve existing presentation; a future live feed should select upcoming homepage events server-side from the current published dataset.

## Completion evidence

Archive follow-up: the standalone list was checked at desktop and mobile widths with three newest-first cards and no calendar, filters, or horizontal overflow. A past-event card opened its detail, showed registration closed, and returned to the archive. The legacy archive query redirected to the new route. Date assertions covered newest-first order, exclusion of future/ongoing events, exact end-date boundaries, empty data, and preserved homepage samples. Production build, TypeScript, lint, whitespace, and the scoped design detector passed; navigation produced no new warning or error logs. Captures: `.impeccable/review/event-archive/desktop.png` and `mobile.png`. The original broader review below predates this local follow-up.

The finish review returned **ship** with no material findings after validating `.impeccable/review/events/desktop.png`, `november.png`, `mobile.png`, `detail-desktop.png`, and `detail-mobile.png`. TypeScript, lint, production build, and whitespace checks passed. Date/helper assertions covered Riga day and daylight-saving boundaries, year changes, leap days, calendar grids, and inclusive event ranges.

Browser checks passed for keyboard month navigation, next-event shortcut, the circled 14 November detail route, section anchors, current-month reset, archive empty state and redirect, mobile overflow, and winter pending information. Detail navigation produced no new warning or error logs. This records the completed implementation and finish review; it does not start another review.

The extension preserves the established off-white, Noir, Cherry, Geist, shared event-card, and season-standings system. Calendar circles and the reference-adapted detail composition remain local surface choices; no durable token or visual-world change was introduced. `DESIGN.md` and existing system artifacts are preserved.

Pre-existing drift remains unchanged: shared `.site-content-page` rules italicize interior headings although `DESIGN.md` cautions against italicizing every heading. This is incumbent behavior, not a new design-system rule.
