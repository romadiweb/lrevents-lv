---
version: "1.0"
name: "LR Events"
website: "https://lrevents.lv"
description: >
  Off-white-first premium Latvian motorsport and events design system. Crisp off-white
  editorial pages, Noir typography, deliberate Cherry red interactions,
  cinematic photography on selective dark feature bands, and functional
  event calendars, registration, results, and document interfaces.
stack:
  framework: "Next.js App Router"
  language: "TypeScript"
  styling: "Tailwind CSS v4"
  components: "shadcn/ui"
  icons: "lucide-react"
  animation: "motion (only where meaningful)"
  font: "Inter or Geist Sans; use locally hosted font files through next/font"
source_inspiration: "Ferrari DESIGN.md editorial and sharp-geometry principles, deliberately adapted to a light-first original LR Events identity"
---

# LR Events — Final Design System

## 1. North star

**Premium motorsport editorial meets effortless event utility.** This is an event organizer's website, not a Ferrari copy, not an online store and not a SaaS dashboard. Make visitors feel the atmosphere of racing while helping them immediately find **upcoming events, dates, registration, regulations, locations and results**.

The defining visual contrast is **clean off-white editorial pages and occasional dramatic dark motorsport moments**. Photography carries excitement; the rest of the UI stays readable, controlled and quiet.

### Hard rules

1. **Clean off-white by default.** Global body background is `#FAFAF8` (near-neutral off-white). `#FFFFFF` is used for cards, forms and selected sections. Do not use beige, cream, ivory, Cotton or sand as page backgrounds. Target approximately 75–85% light surfaces across typical content pages.
2. **Dark is intentional.** Use `#181717` Noir for footer, image-led cinematic hero treatments, selected feature/CTA bands, and optional photo overlays. Avoid alternating dark/light on every section merely for decoration.
3. **Red is intentional and interactive.** `#810100` Cherry is the main action color for primary CTA, hover/focus/selected states, directional arrows, thin rules and important links. Maroon and Burgundy are supporting accents, never three competing reds in the same view.
4. **Near-square geometry.** Buttons and editorial cards use 0–4px radius. Do not use SaaS-style floating pill buttons, oversized card rounding, or glassmorphism everywhere.
5. **Content is the interface.** Event details, dates and registration must remain legible and discoverable on mobile.
6. **Use original LR Events identity.** No Ferrari logos, Cavallino imagery, FerrariSans, proprietary photography or Ferrari terminology in the shipped product.

## 2. Color tokens

### Brand palette (provided)

| Token | Hex | Role |
| --- | --- | --- |
| `off-white` | `#FAFAF8` | **Default page canvas**, clean subtle warmth without beige tint |
| `white` | `#FFFFFF` | Cards, navigation dropdowns, forms and occasional white sections |
| `sand` | `#B5AC8A` | Legacy brand reference only; **do not use for backgrounds, hovers, navigation, borders or UI accents** |
| `cherry` | `#810100` | **Primary brand action** on light surfaces |
| `maroon` | `#630000` | Darker red, hover/pressed and subtle depth |
| `burgundy` | `#6D001A` | Secondary editorial color, very sparingly |
| `noir` | `#181717` | Main text, dark cinematic surface and footer |

### Derived functional tokens

These **derived** colors are allowed solely to build usable interfaces, contrasts and states. They are not additional brand accents.

| Token | Value | Usage |
| --- | --- | --- |
| `surface` | `#FFFFFF` | Clean light cards and elevated surfaces |
| `surface-white` | `#FFFFFF` | Inputs, data surfaces, printable documents |
| `surface-subtle` | `#F3F3F1` | Neutral alternate light band, not beige |
| `border` | `#E2E2DF` | Neutral hairlines, input borders, separators |
| `text` | `#181717` | Main text on light |
| `text-muted` | `#5A5A58` | Supporting text on light |
| `text-inverse` | `#FFFFFF` | Large/body text on Noir |
| `text-inverse-muted` | `#C5C5C5` | Supporting text on Noir |
| `border-dark` | `#48413F` | Borders on Noir |
| `focus` | `#810100` | Visible keyboard focus on light backgrounds |
| `focus-dark` | `#FFFFFF` | Visible keyboard focus on dark |
| `error` | `#A12222` | Validation errors (functional only) |
| `success` | `#246743` | Success / confirmed (functional only) |
| `warning` | `#825000` | Warning (functional only) |

