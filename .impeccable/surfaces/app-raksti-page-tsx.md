---
version: 1
slug: "app-raksti-page-tsx"
primary_target: "app/raksti/page.tsx"
related_targets: ["app/raksti/raksti.css"]
---

# Raksti archive

Mode: Read. An extension of the established LR Events website, with the user's attached archive reference fixing the composition.

## Direction contract

THESIS: Move from an image-led current-news selection into a compact chronological archive. Large images appear on the first page only.

OWN-WORLD: Inherit DESIGN.md: off-white canvas, Noir text, Cherry featured panel and rules, Geist typography, sharp editorial geometry, existing motorsport photographs.

STORY: Readers browse the newest story, scan six square image tiles, then use five-row archive pages. Categories narrow the feed; neither race nor year filtering appears. Every story has a readable destination.

FIRST VIEWPORT: Compact breadcrumb and Raksti heading, category control, then a broad split feature with a Cherry text panel on the left and a large photograph on the right. The image grid follows immediately.

FORM: User-specified archive composition, adapted directly from the supplied reference; no seed or alternate concept round applies. Pagination and category live in the URL. Demonstration articles are clearly labeled and isolated from presentation for later CMS replacement.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Article reading width extension

The article detail text column (`.news-detail-body` in app/raksti/raksti.css) now has a 900px maximum width, centered with a 40px top margin. The surrounding responsive container continues to limit its width on smaller screens. This is the user's requested desktop reading-width adjustment; archive composition, typography and the established design system remain as documented. Source checked directly; browser validation belongs to the parent task.

## Content provenance

Use existing photographs under public/images, already present in the project before this change. No new photographs or generated raster assets. Titles and copy are illustrative mock content, not verified reports of events.

## Completion evidence

Finish review disposition: **ship**, no material findings. Validated captures: `.impeccable/review/desktop.png`, `mobile.png`, `page-2.png`, and `article.png`. Final production build, lint, and `git diff --check` passed; reading-route browser navigation produced no new warning or error logs. `docs/articles.md` records the implemented URL, pagination, detail, and CMS replacement model. `DESIGN.md` and the existing system artifacts are preserved; this is an ordinary extension with no new durable token or visual world. Shared italic interior headings are incumbent implementation drift from the written typography caution, not a new archive-wide or system-wide rule.
