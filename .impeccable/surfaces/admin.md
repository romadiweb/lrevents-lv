---
version: 1
slug: "admin"
primary_target: "app/admin/layout.tsx"
related_targets: ["app/login/page.tsx", "app/admin/[section]/page.tsx", "app/admin/parole/page.tsx", "components/admin/admin-shell.tsx", "components/admin/content-editor.tsx", "components/admin/login-form.tsx", "components/admin/password-form.tsx", "components/admin/cms-loader.tsx", "components/admin/admin.css", "lib/cms/config.ts"]
---

# CMS administration and login

Mode: Operate. Basic administrative utility within the established LR Events world.

## Direction contract

THESIS: An authorized editor signs in, chooses a content section, scans its records, and creates or edits one record in a straightforward form. The login is deliberately plain; the user will style it later.

OWN-WORLD: Inherit DESIGN.md. Cherry (#810100) actions, Maroon (#630000) hover, off-white (#fafaf8) canvas, white data/form surfaces, Noir (#181717) text, neutral hairlines and near-square corners. This extension establishes no new visual system. Preserve DESIGN.md and .impeccable/design.json.

STORY: Maintain contact team members, articles and their categories, partners/sponsors, document links, events, gallery, competition results and CMS users. Public visibility is explicit; saving a draft and publishing are distinct choices in the same form.

FIRST VIEWPORT: On /login, a centered form with email, password, submission feedback and password recovery. On /admin, labeled icon navigation beside a section heading, record count, add action and table; the editor replaces the table when opened.

FORM: Flat, dense utility. No dashboard metrics, decorative photography or alternate concept is implied. Image previews exist only to help editors manage content.

## Observed layout and styling

- Desktop shell: 240px white sidebar, neutral right divider and flexible content column. Main padding is 48px vertically with responsive 20–64px horizontal gutters. Account name, public-site link, password action and sign-out sit below navigation.
- At 850px and below, navigation wraps across the top, main padding becomes 28px 20px and fields become one column. Labeled navigation remains visible.
- Tables remain at least 820px wide inside a horizontally scrollable region. A narrow-screen hint explains the scroll. Long record names and status columns retain useful widths; row action labels may hide while accessible names remain.
- Editors have a 1000px maximum width and top hairline. Fields use two columns with a 24px gap; textareas, image controls and related documents span both columns.
- Body text is 15px with 1.5 line height; headings are 30px (26px on narrow screens). Buttons and fields use 2px corners. Ordinary buttons are at least 42px high, row actions 36px and fields 44px. These are observed local utility dimensions, not changes to global tokens.
- Login has a 360px maximum form width with 20px gaps and 24px page padding. Keep its composition plain until the user's later styling request.

## Field rules

- Team: optional photo; first name, last name, role and email; ordering and publication.
- Articles: image, title, automatically populated slug, category, summary and article text; publication toggle and read-only publication timestamp shown in Europe/Riga.
- Categories: name and automatically populated slug; no publication toggle.
- Partners: logo, name, website URL, ordering and publication.
- Partners may also supply an alternative homepage-belt logo and select “Galvenais partneris kājenē”. At most one partner may have that designation, including drafts; remove the previous designation before selecting another. Published main partners appear in the dedicated footer position rather than being duplicated in the ordinary logo grid.
- Documents: title, URL, file-type selection and optional description; publication. This editor stores document links rather than uploading document binaries.
- Events: image, title, slug, venue/address, city, date, start time labeled as Latvian time, description, participant text and related-document checkboxes; publication. Draft documents remain identified as drafts in the picker; the empty picker directs the editor to Documents.
- Users: first name, last name and email; a new account requires an initial 12–128 character password. Existing email is read-only. Access is activated/deactivated rather than deleting users; the current user cannot disable their own access.
- Use the configured Latvian labels and native email, URL, date, time, number and select controls. Required fields carry an asterisk and native required constraints where supported. Article body remains a plain textarea.
- Images accept PNG, JPG, WebP and AVIF up to 10 MB; partner logos additionally accept SVG. SVG logos are rendered into lossless transparent WebP at logo resolution. Provide both drag-and-drop and a file-picker button, preview, replacement and removal. Upload communicates automatic resizing and WebP storage. Do not treat image removal as a completed save.
- Partner-logo previews use a neutral grey gradient backing only inside the CMS so both black and white marks remain visible. Public logos retain transparency without a backing or dotted footer box.

### Gallery editor extension

- Galerija manages an image, optional title, optional shared category, required image description, numeric ordering and explicit publication. New records start unpublished with file upload selected. The table includes a 56px thumbnail and uses the description when a title is absent.
- A labeled radio fieldset chooses exactly one image source: upload or image URL. Only the selected source control renders. Changing source clears the previous image value, so an old upload cannot silently remain selected as a URL or vice versa. Pending saves/uploads disable the containing fields.
- Upload reuses the existing image picker/dropzone and conversion feedback. URL entry uses a required native URL field and asks for a direct public image address. Server validation requires HTTPS for URL mode and an accepted local or CMS-storage path for upload mode; the selected source is persisted with the record.
- Public gallery content includes published records only, sorted by ascending ordering, then newest creation timestamp, then record ID. The homepage uses the first four in that order; drafts remain in administration.
- This extension preserves the existing inline editor, status/error feedback, focus styling and native form semantics. It establishes no additional design tokens. Source evidence: content-editor.tsx, lib/cms/config.ts, lib/cms/content.ts and lib/cms/validation.ts; no live CMS tests were repeated by this documentation pass.

## Interaction and feedback

- Add/edit opens one inline editor; close/cancel returns to the table. Save and delete wait for a successful server response before displaying success and refreshing records. Errors remain visible and editable content stays available for correction.
- Pending save/upload disables conflicting record actions and fields. Save text distinguishes uploading from saving; upload has its own busy label and error alert.
- Delete requires an explicit inline confirmation beside the affected row. Keep the cancel action adjacent. User rows offer editing without delete.
- New content starts unpublished. Categories are available directly; user access has its separate active state. Status text distinguishes published, draft, active and inactive beyond color.
- Empty tables explain how to add the first record. Login supports sign-in, reset-link request and password update. Reset feedback does not disclose whether an account exists; mismatched new passwords and denied CMS access receive explicit messages.
- “Mainīt paroli” opens `/admin/parole` inside the protected CMS. Editors enter and repeat a 10–128 character new password; the authenticated endpoint updates only their own account immediately without email confirmation. After success the browser signs in with the new password to renew its session. If renewal fails, the editor returns to login with guidance to use the new password. Email recovery remains available on the login page for forgotten passwords.
- CMS loading shows the local black Romadi logo inside a thin circular indicator with a Cherry rotating segment and a status label. Reduced-motion preference stops rotation. This is a loading state within the inherited visual system, not a new brand direction. The public contact page reads cached content directly and no longer adds a separate text-loading fallback.

### Competition results extension

- Labeled sidebar sections cover Sezonas, Rezultātu posmi, Sacensību klases, Sacīkšu komandas, Dalībnieki, Sezonas starti, Rezultāti and Braucienu laiki. They reuse the existing table/editor layout, controls and publication states.
- Create the season, its classes and rounds, then participants and season entries before entering round results and runs. Optional linked events connect rounds to existing event records. Publish the required parent records as well as the result itself.
- Result administration offers name/car/start-number search, applicable season/round/class/team filters, publication state and an active/archive filter for seasons. Round/class filter choices follow the selected season; changing season clears those dependent filters. Reset clears all filters, and a record count explains the visible subset. New records inherit selected relationship filters.
- Racing teams select a car brand from the existing local logo catalog. Participants have an optional default team, while each season entry has its own explicit team and car assignment. Later default-team changes do not rewrite previous season entries.
- Season settings include scoring mode (`position`, `run_sum`, `manual`), a comma-separated point scale, best-N counted rounds and top-N counted team starts per round; zero means all. Changing the scale recalculates automatically scored results. Explicit round points remain authoritative, including a recorded zero.
- Round results accept the official position, optional points override, OK/DNS/DNF/DSQ status and notes. Run rows accept a run number, optional time/penalty/approved adjusted result in milliseconds, optional points and status. Adjusted time is inferred only when both time and penalty exist; supplied timing does not invent an official round position.
- Overall ties compare the number of highest round placements, beginning with first places and then second, third and so on. Equal sporting records share a rank; name sorting only gives a stable display order. Team points are calculated from season-entry results, with the same placement-countback principle applied to team round standings.
- Public round results, standings, archive and the 30-second visible-page live refresh use these records. The homepage podium displays the current season's real team totals and selected car logos; empty results receive an explicit empty state.

## Accessibility rules

- Preserve visible labels and label/control associations, native form semantics, document fieldset legends and checkbox labels. Required image labeling is visual; final validity also depends on the server.
- Navigation uses text beside icons, an accessible region label and aria-current for the current page. Decorative navigation icons are hidden from assistive technology.
- The table uses column headings and scoped row headings; its labeled scroll region is keyboard focusable. Icon actions include the affected record's name in their accessible labels.
- Preserve the 2px Cherry focus-visible outline with 3px offset. Busy forms expose aria-busy; save/login feedback uses polite live status and upload errors use an alert.
- Do not infer modal behavior: the editor and delete confirmation are inline, without focus trapping. No custom focus transfer is implemented when these regions open or close.

## Evidence and limits

Documentation checked against PRODUCT.md, DESIGN.md, admin.css, content-editor.tsx, admin-shell.tsx, login-form.tsx, password-form.tsx, the password endpoint, cms-loader.tsx, CMS config, results-engine.ts, results-content.ts, results-refresh.tsx, homepage standings, contact content/page and the results migration. The implementation supplies the fields and behaviors above; this documentation pass did not repeat browser, database or authentication tests. Migration and live integration validation belong to the parent task's completion evidence.

Observed drift retained without repair: the root DESIGN.md uses its preexisting section/frontmatter structure rather than the current Impeccable canonical document format; `.impeccable/design.json` is absent. Local admin controls are denser than its general 48px control guidance; input corners are 2px rather than the general 4px input recommendation. These observations do not authorize a global design refresh. No system artifacts or application code are changed by this documentation pass.

Partner logos: optional `belt_image` is uploaded in Partneri and used only in the homepage belt, falling back to the main `image`. Footer always uses the main logo. Both support SVG and transparent compressed WebP; grey preview backing is CMS-only. Migration `20261022123550_partner_belt_logo_field.sql` applied.
