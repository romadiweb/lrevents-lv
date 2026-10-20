# LR Events — UX structure

Crawled 20 October 2026. Proposed structure for the rebuild; only the shared header and an empty scrollable homepage are implemented in this phase. All product navigation uses local routes. Destination pages are not implemented yet; do not add placeholder sections or pages. Legacy-site URLs below are crawl evidence only.

## Crawl inventory

| Source                                   | Content / finding                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| https://lrevents.lv/                     | About, organization services, team contacts, legal details, sponsors.                                                                     |
| https://lrevents.lv/skatitaji            | Dates, venues and spectator information. Main “Pasākumi” link also points here. A postponed August date appears beside its original date. |
| https://lrevents.lv/dalibnieki           | Registration currently closed, regulations, invoice instructions, entrants.                                                               |
| https://lrevents.lv/dokumenti            | Season and event regulations, bulletins, Google Drive files.                                                                              |
| https://lrevents.lv/rezultati            | Gateway to https://lrevent-live-results.netlify.app/ for results and standings.                                                           |
| https://lrevents.lv/tiesnesi             | Licensing; prior agreement with association head required.                                                                                |
| https://lrevents.lv/biedrs               | Membership application.                                                                                                                   |
| https://lrevents.lv/pasakumi             | Event-organizing service inquiries, despite ambiguous URL.                                                                                |
| https://lrevents.lv/buj                  | WhatsApp community gateway rather than an FAQ.                                                                                            |
| https://lrevents.lv/lietosanas-noteikumi | Site/event terms, safety, media and data processing.                                                                                      |

## Proposed sitemap

- Home `/`: introduction, next verified event, calendar, audience shortcuts, association, results, verified partners and contacts.
- Events `/pasakumi`: upcoming/past events by season, current date, venue, status and action.
  - Event `/pasakumi/[slug]`: date, location/map, program, registration status, entrants, documents, results and spectator guidance.
- Results `/rezultati`: season/event selection and clear external service handoff.
- Participants `/dalibniekiem`: preparation checklist, registration, entrant list, payment/invoice instructions.
  - Documents `/dokumenti`: season/event grouping, regulations, revisions and bulletins with file metadata.
  - Officials `/tiesnesiem`: licensing prerequisites, contact and official external license route.
- Spectators `/skatitajiem`: arrival, parking, schedule, safety and verified admission details.
- About `/par-mums`: association, team, services and partners.
  - Membership `/biedriem`: requirements, application, consent and confirmation.
  - Event inquiry `/pieteikt-pasakumu`: services and relevant organizer contact.
- Contacts `/kontakti`: team, legal details and inquiry routes.
- Community `/kopiena`: WhatsApp gateway with external destination context.
- Terms `/lietosanas-noteikumi`: verified existing policies; dedicated privacy content needs owner review.

## Header hierarchy

Utility: WhatsApp community · membership · contacts.
Primary: logo/home · events · results (race results, standings) · participants (registration/entrants, documents, officials) · spectators · about · registration CTA.
Mobile preserves ordering, exposes child links and moves utility links into a modal drawer.

## Main journeys

1. Participant: event → status → regulations → registration → confirmation → entrants → results. Closed registration explains the state and supplies another useful route.
2. Spectator: calendar → current event date → venue → arrival/safety → directions.
3. Returning visitor: results → season/event → existing results/standings application.
4. Customer: organization services → event inquiry → team contact.
5. Member/official: association → requirements → membership form or license destination.

## Content model

Event: stable ID, slug, title, season, discipline, original/current dates, timezone, venue/address/map, status (upcoming/postponed/cancelled/completed), program, registration status/URL, entrants URL, documents, results URL, visitor guidance.
Document: title, type, season, event reference, revision/date, URL, verified format/size.
Person: name, role, email, verified phone. Partner: name, authorized mark, URL.

Use one authoritative current date and a contextual postponement notice. All crawled calendar dates are past as of this audit; do not invent the next event. Distinguish event state from registration state. Do not invent news, ticketing, galleries, sponsors or open registration. Preserve legacy URLs with redirects when implementing new routes; old `/pasakumi` is a service inquiry and must not silently lose that purpose.

## Header implementation

36px utility + 80px main row; mobile 34px + 72px. Beyond 32px scroll, translate the fixed header up by the utility height over 300ms and transition Noir to off-white. Restore below 8px to prevent threshold flicker. Reserved document space stays constant. Hidden utility links are inert.

Underline grows from left on entry, then shrinks toward the right on exit. Dropdowns retain the active underline and support click, pointer, keyboard and Escape through Radix primitives. Mobile dialog traps focus, locks background scrolling and restores focus on close. Reduced motion disables transitions.

## Implementation sequence

1. Shared header (current phase).
2. Event data, calendar and detail pages.
3. Participant, spectator, document and result pages.
4. Association, membership, inquiry and contact pages.
5. Redirects, metadata, verified privacy/consent and cross-device QA.



