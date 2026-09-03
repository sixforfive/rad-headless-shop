## Why

`.next-product` is a full-page load. Gallery open/closed lives in `product.js` memory, so the next product or merch always paints closed. Close is now `.close-product` (two nodes, one per breakpoint), but the blend allowlist still names `#close-product`.

## What Changes

- Persist gallery open/closed across `.next-product` as a one-shot `sessionStorage` flag.
- Head snippet on Product and Merch templates sets `html.is-full-screen` before first paint when the flag is set.
- CSS paints the open gallery from `html.is-full-screen` so the incoming page does not flash closed.
- `.next-product` and `.close-product` receive clicks while the layer is blended.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: persist open/closed across `.next-product`; Head paint; clickable-actions IDs.
- `merch-fullscreen-gallery`: same.

## Impact

- `js/product.js` — write flag on `.next-product`, restore on boot, toggle `html.is-full-screen`.
- `css/global.css` — allowlist + `html.is-full-screen` paint rules.
- Webflow Head custom code on Products Template and Merch Template.