### Color usage — mandatory interaction rules

- **Site chrome and content:** `#FAFAF8` base, Noir text, white surfaces, clean neutral borders. The page must visually read as white/off-white, **never cream or beige**.
- **Header:** Noir `#181717` with white text is the preferred desktop header; a discreet white/off-white microbar is optional. Dropdown panels use white with Noir text, Cherry active/hover indicators. The navigation must not visually merge into a beige page.
- **Primary button:** Cherry `#810100`, white text; hover Maroon `#630000`; active Burgundy `#6D001A` or Maroon; accessible focus outline. Do not use off-white, Cotton or Sand as the *hover accent*.
- **Text links and arrows:** default Noir; hover Cherry `#810100`. Underline/arrow may animate subtly. Active navigation uses Cherry via text and/or a 2px underline; keep selected state identifiable beyond color alone.
- **Secondary/outline buttons:** default white/transparent, Noir text and neutral/Noir border; hover Cherry border + Cherry text on white, or Cherry fill + white text when intentionally emphasized. Never beige fill on hover.
- **Clickable cards, event rows and quick links:** default neutral/white; on hover use Cherry for title/arrow/left rule or thin underline, with *at most* a subtle neutral background `#F3F3F1`. Never switch the entire card to Cotton, khaki or cream. Focus-visible provides an equally clear indication.
- **Dropdown/menu item hover:** subtle neutral `#F3F3F1` surface is allowed, but text/icon/active marker must become Cherry. No khaki or off-white as the sole feedback.
- **Dark featured band:** Noir `#181717`, white text, red accent for intentional actions; validate all contrast. Use white-outline secondary controls where needed.
- **Maroon/Burgundy:** deeper brand reds for pressed states and occasional editorial emphasis, never as competing primary hover colors throughout a page.
- **Sand `#B5AC8A` and Cotton `#EDEBDD`:** deprecated as active UI colors. Keep only as historical brand references if required by stakeholders, and do not use them in generated Tailwind/shadcn component styles.
- **Red-filled large sections:** rare. Use motorsport photography for drama, not random burgundy gradients or oversized red blocks.

### Surface rhythm

A representative homepage sequence:

1. Confident hero on off-white **with compelling racing imagery** or a photo-led cinematic treatment. Don't create a huge blank off-white hero with only a headline.
2. Next event and quick visitor pathways on clean off-white with thin neutral borders and Cherry hover accents.
3. Upcoming events on white / `#FAFAF8` with strong dates and clear CTAs.
4. One dramatic photographic feature on Noir.
5. About / expertise on white or off-white with genuine photography.
6. Results and participant information on off-white with purposeful red interactive accents.
7. Noir closing CTA + footer.

Other pages (calendar, event detail, registration, results, documents) stay **mostly white/off-white** with red interaction states.

## 3. Typography

Use **Inter** or **Geist Sans** (choose one, consistently). FerrariSans is not an LR Events asset. Variable font preferred via `next/font`. Avoid decorative racing fonts, italicizing every heading or condensed illegible navigation.

| Role | Desktop | Mobile | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| `hero` | `clamp(3.5rem, 7vw, 6rem)` | `clamp(2.5rem, 9vw, 3.75rem)` | 500–600 | 0.98–1.05 | -0.035em |
| `page-title` | `clamp(2.75rem, 5vw, 4.5rem)` | `clamp(2.25rem, 7vw, 3rem)` | 500–600 | 1.05 | -0.03em |
| `section-title` | `clamp(2rem, 3.4vw, 3.5rem)` | `clamp(1.75rem, 6vw, 2.5rem)` | 500–600 | 1.1 | -0.025em |
| `card-title` | 22–28px | 20–24px | 550–600 | 1.2 | -0.015em |
| `body` | 16–18px | 16px | 400 | 1.55–1.7 | normal |
| `body-small` | 14px | 14px | 400 | 1.5 | normal |
| `label` | 11–12px | 11–12px | 600 | 1.3 | +0.08em uppercase |
| `button/nav` | 12–14px | 12–14px | 600 | 1.2 | +0.045–0.08em |
| `event-date` | 28–44px | 26–36px | 550–600 | 1.0 | -0.025em |

