## Context

See proposal.md. Pages are full document loads. `css/global.css` is a render-blocking Head stylesheet. Page scripts are Footer tags, so the first paint can beat `hydrateThumbs` and `hydrateMerchThumbs`. `.main-wrapper` is the content shell on every route. Navbar, second menu, and footer sit outside it. `.collection-hero-logo` stays fixed in the viewport while the `/` mosaic pans. Drawer dim already fades `.main-wrapper` opacity over 0.45s.

## Goals / Non-Goals

**Goals:**

- One site-wide rise. No pathname allowlist. No leave motion.
- Outgoing page stays on screen for the fetch, then cuts. Incoming content rises `0.625rem` only after sync layout.
- `.collection-hero-logo` is outside that rise.

**Non-Goals:**

- A leave move or fade.
- Waiting on `hydrateVariants` or hero texture decode.
- A client-side router or a new dependency.
- Moving navbar, second menu, footer, or `.collection-hero-logo`.
- Changing drawer dim timing.

## Decisions

### Hide in Head CSS, reveal from `global.js`

Page content starts at `opacity: 0` and `translateY(0.625rem)`. `html.is-ready` sets `opacity: 1` and `transform: none` with a 0.6s transition. Half of the earlier `1.25rem`. The hide is in the blocking stylesheet, so the broken grid is never painted. `revealPage` adds `is-ready` on the next frame so the transition has a from-state.

`schedulePageReveal` listens for `pagereveal`. If `viewTransition` is set, it reveals from `finished` (resolve or reject). With no leave animation that promise resolves as soon as the next document can render. Otherwise it reveals immediately. A double `requestAnimationFrame` reveals only if `pagereveal` never fired.

Alternative considered: fade in from the Footer script with no prior hide. Rejected — the first paint is already the 1-column grid.

### View transition holds the old page and does not animate it

`@view-transition { navigation: auto }` with `view-transition-name: page` on `.main-wrapper` only. One name per page, including `/`, where the rise is on several children. Root, old, and new view-transition animations are `none`. No `page-out` keyframes.

The old page stays visible during the fetch. When the next document can render, it is replaced with no move and no fade, and the rise runs after that.

Alternative considered: drop `@view-transition` entirely. Rejected — the old document would be destroyed on click, so the wait would be a blank page.

### Logo is not under the faded element

A child cannot stay opaque while an ancestor fades. The rise therefore does not target `.main-wrapper` itself when `.collection-hero-logo` is inside it. It targets each direct child that is not the logo and does not contain it:

`.main-wrapper:has(.collection-hero-logo) > :not(.collection-hero-logo):not(:has(.collection-hero-logo))`

Pages without the logo keep the rise on `.main-wrapper`.

Alternative considered: counter-translate the logo. Rejected — the parent fade would still hide it.

### Dim keeps its own opacity timing

`html.is-ready .main-wrapper.is-dimmed` sets `transition: opacity 0.45s ease-out` and `opacity: 0.2`, so an open drawer does not inherit the 0.6s page transition. The dim still applies to `.main-wrapper`, including on `/`.

### Reduced motion

Inside `prefers-reduced-motion: reduce`: `@view-transition { navigation: none }`, no translate on the rising element, view-transition animations `none`. The existing `transition-duration: 0s` list includes `.main-wrapper`, so the reveal snaps. The same duration kill must include the direct-child rise rule.

## Risks / Trade-offs

- [Footer `global.js` fails to load] → page content stays invisible. Same class of failure as the rest of the site scripts.
- [Logo nested inside the only child of `.main-wrapper`] → that whole child is excluded, so `/` would not rise. The logo has to be its own child, or sit in a sibling of the content that should rise.
- [`pagereveal` before the double frame callback] → The flag skips the fallback, so the page is not revealed twice.
- [Shopify rows and hero textures pop after the rise] → Accepted. Holding the rise for those waits makes the blank longer than the pop.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. Rollback: revert both files. No Webflow markup change.
