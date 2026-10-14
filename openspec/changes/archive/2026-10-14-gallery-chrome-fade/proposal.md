## Why

Opening and closing the full-screen gallery on product and merch detail snaps `mix-blend-mode` and font color on the chrome in one frame. That snap reads as a blink. An opacity fade out, then the blend and color change, then an opacity fade in, covers it.

## What Changes

- On viewports wider than 767px, opening and closing the gallery fades `.layer`, `.layer-cta`, `.product-nav-tab`, and `.gallery-full-screen` to opacity 0, applies the blend and white-chrome change while they are invisible, then fades them back to opacity 1. On close, `.gallery-full-screen` is hidden at opacity 0 and does not fade back in. The two fades do not overlap. Each is opacity `0.3s ease`.
- On viewports 767px wide and narrower, `.layer` still hides with `is-none` in the same turn. No chrome opacity fade.
- A gallery already open on first paint (next-product flag) stays an instant paint. No chrome fade.
- `prefers-reduced-motion: reduce` applies the settled blend and color in the same turn. No fade.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: Desktop open and close cover the blend and font-color snap on `.layer`, `.layer-cta`, and `.product-nav-tab` with an opacity fade out, then in. `.gallery-full-screen` fades out with them and fades in on open. First paint and reduced motion stay instant. Mobile hide-layer stays instant.
- `merch-fullscreen-gallery`: Same chrome fade on `/merch/{slug}`. Shared CSS and `setFullScreenGallery`.

## Impact

- `css/global.css` — opacity out, then in, on `.layer`, `.layer-cta`, `.product-nav-tab`, and `.gallery-full-screen` while the gallery chrome switches. Drawer dim on `.gallery-full-screen` stays `0.45s ease-out`. Theme color timing on the rest of the page stays as it is.
- `js/product.js` — `setFullScreenGallery` waits out the fade before `syncGalleryChrome` on desktop, then fades the three nodes back in. Merch detail uses the same function.
- No Webflow markup. No new dependency.
