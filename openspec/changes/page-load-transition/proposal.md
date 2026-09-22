## Why

Every route is a full document load. The first paint can show the shop grid as 1-column thumbs and product rows before Footer scripts place them. A short rise covers that flash. The outgoing page stays up while the next document loads, without its own animation.

## What Changes

- On every page, `.main-wrapper` starts slightly lowered and invisible, then rises and fades in once layout scripts have run. The rise distance is `0.625rem`.
- There is no leave animation. On a same-origin navigation the outgoing page stays until the next document can render, then it is replaced without moving or fading.
- On `/`, `.collection-hero-logo` does not move or fade with the rise.
- `prefers-reduced-motion: reduce` skips the move. Content still appears only after it is ready.
- The rise does not wait for Shopify prices or collection texture decode.
- Drawer dim on `.main-wrapper` stays a 0.45s opacity fade.

## Capabilities

### New Capabilities

- `page-load-transition`: enter motion for page content on every route, with the collection logo left out.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — initial hide, `html.is-ready` rise, logo exclusion, view transition with no leave motion, reduced motion.
- `js/global.js` — `revealPage`, `schedulePageReveal`. Site-wide. No pathname filter.
- No new dependencies. Webflow markup unchanged. Navbar, second menu, and footer stay put.
