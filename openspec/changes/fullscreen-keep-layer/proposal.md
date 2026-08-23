## Why

Fullscreen gallery currently hides all of `.layer`, so navbar, product copy, and CTA disappear. The open state should keep that chrome over the full-screen images, hide only the in-page gallery, and invert the chrome with `mix-blend-mode: difference` except the CTA.

## What Changes

- Keep opening `.gallery-full-screen` (remove `.is-none`) on the same desktop/mobile triggers as today.
- Stop toggling `.is-none` on `.layer`.
- Toggle `.is-none` on `.product-gallery-collection.is-default` (in-page collection) instead.
- While open, add a class on `.layer` that sets `mix-blend-mode: difference`. `.cta-wrapper` stays `mix-blend-mode: normal` so it does not invert.
- Closing restores closed classes: gallery hidden, default collection visible, layer blend off.

## Capabilities

### New Capabilities

- `product-fullscreen-gallery`: Product template full-screen gallery open/close, including which nodes hide and how `.layer` blends.

### Modified Capabilities

- None.

## Impact

- `js/product.js` (`setFullScreenGallery`).
- `css/global.css` (combo hide for the default collection; layer blend; CTA excluded).
- Webflow: combo `is-default` on the in-page `.product-gallery-collection` (not on the full-screen copy).
- No new dependencies. Triggers and `#full-screen-open` / `#full-screen-close` stay as they are.
