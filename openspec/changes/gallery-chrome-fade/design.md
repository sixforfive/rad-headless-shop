## Context

See proposal.md for motivation. `syncGalleryChrome` in `js/product.js` toggles `is-blend`, `is-full-screen`, and gallery `is-none` in one turn. On desktop, `css/global.css` then sets `mix-blend-mode: difference` on `.layer` and `.product-nav-tab`, and `#fff` on `.layer *`. `.layer-cta` sits outside `.layer`. `html, body, body *` already transition `background-color`, `color`, and `border-color` at `0.45s ease-out`. A `transition` shorthand replaces every property not listed. `prefers-reduced-motion` sets `transition-duration: 0s` on `body *`, which loses to a class rule. Product and merch detail share this script.

## Goals / Non-Goals

**Goals:**

- Fade the three chrome nodes out, swap blend and white chrome at opacity 0, fade them back in.
- Keep boot restore, breakpoint changes, and mobile `is-none` instant.

**Non-Goals:**

- Fading the gallery images. They still cut with `display`.
- Changing drawer dim, theme timing on the rest of the page, or click-through targets.

## Decisions

Desktop click open and close call a fade path. Boot restore and the `matchMedia` change listener keep calling `syncGalleryChrome` in the same turn.

The fade path adds `is-chrome-fading` on `html`, which sets opacity 0 on `.layer`, `.layer-cta`, and `.product-nav-tab`. On `transitionend` for `opacity` (or after 300ms), it calls `syncGalleryChrome`, then removes `is-chrome-fading` so the same nodes fade back to 1. A second click increments a token. The in-flight end ignores a stale token and runs the latest open or closed target. `prefers-reduced-motion: reduce` skips the class and calls `syncGalleryChrome` in the same turn.

Gallery `is-none` stays inside `syncGalleryChrome`, so the image cut happens while chrome is at opacity 0. Splitting the image cut out front would leave the old blend painted over the new images.

`.layer`, `.layer-cta`, and `.product-nav-tab` list opacity at `0.3s ease` and keep `background-color`, `color`, and `border-color` at `0.45s ease-out`. Those three selectors go on the reduced-motion duration list so a class rule cannot outrank `body *`.

Alternative considered: fade opacity after the class toggle. Rejected — the blend snap would still paint, then fade.

Alternative considered: one opacity transition on `body *`. Rejected — that fades the page on every opacity change.

## Risks / Trade-offs

- [Image cut waits out the 0.3s fade-out] → The cut is hidden. Chrome then fades in over the open gallery.
- [A missing `.layer-cta` or `.product-nav-tab`] → Listen on the first of the three that exists. Do not block on a missing node.
- [Opacity shorthand drops the theme color fade on those three nodes] → The rule lists the three color properties next to opacity.