Rules:
- Prefer **sentence case** for body and general headings; use uppercase thoughtfully for hero emphasis, small labels, eyebrow text, nav and CTAs.
- Maximum paragraph reading width: around 65–75 characters.
- Latvian diacritics must display correctly in every chosen font and all UI text.
- Dates, times and numbers must have strong visual hierarchy. Use `font-variant-numeric: tabular-nums` in results and calendars.
- Never put long blocks of small text on photographs.

### Screenshot-driven design correction

The prior hero implementation had a large featureless beige area, text-only headline, and beige hover treatments. **Do not reproduce that composition.** A minimal editorial hero still requires a strong art-directed visual (real motorsport photograph, asymmetrical image panel, or tight crop that creates visual tension) and balanced vertical rhythm. Use hierarchy and imagery, not massive unoccupied off-white space. Keep the quick-link trio functional and add subtle red hover underline, arrow motion or rule accents. Avoid giant blank areas above or below calls to action.

## 4. Spacing and grid

Follow the Ferrari reference's disciplined token ladder, but apply it to readable **clean light editorial content**.

```
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-32: 128px;
```

- Maximum content width: **1280px**, centered. Text containers narrower where sensible.
- Desktop gutters: 48–64px; tablet: 32px; mobile: 20–24px.
- Desktop standard section vertical padding: 96–120px; mobile: 56–72px. Dense data sections use less.
- 12-column desktop grid; 6-column tablet; 4-column mobile or flexible CSS grid.
- Hero images may be full bleed. Functional content should align to the same site grid.
- Event list rows use 16–24px internal vertical padding, clear boundaries, and predictable alignment.

## 5. Geometry, borders and depth

- Standard button radius: **2px** (allow 0px for editorial hero buttons).
- Event cards: **2–4px**; no rounded 24px floating dashboard tiles.
- Inputs: **4px**.
- Dialogs/mobile drawer: **6–8px** where ergonomically helpful.
- Tags: **2px**; small pill badge is permitted but not the default.
- Borders: 1px `border` on light, `border-dark` on dark.
- Prefer hairlines, image crops and subtle tonal difference over shadows. If needed: `0 8px 24px rgb(24 23 23 / 6%)`, restrained.
- Avoid excessive borders around every element; avoid thick decorative drop shadows.

## 6. Imagery and art direction

- Use **real, rights-cleared LR Events motorsport photography**: race action, track details, people, paddocks and event atmosphere. Never source Ferrari-branded photos merely to imitate the reference.
- Hero: striking photograph with legible overlay at the actual breakpoint. Use controlled dark gradient **over the photograph only where required for contrast**.
- Alternate wide full-bleed imagery with carefully cropped editorial photos within the light grid.
- Motion and speed should be communicated through strong compositions, diagonals within images and high-quality event imagery — not fake HUD graphics or excessive visual effects.
- Use `next/image`, appropriate `sizes`, dimensioned images and responsive art direction. Do not defer loading the primary LCP hero unnecessarily.
- Always provide alt text for informative photos; use empty alt for purely decorative media.
- Avoid rasterizing text into photos.

## 7. Navigation

### Desktop

- Height approximately **76–84px**. LR Events logo left; primary destinations aligned cleanly; one conspicuous event/registration CTA where appropriate.
- Suggested navigation: **Pasākumi · Rezultāti · Dalībniekiem · Par mums · Kontakti**. Only add labels when actual content supports them.
- Logo and menu remain readable on the preferred Noir header with white text. Hero overlay can initially use a separate high-contrast dark variant.
- Dropdowns use accessible shadcn navigation primitives, not hover-only interactions.
- Sticky navigation may compact subtly on scroll, but avoid disruptive jumps and oversized glassmorphism.

### Mobile

- **Real hamburger menu**, visible and comfortably tappable, target >=44×44px.
- Use shadcn `Sheet` or accessible `Dialog` for mobile drawer: keyboard operable, focus trapping, escape-to-close, body scroll lock, proper labels.
- Display primary page links clearly, then secondary items. No crowded desktop-style nav squeezed onto mobile.
- Keep event registration/action discoverable inside mobile drawer and on event detail pages.

