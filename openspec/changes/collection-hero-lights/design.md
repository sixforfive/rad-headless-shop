## Context

See proposal.md for motivation. Collection `/` already publishes `.collection-hero-photo` (`position: relative`) with `.hero-photo-light` and `.hero-photo-dark.is-none`. Webflow CSS is `.hero-photo-dark.is-none { display: none; }`. Shop thumbs in `css/global.css` fade both layers; the hero holder is a full-viewport stack over the page canvas. `applyLights` in `js/global.js` already toggles `body.dark-mode`.

## Goals / Non-Goals

**Goals:**

- Hero photos follow `body.dark-mode` in CSS.
- Keep published markup, including `.is-none` on the dark photo.
- No hole to the holder or page canvas while switching.

**Non-Goals:**

- JS in `applyLights`.
- Webflow markup or CMS field changes.
- Logo / `.collection-hero-logo` swap.
- Changing the shop thumb crossfade.

## Decisions

### Fade dark only, not both

Stack `.hero-photo-dark` absolute on `.collection-hero-photo`. Fade only that overlay. `.hero-photo-light` stays at opacity 1 so two 50% layers never punch through to the canvas.

Show dark only when `body.dark-mode .hero-photo-dark:not(.w-dyn-bind-empty)`. Empty CMS binds stay hidden via `.w-dyn-bind-empty`.

Override Webflow `.hero-photo-dark.is-none { display: none }` so the dark photo can participate in the fade.

Alternative considered: fade both like thumbs. Rejected — midpoint coverage is 75%, so the holder/page shows through. Shop gets away with it because `.thumb-img-holder` is small and unfilled.

Alternative considered: toggle `.is-none` in `applyLights`. Rejected — `display: none` cannot fade.

### Stay in `css/global.css`

Site-wide sheet already loaded on `/`. No new file. No JS.

### Fade duration matches thumbs

`0.3s ease` on `.hero-photo-dark` `opacity` only. `transition-duration: 0s` under `prefers-reduced-motion`.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [`.is-none` override] → Only `.hero-photo-dark.is-none`; other `.is-none` combos stay.

## Migration Plan

1. Add the hero rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
