## Context

See proposal.md. Pages are full document loads. `css/global.css` is a render-blocking Head stylesheet. Page scripts are Footer tags, so the first paint can beat `hydrateThumbs` and `hydrateMerchThumbs`.

Published DOM, confirmed on `rad-shop.webflow.io`:

```
body > .page-wrapper
  .drawer-wrapper          <- before .navbar and .main-wrapper
  .navbar
  main.main-wrapper
    /        .hero-collection > .hero-collection-list > .hero-collection-item
                 > section.collection-hero-logo
                 > .collection-hero-gallery
    /shop    section.section_content > .max-width-full > .products-collection
                 > .product-list  (+ .product-list.is-clone, added by shop.js)
  footer.second-menu
```

`.main-wrapper` is the only child chain on `/`, which is why excluding every ancestor of the logo left nothing to move. Drawer dim already fades `.main-wrapper` opacity over 0.45s.

## Goals / Non-Goals

**Goals:**

- One site-wide sink and rise at `1.25rem` over 0.45s.
- On `/`, move the logo's siblings, never its ancestors.
- Keep an open drawer painted for the whole leave.
- Reuse the same distance and duration for the `/shop` view switch.

**Non-Goals:**

- Waiting on `hydrateVariants` or hero texture decode.
- A client-side router or a new dependency.
- Moving navbar, second menu, footer, or `.collection-hero-logo`.
- Changing drawer dim timing.

## Decisions

### Hide in Head CSS, reveal from `global.js`

The rising element starts at `opacity: 0` and `translateY(1.25rem)`. `html.is-ready` sets `opacity: 1` and `transform: none` over 0.45s. The hide is in the blocking stylesheet, so the broken grid is never painted. `revealPage` adds `is-ready` on the next frame so the transition has a from-state.

Layout scripts call `radPageReady`. Pages with no `.product-list .product-thumb` and no `.collection-hero-gallery` reveal on `DOMContentLoaded`. A 2s timeout reveals if a layout script never calls.

### Enter and leave share one selector

```
.main-wrapper:not(:has(.collection-hero-logo)),
:has(> .collection-hero-logo) > :not(.collection-hero-logo)
```

`html.is-ready` rises that set. `html.is-leaving` sinks it. The logo is not in the set, so it stays. The drawer is not in the set, so an open drawer stays while the content sinks underneath.

`radLeaveTo` adds `is-leaving`, prefetches the next document, then assigns after `PAGE_LEAVE_MS` (450) plus `PAGE_HOLD_MS` (350). `prefers-reduced-motion: reduce` assigns immediately.

### View switch is a class sequence

`setView` adds `is-leaving` to `.products-collection`, waits for the opacity `transitionend` with a timeout fallback, then does the existing work (toggle `is-gallery`, sync buttons, jump to top, `measureLoopHeight`, `onGalleryScroll`), then removes `is-leaving`.

`.products-collection` wraps both the list and the clone, so one element covers both.

### Reduced motion

No translate on the enter target. The existing `transition-duration: 0s` list includes the enter selector and `.products-collection`, and `setView` skips the wait so the view still switches.

## Risks / Trade-offs

- [A second sibling of `.collection-hero-logo` is added in Webflow] → It rises with the enter selector but does not sink, because the leave name stays on `.collection-hero-gallery`. Move the name if that sibling becomes the main content.
- [Footer `global.js` fails to load] → page content stays invisible. Same class of failure as the rest of the site scripts.
- [Leave runs dimmed when a drawer is open] → Accepted. The content is behind the drawer.
- [View switch now costs 0.9s] → Accepted; it is the motion that was asked for. The fallback timer keeps it from hanging if `transitionend` never fires.
- [Shopify rows and hero textures pop after the rise] → Accepted. Holding the rise for those waits makes the blank longer than the pop.

## Migration Plan

1. Ship `css/global.css`, `js/global.js`, and `js/shop.js`.
2. Rollback: revert the three files. No Webflow markup change.
