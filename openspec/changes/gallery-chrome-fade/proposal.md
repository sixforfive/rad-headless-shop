## Why

Opening or closing the desktop full-screen gallery paints the product chrome white and switches it to `difference` in one frame. On the white theme that white is invisible until the blend layer is ready, so `.layer`, `.layer-cta`, and `.product-nav-tab` blink out and back.

## What Changes

- On a viewport wider than 767px, a user open or close fades those three containers to opacity 0 over `0.3s` ease-out, applies the settled gallery classes while they are invisible, then fades them back to opaque over the same timing.
- A second open or close during that fade replaces the pending settled state and does not start another fade-out.
- Restoring an open gallery from `rad-fs-gallery`, crossing 767px while open, a viewport of 767px or narrower, and `prefers-reduced-motion: reduce` still apply the settled classes immediately.

## Capabilities

### New Capabilities

### Modified Capabilities

- `product-fullscreen-gallery`: Desktop user open and close fade the three chrome containers around the blend swap. Boot restore, resize, mobile, and reduced motion stay instant.

## Impact

- `js/product.js` — `setFullScreenGallery` sequences the fade around `syncGalleryChrome` on desktop. Boot restore and the breakpoint listener stay immediate.
- `css/global.css` — opacity transition and `.is-chrome-out` on `.layer`, `.layer-cta`, and `.product-nav-tab`. Reduced motion sets that duration to `0s`.
- No new dependencies. Webflow markup unchanged.
