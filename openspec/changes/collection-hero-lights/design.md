## Context

See proposal.md for motivation. Collection `/` already publishes `.collection-hero-photo` (`position: relative`) with `.hero-photo-light` and `.hero-photo-dark.is-none`. Webflow CSS is `.hero-photo-dark.is-none { display: none; }`. Shop thumbs stack `.thumb-dark` on `.thumb-img-holder`. `applyLights` in `js/global.js` already toggles `body.dark-mode`.

## Goals / Non-Goals

**Goals:**

- Hero photos and product thumbs follow `body.dark-mode` in CSS.
- Keep published markup, including `.is-none` on the dark hero photo.
- No hole to the holder or page canvas while switching.

**Non-Goals:**

- JS in `applyLights`.
- Webflow markup or CMS field changes.
- Logo / `.collection-hero-logo` swap.

## Decisions

### Fade dark only, not both

Stack `.hero-photo-dark` absolute on `.collection-hero-photo`. Fade only that overlay. `.hero-photo-light` stays at opacity 1 so two 50% layers never punch through to the canvas.

Same for shop: fade only `.thumb-dark`; `.thumb-light` stays opaque.

Show dark only when `body.dark-mode` and the dark image is not `.w-dyn-bind-empty`. Empty CMS binds stay hidden via `.w-dyn-bind-empty`.

Override Webflow `.hero-photo-dark.is-none { display: none }` so the dark hero can participate in the fade.

Alternative considered: fade both layers. Rejected — midpoint coverage is 75%, so the holder/page shows through.

Alternative considered: toggle `.is-none` in `applyLights`. Rejected — `display: none` cannot fade.

### Stay in `css/global.css`

Site-wide sheet already loaded on `/` and `/shop`. No new file. No JS.

### Fade duration matches the drawer

`0.3s ease` on `.hero-photo-dark` and `.thumb-dark` `opacity` only. `transition-duration: 0s` under `prefers-reduced-motion`.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [`.is-none` override] → Only `.hero-photo-dark.is-none`; other `.is-none` combos stay.

## Migration Plan

1. Add the hero and thumb overlay rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
