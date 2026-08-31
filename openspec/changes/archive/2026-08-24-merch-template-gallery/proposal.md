## Why

The merch CMS template already has the product gallery tree, but fullscreen and mobile snap never ran on `/merch/{slug}` because the in-page collection lacked `is-default` and the template did not load `js/product.js`. Both wires are now in Webflow; the specs still describe product-only.

## What Changes

- Record that `/merch/{slug}` uses the same `js/product.js` gallery as `/product/{slug}` (fullscreen open/close/blend plus snap and pagination ticks).
- Webflow (already published): combo `is-default` on the in-page merch `.product-gallery-collection`; Merch template footer loads `product.js` at the same pin as product.
- README: `product.js` is product and merch detail; `merch.js` is merch listing only.
- No new gallery JS or CSS.

## Capabilities

### New Capabilities

- `merch-fullscreen-gallery`: Merch template full-screen gallery: same breakpoint triggers, hide/blend, and click-through as product, without `#download-spec`.

### Modified Capabilities

- `product-gallery-snap`: Snap, ticks, and hide-bar rules also apply on `/merch/{slug}`.

## Impact

- `README.md` (script roles).
- Webflow Merch template: `is-default` + `product.js` embed (already live).
- `js/product.js` and `css/global.css` unchanged.
- Do not edit the open `fullscreen-gallery` change.
- No new dependencies. `/merch` listing unchanged.
