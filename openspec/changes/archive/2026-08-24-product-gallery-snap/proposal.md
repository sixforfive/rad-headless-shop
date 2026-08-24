## Why

On `/product/{slug}` at 767px and down, `.product-gallery-collection.is-default` already scrolls horizontally, but a swipe can stop between images and the pagination ticks are a static template. The in-page gallery should snap each image flush and show one tick per loaded image, with `is-choosen` on the tick that matches the snapped slide.

## What Changes

- CSS scroll-snap on the default collection’s `.product-gallery-list` at `max-width: 767px` so a swipe settles on one image.
- JS clones `.pagination-bar`’s single `.pagination-item` so there is one tick per `.product-gallery-item` in the default collection, in DOM order.
- The tick for the snapped image gets combo `is-choosen`; the others do not.
- `.pagination-bar` gets `is-none` when the default collection has fewer than two images.
- Full-screen gallery (`.product-gallery-list.is-full`) is unchanged.

## Capabilities

### New Capabilities

- `product-gallery-snap`: In-page product gallery on `/product/{slug}` snaps horizontally at ≤767px and mirrors the snapped image with pagination ticks.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (snap rules; `.pagination-bar.is-none` on the existing `display: none` list).
- `js/product.js` (clone ticks, sync `is-choosen`, hide bar at 0–1 images).
- Webflow: `.pagination-bar` with one `.pagination-item.is-choosen` template (already published). Default collection combo `is-default` already exists.
- No new dependencies. No GSAP. Merch template and full-screen gallery out of scope.
