# LR Events CMS

Project: `kvugvrxyqfaytgmmfdfx`. Credentials are in ignored `.env.local`. Never place the secret key in a `NEXT_PUBLIC_` variable, client component, repository or response.

## Applied setup

`migrations/20261022105653_content_cms.sql` was applied to the live project on 22 October 2026 through a verified TLS session-pooler connection. Its version is recorded in `supabase_migrations.schema_migrations`. The original public schema was empty. The old `contact-content-setup.sql` is superseded and should not be applied.

Tables: `cms_users`, `cms_team`, `cms_articles`, `cms_categories`, `cms_partners`, `cms_documents`, `cms_events`, `cms_event_documents`. All have RLS. Four current team members, four existing documents, and four initial article categories were imported. Demonstration articles/events and placeholder partners are not inserted as real content.

The requested Roberts Džeriņš Auth account and active CMS profile exist. Initial credentials are saved privately outside the repository at `~/.codex/private/lrevents-first-login.txt`. Scripts never print them. Login at `/login`; manage content under `/admin`. Change the initial password through “Mainīt paroli”. Creating new CMS users requires an initial password entered by an administrator and does not send email.

## Security and content

Public clients use the publishable key and read published records only. Categories are public. Profiles are private and authenticated users cannot write them directly. Every admin page, mutation and upload validates the Auth user and an active `cms_users` profile. User administration additionally uses the server secret after authorization. Deactivation removes write access under RLS. Public signup never grants CMS access.

Articles receive `published_at` on first publication through a database trigger; edits and republication retain it. Category deletion is blocked while referenced by articles. Slugs determine public page URLs; changing a slug changes its address. Event saves and document associations are atomic through a security-invoker RPC. Draft documents stay off public event pages.

The editor supports image selection or drag/drop. The server validates and decodes the file, removes metadata, preserves transparency, and produces WebP: photos fit within 1920×1920; logos within 640×640. The public `cms-media` bucket contains these images. Storage writes require an active CMS profile and the user's upload folder. Unused images are retained when records/images are removed, preserving any shared image URLs; cleanup can be added later.

Partner-logo uploads also accept SVG (file picker or drop). SVG is rendered at logo resolution and stored as lossless transparent WebP, rather than serving the uploaded XML. Photo/gallery uploads continue to accept raster formats only.

Published partners feed the clickable homepage sponsor strip and footer. Team records feed Kontakti. Articles feed the homepage, category archive and detail pages. Events feed homepage cards/countdown, calendar, upcoming/archive lists, and detail pages with participant text and linked documents. Dates/times use Europe/Riga. Association address and banking details remain in `lib/contacts.ts`.

Public content is cached for 60 seconds (five-minute maximum expiry). CMS saves invalidate content and public routes immediately. Connection/table failures retain the prior labelled local fixtures. Empty functioning CMS tables stay empty.

## Verification and maintenance

`npm run test:cms` runs the migration in embedded PostgreSQL: RLS, publication dates, profile protection, document visibility, atomic rollback, category constraints, upload ownership and deactivation.

`npm run test:cms:live` is an explicit live integration check. It creates a dedicated temporary CMS test account plus labelled temporary records and another temporary user, tests protected endpoints, compression, publication, dynamic pages and links, then removes its records/media/users. It requires a running local app and server credentials, and never reads or changes the owner's password. Set `CMS_TEST_ORIGIN=http://localhost:3001` to test a local production preview instead of the default port 3000.

`scripts/bootstrap-cms-user.mjs` can rerun profile bootstrap without resetting an existing password. `scripts/cms-database.mjs --pooler --verify` uses the private machine-only connection file `~/.codex/private/lrevents-db.json`; runtime website operations never use the database password.

For password-recovery email links, configure Supabase Auth's Site URL and allowed redirects for the deployed origin and `http://localhost:3000/auth/callback`. Recovery uses PKCE and returns to `/auth/password`. Initial-password login works independently of email delivery configuration.

The connected Supabase MCP account still lacks management permission for this project, so its automated advisors were unavailable. Direct SQL inspection and public/authenticated API checks were used. Run dashboard Security/Performance Advisors after reconnecting that account.

## Gallery

`migrations/20261022120523_gallery_content.sql` is applied and recorded in the live project. `cms_gallery` stores one image value and its selected source (`upload` or `url`), optional title/category, required accessible image description, sort order and publication state. Gallery uses the existing shared category catalog. Source choice is enforced by the editor, server validation and database constraint; URL mode accepts HTTPS, while upload mode accepts the configured media bucket or existing local site images. Uploaded photos use the existing compression path. External URLs load directly in the visitor's browser, bypassing the server image optimizer.

The existing four homepage photographs were imported as published editable records. The first four published gallery records, ordered by `sort_order` and then newest first, form the homepage carousel. Empty galleries hide that homepage band. `/galerija` shows all published records in square tiles with optional captions, category filtering and an accessible image viewer. Gallery saves invalidate the same CMS cache as the other content sections. Draft images stay off public gallery pages; files in the media bucket remain public by design.

Partner logos: optional `belt_image` is uploaded in Partneri and used only in the homepage belt, falling back to the main `image`. Footer always uses the main logo. Both support SVG and transparent compressed WebP; grey preview backing is CMS-only. Migration `20261022123550_partner_belt_logo_field.sql` applied.
