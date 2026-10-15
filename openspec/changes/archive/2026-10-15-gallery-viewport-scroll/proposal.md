## Why

On `/product/{slug}` and `/merch/{slug}`, the desktop default gallery only scrolls while the pointer is over `.product-gallery-col`. A wheel anywhere else in the viewport does nothing.

## What Changes

- While the desktop default gallery is the scroller, a vertical wheel anywhere in the viewport scrolls that gallery.
- Fullscreen, viewports 767px and narrower, and `prefers-reduced-motion: reduce` stay as they are.
- An open menu or cart list still scrolls itself. The page behind it stays locked.

## Capabilities

### New Capabilities

- `product-gallery-scroll`: Viewport-wide wheel on the desktop default gallery for product and merch detail.

### Modified Capabilities

- None.

## Impact

- `js/smooth-scroll.js` — nested gallery Lenis listens on the window; the document Lenis ignores that wheel while the nested instance is live.
- No new dependencies. Webflow markup unchanged.
