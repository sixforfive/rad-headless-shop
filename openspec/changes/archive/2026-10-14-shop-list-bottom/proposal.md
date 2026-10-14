## Why

On Shop list view, the last 160px of downward scroll is scaled down, so the end of the page feels stuck. The gallery counter is already hidden in list view by a `:has()` rule; it should hide the same way as the rest of the chrome, with `.is-none`.

## What Changes

- Shop list view does not damp wheel delta in the bottom edge zone. Gallery already skips that zone; merch and other pages keep it.
- `#gallery-scroll-counter` gets `.is-none` in list view and loses it in gallery.
- Drop the `body:has(...) #gallery-scroll-counter { display: none }` rule.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shop-gallery-loop`: List view hides `#gallery-scroll-counter` with `.is-none`. Shop list view does not scale wheel delta in the bottom edge zone.

## Impact

- `js/smooth-scroll.js` — `isShopGallery` matches any Shop list, gallery or list view.
- `js/shop.js` — toggle `.is-none` on the counter from `applyView` and on boot.
- `css/global.css` — `#gallery-scroll-counter.is-none` in the hide list; remove the `:has()` rule.
- No new dependencies. No Webflow Designer edit.
