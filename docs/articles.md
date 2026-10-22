# Articles

`lib/articles.ts` owns the temporary article source, `Article` model, category catalog, link builder, and pagination rules. All current entries and publication dates are explicitly illustrative. Existing project photographs are reused, not representations of verified events associated with the sample copy.

The archive route `/raksti` reads `kategorija` and `lapa` from the URL on the server, inside Suspense for Next.js Cache Components. The category form uses GET and resets pagination. Refreshing, sharing, browser Back/Forward, and direct links preserve the archive state. Only category filtering is included, as requested.

Examples: `/raksti?kategorija=aizkulises` opens the first page of that category; `/raksti?lapa=2` opens the second page of all articles. Pagination retains a selected category. There is no year or race filter. Unknown categories fall back to all articles. Normalization determines the rendered state without redirecting or rewriting the incoming URL.

Within the selected category, articles are sorted newest first. The first seven records are reserved for the featured story and six square tiles on page one. The remainder are paginated in batches of five. Page two and beyond render list rows only, without repeating the seven visual stories. Fewer than seven records simply render the available feature/tiles. Missing and invalid page values normalize safely; pages beyond the end clamp to the last page. Pagination links retain the category, use bounded page-number controls, and identify the current page.

`/raksti/[slug]` supplies working sample reading destinations using the article `id` as the slug. Unknown slugs return 404. Sample detail pages are marked noindex. Each detail page links to its category archive, all articles, and up to two other stories in the same category. The homepage uses the same article records and links to the archive and story routes.

For CMS integration, replace `articles` with published records matching `Article`, obtain categories from the CMS, and remove demo notes/noindex only when real content is supplied. For a large collection, perform category filtering, date sorting, count, and row slicing at the data source rather than loading the entire archive. No CMS editor, storage, or database schema is added in this change.

## Visual system and completion evidence

The archive extends the existing off-white, Noir, Cherry, and Geist system. It reuses the shared container, neutral rules, sharp geometry, and global focus/reduced-motion behavior. The split feature, square tiles, and compact rows are local archive composition choices, not new global tokens or templates. Existing project photographs supply all imagery; no shipping raster was added. The surface direction and provenance remain in `.impeccable/surfaces/app-raksti-page-tsx.md`.

The finish review validated `.impeccable/review/desktop.png`, `mobile.png`, `page-2.png`, and `article.png`, with disposition **ship** and no material findings. The final production build, lint, and `git diff --check` passed. Browser navigation to a reading route produced no new warning or error logs. This records the implementation and finish-review verification rather than an additional review pass.

Pre-existing system drift: shared `.site-content-page` rules italicize headings across interior pages, including Raksti, while `DESIGN.md` cautions against italicizing every heading. This extension follows the incumbent implementation; it does not redefine the design system or resolve that existing difference.
