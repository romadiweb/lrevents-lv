# Scroll-to-top control

The supplied ignition WebP is stored at `public/images/scroll-to-top-ignition.webp`. The supplied component was merged into the existing `components/layout/scroll-to-top.tsx`, already mounted once in the root layout, so route scroll restoration and membership hash navigation keep working.

The supplied CSS module was adapted to the project's existing global CSS pipeline as `components/layout/scroll-to-top.css`, with namespaced selectors. Importing it as a module through the custom CSS loader produced undefined class exports; no framework/configuration change was needed.

The control appears after 500 pixels of scroll (configurable with `threshold`), measures 64 pixels on desktop and 56 pixels on mobile, and sits below dialog overlays. Hidden controls leave the tab order. The button uses smooth scrolling unless reduced motion is requested, in which case it scrolls instantly. It keeps the supplied artwork and safe-area offsets. Hover and press use a Cherry outline; scaling and image filters were removed because they softened the raster artwork on hover. The image stays at the same size with a static button shadow.

Verification: desktop appearance, image loading, return to zero and subsequent hiding, mobile dimensions/action, and the membership-form anchor regression check. TypeScript, lint, production build, whitespace, and the scoped design detector passed.
