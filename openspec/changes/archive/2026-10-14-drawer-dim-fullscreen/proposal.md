## Why

Opening menu or cart dims `.main-wrapper` only. On product and merch detail, `.gallery-full-screen` is a sibling of `.layer` (not inside `.main-wrapper`), so when fullscreen is open the photos stay bright behind the drawer.

## What Changes

- While either drawer is open, add `.is-dimmed` to `.gallery-full-screen` as well as `.main-wrapper`. Closing removes it from both.
- Share the existing dim CSS (`opacity: 0.15`, `0.3s ease`) with `.gallery-full-screen`. Kill that transition under `prefers-reduced-motion`.
- Navbar chrome (`setDrawerButtons`) is unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `drawer-chrome`: Page dim while a drawer is open also covers `.gallery-full-screen`.

## Impact

- `css/global.css` (dim selectors + reduced-motion).
- `js/global.js` (`openDrawer` / `closeDrawer`). Gallery node is `dimGallery` so it does not collide with `product.js`.
- No Webflow markup. No `js/product.js` edits. No new dependencies. No Shopify.
