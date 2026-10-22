---
version: 1
slug: "gallery"
primary_target: "app/galerija/page.tsx"
related_targets: ["app/galerija/galerija.css", "components/gallery/gallery-grid.tsx", "components/home/gallery-section.tsx", "app/page.tsx", "lib/gallery.ts", "lib/cms/content.ts", "components/home/hero-section.tsx"]
---

# Gallery and homepage photo selection

Mode: Browse. A narrow extension of the established LR Events world.

## Direction contract

THESIS: Browse published motorsport photographs as square tiles, optionally narrow by category, then open a larger view without losing the selected tile.

OWN-WORLD: Inherit DESIGN.md: off-white canvas, Noir text, Cherry actions, near-square controls and selective dark photography. Preserve DESIGN.md and .impeccable/design.json; this work introduces no new visual system or durable token.

STORY: Optional titles and categories accompany photographs without leaving empty caption space. The homepage presents the first four published images in the same editorial order and links directly to /galerija.

FIRST VIEWPORT: A photographic header with breadcrumb, Galerija title and short introduction leads into a labeled category form, visible image count and square image grid.

FORM: An image library, with larger viewing in a modal dialog. Existing site photography supplies the availability fallback; no new raster assets are introduced.

## Layout and content

- The desktop grid has four columns, three at 1150px and below, two at 900px and below, and one at 540px and below. Tiles retain a 1:1 crop with object-fit cover; the dialog uses object-fit contain to show the full photograph.
- Captions render only supplied title/category values. The image description supplies the accessible name when the title is absent.
- Category selection submits a GET form to /galerija using the kategorija query parameter. Only categories represented in the published gallery, plus the selected category, appear. Invalid categories resolve to the unfiltered view; a clear-filter link returns to the full library.
- An empty library explains that photographs appear after publication. An empty category offers the full gallery. Loading has a status message; failed library/dialog images have a named fallback.
- CMS content is filtered to published records and sorted by ascending sort_order, descending created_at, then ascending id. An unavailable gallery read uses the four existing local fallback photographs; an available but empty table remains empty.
- The homepage takes the first four images from that feed and loops every six seconds. Previous, next and pause/resume controls appear with multiple images; one image remains static and an empty feed hides the section. The CTA opens /galerija internally.
- The homepage hero's no-upcoming-event state links to /pasakumi/arhivs. This is a local destination correction, without changing the hero's established composition.

## Interaction and accessibility

- Each full tile is a named button with dialog semantics; its image-opening affordance appears on hover/focus and remains visible on narrow screens. Light-surface keyboard focus is Cherry; dialog focus is white.
- The Radix modal provides dialog labeling, focus containment and Escape dismissal. Closing restores focus to the tile that opened it. Left/Right arrows and named previous/next buttons cycle through the current filtered collection, wrapping at the ends; navigation controls are omitted for a single image.
- The dialog exposes a title (title or image-description fallback), optional category and image position. The close control is named. Decorative icons are hidden where implemented.
- Grid zoom and affordance transitions are disabled under reduced motion. The homepage provides an explicit pause control and exposes slide changes politely when paused; autoplay is not announced continuously.

## Evidence and limits

Source checked: PRODUCT.md, DESIGN.md, gallery route/CSS, GalleryGrid, homepage GallerySection and feed slicing, HeroSection, lib/gallery.ts and CMS content/config/editor/validation. Finish review disposition supplied by the reviewer: **ship**, no material fixes. This documentation pass checked source behavior and did not repeat browser, CMS or database testing; the parent task owns those results.

Existing italic interior headings and the root design-document format are retained as incumbent drift. No drift repair, global design refresh, application edits or new raster generation are part of this documentation pass.
