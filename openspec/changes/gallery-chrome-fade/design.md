## Context

See proposal.md. `setFullScreenGallery` in `js/product.js` calls `syncGalleryChrome` in the same turn. That adds `is-full-screen` and, above 767px, `is-blend`. `css/global.css` then sets `mix-blend-mode: difference` on `.layer` and forces `.layer *` plus `.product-nav-tab` to `#fff`. `body *` also transitions `color` and `border-color` over `0.45s`.

## Goals / Non-Goals

**Goals:**

- One fade-out, a class swap at opacity 0, then one fade-in, shared by `.layer`, `.layer-cta`, and `.product-nav-tab`.
- Instant settle for boot restore, breakpoint changes, mobile, and reduced motion.

**Non-Goals:**

- Fading the gallery images.
- Changing which classes the settled open and closed states use.
- A fixed difference blend on the chrome.

## Decisions

### Hold the class swap until opacity is 0

`setFullScreenGallery(open)` on a desktop user toggle adds `is-chrome-out` to the three containers, waits for the opacity transition, calls `syncGalleryChrome`, then removes `is-chrome-out` on the next frame. The gallery’s own show and hide stay inside `syncGalleryChrome`, so they move with the blend instead of ahead of it.

A second call while `is-chrome-out` is on stores the new `open` value and does not add the class again. Boot restore and the `mobileQuery` listener pass an immediate flag and call `syncGalleryChrome` directly. Mobile and `prefers-reduced-motion: reduce` take that same immediate path.

Alternative considered: one CSS transition on opacity in the same turn as `is-blend`. Rejected — the white paint and the blend still change while the containers are visible.

### Snap color while the containers are invisible

`.layer`, `.layer-cta`, and `.product-nav-tab` transition `opacity` at `0.3s` ease-out and keep theme `background-color`, `color`, and `border-color` at `0.45s` ease-out. `.is-chrome-out` sets `opacity: 0` and limits that transition to opacity, and its descendants get `transition: none`, so the `#fff` and `difference` swap does not ease in under the fade-up.

Reduced motion sets `transition-duration: 0s` on the three containers. The JS path does not add `is-chrome-out` in that case.

## Risks / Trade-offs

- [The gallery appears only after the fade-out] → The blink is the class swap. Showing images early would put the old chrome over the new photos.
- [A missed `transitionend` leaves the chrome hidden] → A timeout at the transition length runs the same settle.
- [`body *` still eases color on the way back up] → Descendants do not transition during `.is-chrome-out`, and the class comes off only after the swap.

## Migration Plan

1. Edit `css/global.css` and `js/product.js` as in tasks.md.
2. Rollback: call `syncGalleryChrome` directly from `setFullScreenGallery` and delete `.is-chrome-out`.
