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

- One site-wide sink and rise at `1.25rem` over 0.6s.
- On `/`, move the logo's siblings, never its ancestors.
- Keep an open drawer painted for the whole leave.
- Reuse the same distance and duration for the `/shop` view switch.

**Non-Goals:**

- Prefetching the next document.
- Waiting on `hydrateVariants` or hero texture decode.
- A client-side router or a new dependency.
- Moving navbar, second menu, footer, or `.collection-hero-logo`.
- Changing drawer dim timing.

## Decisions

### Hide in Head CSS, reveal from `global.js`

The rising element starts at `opacity: 0` and `translateY(1.25rem)`. `html.is-ready` sets `opacity: 1` and `transform: none` over 0.6s. The hide is in the blocking stylesheet, so the broken grid is never painted. `revealPage` adds `is-ready` on the next frame so the transition has a from-state.

`schedulePageReveal` listens for `pagereveal`. If `viewTransition` is set, it reveals from `finished` (resolve or reject), so the rise starts when the leave ends. Otherwise it reveals immediately. A double `requestAnimationFrame` reveals only if `pagereveal` never fired.

### Enter target is a selector, leave target is a name

These two cannot use the same mechanism. The enter is a CSS transition, so it can apply to any number of elements. `view-transition-name` must be unique per document, so the leave applies to exactly one.

Enter:

```
.main-wrapper:not(:has(.collection-hero-logo)),
:has(> .collection-hero-logo) > :not(.collection-hero-logo)
```

Leave: `view-transition-name: page` on `.main-wrapper`, moved to `.collection-hero-gallery` on `/` with `.main-wrapper:has(.collection-hero-logo) { view-transition-name: none }`.

Alternative considered: name the logo's sibling with `:has(> .collection-hero-logo) > :not(.collection-hero-logo)`. Rejected — a second sibling added in Webflow would duplicate the name and drop the transition. The explicit class fails visibly instead.

### Holds, not animations, for the logo and the drawer

Root old and new are `animation: none`, so the new root paints over the old the moment the transition starts. Anything that should outlive that needs its own name and no animation, which parks its old snapshot until the longest animation (`page-out`, 0.6s) ends.

`.collection-hero-logo` gets `hero-logo`. `.drawer-wrapper` gets `drawer`; it is `display: none` when closed, so it is only captured when a drawer is open, and the incoming page never has one.

Group stacking follows DOM order, and `.drawer-wrapper` is before `.main-wrapper`, so explicit `z-index` on the groups is required: `page` 1, `hero-logo` 2, `drawer` 3.

### View switch is a class sequence, not `startViewTransition`

`setView` adds `is-leaving` to `.products-collection`, waits for the opacity `transitionend` with a timeout fallback, then does the existing work (toggle `is-gallery`, sync buttons, jump to top, `measureLoopHeight`, `onGalleryScroll`), then removes `is-leaving`.

`.products-collection` wraps both the list and the clone, so one element covers both.

Alternative considered: `document.startViewTransition`. Rejected — `.main-wrapper` is still named `page`, so the same-document capture would fire the `page-out` leave rules meant for navigation.

### Reduced motion

`@view-transition { navigation: none }`, no translate on the enter target, view-transition animations `none`. The existing `transition-duration: 0s` list must include the enter selector and `.products-collection`, and `setView` must skip the wait so the view still switches.

## Risks / Trade-offs

- [A second sibling of `.collection-hero-logo` is added in Webflow] → It rises with the enter selector but does not sink, because the leave name stays on `.collection-hero-gallery`. Move the name if that sibling becomes the main content.
- [Footer `global.js` fails to load] → page content stays invisible. Same class of failure as the rest of the site scripts.
- [Leave runs dimmed when a drawer is open] → Accepted. The content is behind the drawer.
- [View switch now costs 1.2s] → Accepted; it is the motion that was asked for. The fallback timer keeps it from hanging if `transitionend` never fires.
- [Shopify rows and hero textures pop after the rise] → Accepted. Holding the rise for those waits makes the blank longer than the pop.

## Migration Plan

1. Ship `css/global.css`, `js/global.js`, and `js/shop.js`.
2. Rollback: revert the three files. No Webflow markup change.
