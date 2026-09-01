## Why

Open fullscreen gallery already forces body text to `#fff` so chrome stays readable over photos. Borders stay on Webflow theme tokens and disappear against the same images.

## What Changes

- While `body` has `is-full-screen`, every CSS `border-color` is `#fff`.
- Closing the gallery removes `is-full-screen`, so borders return to the theme tokens.
- Same class already drives product and merch detail galleries; no new JS.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: Open gallery also forces white borders, not only white body text.
- `merch-fullscreen-gallery`: Same border contract on merch detail (shared `body.is-full-screen`).

## Impact

- `css/global.css` only: extend the existing `body.is-full-screen` rule.
- No JS. `js/product.js` already toggles the class on product and merch detail.
- Out of scope: sold-out X (gradient, not `border-color`), outlines, box-shadows.
- No new dependencies.
