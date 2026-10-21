# Supabase content integration

Project: `kvugvrxyqfaytgmmfdfx`. Credentials are in ignored `.env.local`. Never place the secret key in a `NEXT_PUBLIC_` variable, client component, repository or response.

## Status

The Data API accepts the server secret key. The Codex project MCP server is registered and OAuth sign-in succeeded. The existing app connector does not have permission for this project. Reload the Codex session to load the newly authorized MCP tools.

`contact-content-setup.sql` is a pending setup script, **not an applied migration**. First inspect existing tables through the newly authenticated MCP, then apply this script if `public.site_content` does not already exist. Check RLS/advisors and query the seeded row before considering database setup complete.

## Editing contact content

The contact page reads `public.site_content`, row `slug = contacts`, using the publishable key and public SELECT policy. Edit its `content` JSON using Supabase Table Editor or trusted MCP. Data must keep the structure shown in the seed: associationName, introduction, email, associationDetails (label/value pairs), and team (name/role/email).

Public and signed-in website visitors have SELECT only; no website edit API is exposed. A future admin screen needs authenticated authorization before writes. The server-only admin helper is reserved for trusted jobs and is not used for public page reads.

Content is cached for 60 seconds with a five-minute maximum expiry; open/refresh the page after that interval to see edits. Missing configuration, missing tables, invalid JSON or network failures use `lib/contacts.ts` and default contact copy with a server warning. Published contact fields are public by design. Footer details remain separate pending a shared site-settings model.

Verify: query the contacts row with publishable credentials, verify an anonymous update is denied, and open `/kontakti`. Keep a private deployment environment configured with the same variable names as the example file.