## 8. Components: shadcn/ui adapted to LR Events

Install only needed components. shadcn provides accessible **starting source code**, not the look itself; override its default radius, colors, shadows, and interactive states using the tokens in this file.

| Component | Appearance / behavior |
| --- | --- |
| `Button` | Cherry filled primary, 48px height minimum; outlines in Noir on light; text/icon variants; clear hover, active, focus, disabled, loading |
| `NavigationMenu` | Lean desktop navigation, clean dropdowns, no oversized mega menu by default |
| `Sheet` | Mobile navigation drawer with accessible close and clear hierarchy |
| `Card` | Flat, near-square, light surface; event image and editorial typography |
| `Badge` | Small restrained status/date/category; not dozens of saturated pills |
| `Tabs` | Clear filter state for upcoming/past events and results, accessible keyboard navigation |
| `Accordion` | Regulations, FAQ and document categories |
| `Select` / `Popover` | Event class, year and type filters, full keyboard support |
| `Input` / `Textarea` / `Checkbox` | High contrast on light; 48px practical controls; visible error messages |
| `Dialog` | Registration or confirmation only when a full page isn't more suitable |
| `Table` | Results with legible columns and horizontal scroll on narrow devices |
| `Separator` | Fine light or dark rules; no gratuitous decoration |
| `Skeleton` | Low-contrast light placeholders; respect reduced motion |
| `Toast` / `Sonner` | Action feedback: submitted, saved, failed, retry |

### Buttons

**Primary light:** `background: #810100`, text `#FFFFFF`, hover `#630000`, disabled visibly distinct, 48px tall, 2px radius. Standard label can be sentence-case or compact uppercase with measured tracking. Do not force every CTA onto a dramatic red block.

**Secondary light:** white/transparent surface with 1px Noir border and Noir text; hover Cherry border/text (or Cherry fill with white text). Do not use cream/beige hover fills.

**On dark:** white or light-outline CTA as needed to preserve visual contrast. Check against the actual imagery and overlay.

### Event card

- Lead with image when media is available; never let card height depend unpredictably on varied aspect ratios.
- Date first or clearly visible, then event name, venue, event type/status and primary action.
- Entire card can be an accessible link if it does not contain conflicting nested actions.
- Clearly distinguish **Pieteikties**, **Informācija**, and **Rezultāti** based on event state.
- Don't invent missing venues, start times, regulations or outcomes. Show clear fallbacks.

### Event calendar/list row

- Desktop structure: date column | event name + venue | status/type | action/arrow.
- Mobile: stacked date, title, venue/status, full-width or clearly separated action.
- Controls for upcoming/past and optionally type/year. Make empty states useful.
- Long events lists must be scannable without oversized repeating photo cards.

### Event detail

- Breadcrumb; prominent title/date/location; optional event photo; status and clear **Register / Pieteikties** action.
- Sections: overview, program, documents/regulations, location/map link, registration, results (when available).
- Sticky registration affordance on mobile only when it doesn't obscure content or consent UI.
- Give downloadable PDFs file type and ideally size; expose valid external registration/results destinations.

### Results

- Emphasize speed and utility: search/filter by event, year and class where data allows; tables with readable headings and tabular numbers.
- Don't replace data tables with overly stylized racing graphics.
- Empty, loading, unavailable and corrected-results states must be designed.

### Forms

- Explicit labels, clear required fields, descriptive error text, safe submission states, confirmation screen, and privacy/consent content where appropriate.
- No placeholder-only labels. Browser autocomplete and mobile-appropriate keyboard types.
- Never imply an application succeeded before the server confirms it.

## 9. Page templates

### Homepage

1. **Hero:** cinematic motorsport imagery, concise original Latvian headline, obvious primary route to events, optional secondary organizer/about route.
2. **Next event:** immediately visible event detail strip or feature card with date, venue and action.
3. **Upcoming events:** editorial calendar rows/cards on off-white or white; concise discovery actions.
4. **Featured story / photo band:** one immersive racing image or meaningful event recap.
5. **About LR Events:** concise organizer credentials and what the company does, with supporting media.
6. **Results / participants:** two clear pathways to practical data and registration information.
7. **Partners** if supplied by project content.
8. **Closing CTA and footer:** restrained Noir finish.

