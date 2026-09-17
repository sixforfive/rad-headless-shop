## Context

See proposal.md for motivation. Collection `/` already publishes `.collection-hero-photo` (`position: relative`) with `.hero-photo-light` and `.hero-photo-dark.is-none`. Webflow CSS is `.hero-photo-dark.is-none { display: none; }`. Shop thumbs in `css/global.css` already stack `.thumb-dark` and crossfade with `body.dark-mode`. `applyLights` in `js/global.js` already toggles that class.

## Goals / Non-Goals

**Goals:**

- Hero photos follow `body.dark-mode` in CSS, same stacking as thumbs.
- Keep published markup, including `.is-none` on the dark photo.

**Non-Goals:**

- JS in `applyLights`.
- Webflow markup or CMS field changes.
- Logo / `.collection-hero-logo` swap.

## Decisions

### CSS like thumbs, not `.is-none` toggle

Stack `.hero-photo-dark` absolute on `.collection-hero-photo`. Crossfade `opacity`. Show dark only when `body.dark-mode .hero-photo-dark:not(.w-dyn-bind-empty)`. `:has()` keeps light visible when dark is empty.

Override Webflow `.hero-photo-dark.is-none { display: none }` so the dark photo can participate in the fade. Empty CMS binds stay hidden via `.w-dyn-bind-empty`.

Alternative considered: toggle `.is-none` in `applyLights`. Rejected — `display: none` cannot fade, and shop already rejected that for thumbs.

### Stay in `css/global.css`

Site-wide sheet already loaded on `/`. No new file. No JS.

### Fade duration matches thumbs

`0.3s ease` on hero `opacity`. `transition-duration: 0s` under `prefers-reduced-motion`, same list as `.thumb-light` / `.thumb-dark`.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [`.is-none` override] → Only `.hero-photo-dark.is-none`; other `.is-none` combos stay.

## Migration Plan

1. Add the hero rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
