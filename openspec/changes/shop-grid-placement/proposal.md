## Why

Shop product thumbs already carry CMS column attributes, but the grid ignores them, so every item sits in a single auto-placed cell. Gallery and List must share one Collection List so a later view morph is possible; placement has to follow a class on that list, not two pages.

## What Changes

- New page script `js/shop.js` copies `gallery-column-start`, `gallery-column-end`, and `list-column` from each `.product-thumb` onto CSS variables (`gallery-column-end` is inclusive, so CSS end is value + 1).
- CSS in `css/global.css` applies gallery span when `.product-list` has `.is-gallery`, and list column when it does not. Placement resets to auto when Webflow collapses the grid.
- `.switch-btn[data-view]` toggles `.is-gallery` on `.product-list` and moves `.is-active` on the buttons. Instant class change, no animation.
- Remove unused stubs `js/shop-gallery.js` and `js/shop-list.js`.

## Capabilities

### New Capabilities

- `shop-grid`: Shop Collection List places thumbs from CMS attributes and switches Gallery/List via `.is-gallery`.

### Modified Capabilities

- None.

## Impact

- `js/shop.js` (new; load on the Shop page Footer in Webflow).
- `css/global.css` (already loaded site-wide).
- Docs: `README.md`, `rad-workflow-scripts.md`, `.cursor/rules/webflow-rad.mdc`.
- Webflow markup is already published (`/shop`, attributes, `data-view` on switch buttons). Shop List page is untouched.
- No new dependencies. No Shopify changes.