### Events index

Off-white canvas, page title, filters, clearly grouped upcoming and past events, responsive event rows/cards. Avoid huge full-screen hero when a visitor needs dates fast.

### Event detail

Mostly white/off-white. Strong title/date/location header, optional one photo-led feature, then readable light tabs/sections, regulations and clear registration route.

### Results / documents

Very light, utilitarian and accessible. Dense information may use white/surface cards and dividers; keep hover and filter feedback obvious using Cherry, not beige.

### About / services

Editorial text and documentary images, selective darker photography bands; proof and substance over generic slogans.

### Contact

Readable contact information, appropriate action links, lean form only when required.

## 10. Interaction and motion

- Use **Motion** selectively: hero text reveal, menu transition, card image zoom (1.02–1.04), section entrance (small rise/fade).
- Fast UI affordances ~150–220ms; page/section entrance ~300–500ms. Use easing rather than bouncy springs for editorial actions.
- No scroll hijacking, custom cursor needed for basic navigation, perpetual animated backgrounds, aggressive carousels, or parallax that harms readability.
- `prefers-reduced-motion: reduce` must disable nonessential animation and smooth scrolling.
- Hover is supplemental: never hide core content or actions until hovered.
- Touch screens must have equal functionality.

## 11. Responsive and accessibility contract

- Mobile-first implementation; test at **320, 375, 390, 768, 1024, 1440px** and wide desktop.
- Breakpoints consistent with Tailwind defaults unless specific component behavior demands otherwise.
- Contrast: body copy >=4.5:1 and large text >=3:1 under WCAG AA; **validate** brand-button pairs and photograph overlays with a contrast tool. If any selected brand pairing fails, use the permitted functional neutral text/surface variant rather than forcing brand purity.
- Keyboard-accessible navigation, filters, tabs, dialogs and forms; visually obvious `:focus-visible`.
- Landmarks, single logical `h1`, semantic headings, accessible link names, consistent skip-to-content.
- Practical tap targets at least 44×44px; avoid horizontal page overflow. Data tables may have dedicated scroll containers with cues.
- Layouts must accommodate Latvian longer words and text expansions.
- Accessible status messages, image alt text and meaningful form validation.

## 12. Technical implementation

### Stack

- Next.js App Router + TypeScript.
- Tailwind CSS v4 with centralized CSS variables for all colors, type scales and radii.
- shadcn/ui components copied into project and restyled; Lucide icons with consistent 1.5–2px stroke.
- Motion only where justified. Avoid heavy dependencies for trivial hover interactions.
- `next/font` for chosen font, `next/image` for photos, semantic HTML first.
- Supabase **only if needed** for internally managed events, registrations, results or admin. Do not assume all data lives there.

### Starter CLI

```bash
npx create-next-app@latest lrevents
cd lrevents
npx shadcn@latest init
npx shadcn@latest add button card badge sheet dialog navigation-menu tabs accordion separator input textarea select checkbox table skeleton
```

Use `npx` with npm; `pnpm dlx` with pnpm.

### CSS foundation (Tailwind v4-compatible application tokens)

```css
:root {
  --background: #FAFAF8;
  --foreground: #181717;
  --card: #FFFFFF;
  --card-foreground: #181717;
  --popover: #FFFFFF;
  --popover-foreground: #181717;
  --primary: #810100;
  --primary-foreground: #FFFFFF;
  --secondary: #F3F3F1;
  --secondary-foreground: #181717;
  --muted: #F3F3F1;
  --muted-foreground: #5A5A58;
  --accent: #810100;
  --accent-foreground: #FFFFFF;
  --destructive: #A12222;
  --border: #E2E2DF;
  --input: #E2E2DF;
  --ring: #810100;
  --radius: 0.25rem;
  --lr-off-white: #FAFAF8;
  --lr-white: #FFFFFF;
  --lr-neutral-hover: #F3F3F1;
  --lr-cherry: #810100;
  --lr-maroon: #630000;
  --lr-burgundy: #6D001A;
  --lr-noir: #181717;
  --lr-surface: #FFFFFF;
  --lr-dark-border: #48413F;
}
```

