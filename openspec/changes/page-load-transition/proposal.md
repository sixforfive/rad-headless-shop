## Why

Every route is a full document load. The first paint can show the shop grid as 1-column thumbs and product rows before Footer scripts place them. Holding the outgoing page, sinking it, and rising the next one covers that flash.

On `/` the logo is the one thing that should not move, but it sits above the only content `.main-wrapper` has, so excluding every ancestor that contains it froze the whole page.

## What Changes

- On every page, `.main-wrapper` starts lowered by `1.25rem` and invisible, then rises and fades in once layout scripts have run.
- On a same-origin navigation, the outgoing content moves down and fades out while the next document loads.
- On `/`, the motion applies to the siblings of `.collection-hero-logo`, not to its ancestors. The logo itself does not move or fade, and it stays on screen for the whole leave.
- While a drawer is open, a navigation keeps the drawer on screen for the leave. The dimmed content sinks underneath it.
- On `/shop`, switching Gallery and List sinks the product grid, swaps the view, then rises it with the same distance and duration.
- `prefers-reduced-motion: reduce` skips the move and the leave. Content still appears only after it is ready.
- The rise does not wait for Shopify prices or collection texture decode.

## Capabilities

### New Capabilities

- `page-load-transition`: enter and leave motion for page content, the collection logo exclusion, the drawer hold, and the shop view switch.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — initial hide, `html.is-ready` rise, view transition names and animations, logo and drawer holds, view-switch motion, reduced motion.
- `js/global.js` — `revealPage`, `schedulePageReveal`. Site-wide. No pathname filter.
- `js/shop.js` — `setView` sequences sink, swap, rise.
- No new dependencies. Webflow markup unchanged. Navbar, second menu, and footer stay put.
