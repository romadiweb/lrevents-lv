# Car brand logos

39 compressed PNG logos for a practical starter selection of makes seen in Latvian amateur motorsport and road cars. Add further makes as needed; this is a curated selection, not a complete manufacturer list.

Source: https://github.com/filippofilip95/car-logos-dataset/tree/bb2d661f28ce617dba8a51bdfc2069a3381a23b0

The upstream README describes its dataset as MIT licensed, but the referenced LICENSE file is absent at this revision. Manufacturer logos remain the property of their respective owners and are subject to their own terms. Original image sources and pinned download URLs are recorded per logo in `catalog.json`.

Assets are trimmed, resized to at most 320 × 320 (without upscaling), and compressed as palette PNGs. To refresh or extend: edit the selection in `scripts/download-car-logos.mjs`, then run `node scripts/download-car-logos.mjs` from the repository root. Sharp is supplied by the existing Next.js installation.

`lib/car-brands.ts` exports the catalog for a future CMS dropdown. Persist its stable `id` as the team's `carBrand`; display names and file paths come from the catalog. Add new ids to `CarBrandId` when extending the selection. Missing/unknown makes omit the decorative watermark. No CMS editor or database changes are included here.

The homepage's BMW, Audi, and Volkswagen assignments are illustrative mock values, not verified facts about the teams.
