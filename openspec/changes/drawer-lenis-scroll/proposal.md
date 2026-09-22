## Why

Menu and cart lists scroll in Designer but not live. Stopped Lenis `preventDefault`s wheel/touch unless `data-lenis-prevent` is on the path. The clip and `height: auto` CSS cuts did not fix that.

## What Changes

- Set `data-lenis-prevent` on `.menu-drawer` and `.cart-drawer` while open; clear it on close.
- Keep `radLenisStop` / `radLenisStart` and `body.is-scroll-locked`.
- Leave the clip / `height: auto` CSS cuts as they are.

## Capabilities

### New Capabilities

- `drawer-scroll`: Menu and cart lists keep their own scroll while the page is locked. Open drawers SHALL carry `data-lenis-prevent` so stopped Lenis does not eat their gestures.

### Modified Capabilities

- None.

## Impact

- `js/global.js` (`openDrawer` / `hideDrawerOverlay`).
- No Webflow markup, no new dependencies.
- Rollback: drop the attr writes.
