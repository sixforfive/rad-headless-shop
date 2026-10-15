## Why

Closing the menu or cart puts the navbar back to its closed set as soon as the close starts. The blend mode, the `> menu` / `> cart` labels, and the lights button return while the drawer is still reversing and fading.

## What Changes

- Keep the open-drawer navbar through the reverse and the overlay fade.
- Restore the closed set only when `.drawer-wrapper` is hidden: drop `.is-normal` on `.navbar`, show `#menu-open` and `#cart-open`, hide `#menu-close` and `#cart-close`, show `#lights-switch-btn`, and hide `#cart-title` and `#currency-btn`.
- Opening, swapping menu and cart, leaving from a menu link, and restoring from the back/forward cache stay as they are.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `drawer-chrome`: Closed navbar chrome is restored when the overlay is hidden, not when close starts.

## Impact

- `js/global.js` (`closeDrawer`, `hideDrawerOverlay`).
- No CSS. No Webflow markup. No new dependencies.
