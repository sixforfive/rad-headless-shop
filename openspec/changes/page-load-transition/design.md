## Context

See proposal.md. Pages are full document loads. `css/global.css` is a render-blocking Head stylesheet. Page scripts are Footer tags, so the first paint can beat `hydrateThumbs` and `hydrateMerchThumbs`. `.main-wrapper` is the content shell on every route. Navbar, second menu, and footer sit outside it. Drawer dim already fades `.main-wrapper` opacity over 0.45s.

## Goals / Non-Goals

**Goals:**

- One site-wide enter and leave. No pathname allowlist.
- Outgoing content stays on screen for the fetch, then sinks. Incoming content rises only after sync layout.

**Non-Goals:**

- Waiting on `hydrateVariants` or hero texture decode.
- A client-side router or a new dependency.
- Moving navbar, second menu, or footer.
- Changing drawer dim timing.

## Decisions

### Hide in Head CSS, reveal from `global.js`

`.main-wrapper` starts at `opacity: 0` and `translateY(1.25rem)`. `html.is-ready` sets `opacity: 1` and `transform: none` with a 0.6s transition. The hide is in the blocking stylesheet, so the broken grid is never painted. `revealPage` adds `is-ready` on the next frame so the transition has a from-state.

`schedulePageReveal` listens for `pagereveal`. If `viewTransition` is set, it reveals from `finished` (resolve or reject). Otherwise it reveals immediately. A double `requestAnimationFrame` reveals only if `pagereveal` never fired, so browsers without that event still show the page.

Alternative considered: fade in from the Footer script with no prior hide. Rejected — the first paint is already the 1-column grid.

### Cross-document view transition for the leave only

`@view-transition { navigation: auto }` with `view-transition-name: page` on `.main-wrapper`. Root old and new animations are `none`, so chrome is not crossfaded. `::view-transition-old(page)` runs `page-out` (down 1.25rem, fade, 0.6s). `::view-transition-new(page)` is `animation: none`.

The incoming snapshot is taken while `.main-wrapper` is still `opacity: 0`. Animating that snapshot would fade in an empty image. The rise is the CSS transition after `finished`, not the incoming view-transition pseudo.

Alternative considered: intercept clicks, animate, then assign `location`. Rejected — the old document is destroyed at navigation, so it cannot cover the download.

### Dim keeps its own opacity timing

`html.is-ready .main-wrapper.is-dimmed` sets `transition: opacity 0.45s ease-out` and `opacity: 0.2`, more specific than the rise rule, so an open drawer does not inherit the 0.6s page transition.

### Reduced motion

Inside `prefers-reduced-motion: reduce`: `@view-transition { navigation: none }`, `.main-wrapper { transform: none }`, page view-transition animations `none`. The existing `transition-duration: 0s` list already includes `.main-wrapper`, so the reveal snaps.

## Risks / Trade-offs

- [Footer `global.js` fails to load] → `.main-wrapper` stays invisible. Same class of failure as the rest of the site scripts.
- [Incoming snapshot is blank during the leave] → Accepted. The rise starts when the leave ends, so the two motions do not overlap.
- [`pagereveal` before the double frame callback] → The flag skips the fallback, so the page is not revealed twice.
- [Shopify rows and hero textures pop after the rise] → Accepted. Holding the rise for those waits makes the blank longer than the pop.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. Rollback: revert both files. No Webflow markup change.
