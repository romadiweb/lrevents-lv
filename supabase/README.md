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

Published partners feed the clickable homepage sponsor strip and footer. Team records feed Kontakti. Articles feed the homepage, category archive and detail pages. Events feed homepage cards/countdown, calendar, upcoming/archive lists, and detail pages with participant text and linked documents. Dates/times use Europe/Riga. Association address and banking details remain in `lib/contacts.ts`.

Public content is cached for 60 seconds (five-minute maximum expiry). CMS saves invalidate content and public routes immediately. Connection/table failures retain the prior labelled local fixtures. Empty functioning CMS tables stay empty.

## Verification and maintenance

`npm run test:cms` runs the migration in embedded PostgreSQL: RLS, publication dates, profile protection, document visibility, atomic rollback, category constraints, upload ownership and deactivation.

`npm run test:cms:live` is an explicit live integration check. It creates labelled temporary records and a temporary user, tests protected endpoints, compression, publication, dynamic pages and links, then removes its records/media/user. It needs a running local app and the initial local credential file. After changing the owner's password, use a dedicated test account instead of the initial credential.

`scripts/bootstrap-cms-user.mjs` can rerun profile bootstrap without resetting an existing password. `scripts/cms-database.mjs --pooler --verify` uses the private machine-only connection file `~/.codex/private/lrevents-db.json`; runtime website operations never use the database password.

For password-recovery email links, configure Supabase Auth's Site URL and allowed redirects for the deployed origin and `http://localhost:3000/auth/callback`. Recovery uses PKCE and returns to `/auth/password`. Initial-password login works independently of email delivery configuration.

The connected Supabase MCP account still lacks management permission for this project, so its automated advisors were unavailable. Direct SQL inspection and public/authenticated API checks were used. Run dashboard Security/Performance Advisors after reconnecting that account.
