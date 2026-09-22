## Why

Every route is a full document load. The first paint can show the shop grid as 1-column thumbs and product rows before Footer scripts place them. A content transition covers that flash, and keeps the outgoing page on screen while the next document loads.

## What Changes

- On every page, `.main-wrapper` starts lowered and invisible, then rises and fades in once layout scripts have run.
- On a same-origin navigation, the outgoing `.main-wrapper` moves down and fades out while the next document loads. Navbar, second menu, and footer stay put.
- `prefers-reduced-motion: reduce` skips the move and the leave animation. Content still appears only after it is ready.
- The rise does not wait for Shopify prices or collection texture decode.
- Drawer dim on `.main-wrapper` stays a 0.45s opacity fade.

## Capabilities

### New Capabilities

- `page-load-transition`: enter and leave motion for `.main-wrapper` on every route.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — initial hide, `html.is-ready` rise, cross-document view transition, reduced motion.
- `js/global.js` — `revealPage`, `schedulePageReveal`. Site-wide. No pathname filter.
- No new dependencies. Webflow markup unchanged. Chrome outside `.main-wrapper` is not snapshotted.