Preserve the shadcn setup-generated Tailwind theme mapping (`@theme inline`) and base-layer rules; this is the **token value foundation**, not a replacement for the entire generated `globals.css`. Use matching light/dark scoped component variants rather than making `.dark` the global default.

### Project structure (suggested)

```
src/
  app/
    (site)/
      page.tsx
      pasakumi/page.tsx
      pasakumi/[slug]/page.tsx
      rezultati/page.tsx
      dalibniekiem/page.tsx
      par-mums/page.tsx
      kontakti/page.tsx
    globals.css
    layout.tsx
  components/
    ui/                 # installed shadcn sources
    layout/             # header, mobile-nav, footer, container
    events/             # event-card, event-row, date-block, filters
    sections/           # hero, next-event, event-list, about
  lib/
    data/               # eventual CMS/API adapters
    utils.ts
  types/
    event.ts
public/
  images/
```

Keep the content model independent from visual components so CMS, database or external event feeds can be introduced later.

## 13. SEO, performance and content

- Primary UI language: **Latvian**; only add languages if actually required.
- Unique page titles/meta descriptions; descriptive slugs, canonical URLs and social previews.
- Appropriate schema.org `Event` structured data **only from verified event facts**.
- Fast LCP and CLS: size images, preload only critical fonts/media, serve responsive images, keep client JavaScript minimal.
- Prefer server components for read-only content; client components only for truly interactive controls.
- Event details should expose usable HTML text, not only image posters or PDF attachments.
- No invented event dates, times, sponsors, awards, racing categories or statistics.

## 14. Acceptance checklist for any new page

- [ ] Is the default background clean `#FAFAF8` with white surfaces and **no beige/cream tint**?
- [ ] Do all interactive hover/active states use Cherry/Maroon or a subtle neutral surface with a Cherry text/icon indicator (never Cotton/Sand as accent)?
- [ ] Can a first-time user immediately identify what they can do on the page?
- [ ] Are date, location and main event action easy to spot?
- [ ] Is Cherry reserved for meaningful emphasis rather than filling every block?
- [ ] Are typography, geometry, spacing and grid consistent with this file?
- [ ] Does mobile navigation function accessibly and visibly?
- [ ] Are contrast, focus, keyboard and reduced-motion states covered?
- [ ] Are image rights, crop, alt text and loading behavior handled?
- [ ] Are missing, loading, empty and error states designed?
- [ ] Is the content authentic to LR Events, without Ferrari branding or invented details?

## 15. Anti-patterns — do not generate

- Entirely black websites with endless alternating dark cards.
- Ferrari red (`#da291c`), Ferrari fonts, Ferrari marks, generic Formula 1 labels or borrowed Ferrari promotional imagery.
- Cotton `#EDEBDD`, sand `#B5AC8A`, beige or yellowish cream used as page backgrounds or hover colors. Prefer clean off-white `#FAFAF8` and white `#FFFFFF`.
- Burgundy, Maroon and Cherry all competing in one hero.
- Neon gradients, dashboard HUD decorations, cyberpunk motifs or tire-track textures covering every page.
- Default shadcn slate colors left in place, round 16px+ cards, violet focus rings or generic dashboard layout.
- Scroll-jacking, large looping motion, overbearing loaders or hidden hover-dependent actions.
- Content dense enough to feel administrative on the homepage, or visually dramatic enough to hide essential event details.

## 16. AI implementation instruction

> Build **LR Events**, a light-first premium motorsport event website. Read and follow this `DESIGN.md` before writing any components. The global background is clean off-white `#FAFAF8` (NOT Cotton/beige); cards are white `#FFFFFF`; text is Noir `#181717`; all purposeful hover/selected accents are Cherry `#810100` (pressed `#630000`). Never use Cotton or Sand for hover.  Create a distinct LR Events identity, not a Ferrari clone. Preserve cinematic racing imagery for the homepage hero and selected feature moments, while keeping most information-heavy sections on clean light surfaces. Use Next.js App Router, Tailwind v4 and customized shadcn/ui components; prioritize responsive navigation, events, registration and results. Follow accessibility, performance, and typography guidance from the design system. Do not invent site content.
