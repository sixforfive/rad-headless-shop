## Why

Open gallery currently paints `#fff` text on `body` and `#fff` borders on every descendant. Chrome outside `.layer` (navbar, drawers, notification bar) should stay on theme tokens; only blended product chrome over the photos should go white.

## What Changes

- While `body` has `is-full-screen`, `color` and `border-color` `#fff` apply only to descendants of `.layer`.
- `body` itself and nodes outside `.layer` keep Webflow text and border tokens.
- Closing the gallery still removes `is-full-screen`, so layer chrome returns to tokens.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: White text and borders while the gallery is open apply to `.layer` children only.
- `merch-fullscreen-gallery`: Same scope on merch detail (shared CSS).

## Impact

- `css/global.css` only: drop `body.is-full-screen { color: #fff }` and the document-wide border rule; set both properties on `body.is-full-screen .layer *`.
- No JS. `body.is-full-screen` stays the open-gallery class.
- On mobile the layer is hidden, so the white chrome is a desktop-open effect.
- No new dependencies.
