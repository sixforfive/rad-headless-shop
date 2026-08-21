## Why

Opening menu or cart still leaves the other navbar controls visible, so the chrome fights the active drawer. Each drawer needs its own navbar set, and visitors should not jump menu↔cart from the navbar.

## What Changes

- When `.menu-drawer` is open, add `.is-none` to `#lights-switch-btn` and `#cart-open`. Closing restores them.
- When `.cart-drawer` is open, add `.is-none` to `#lights-switch-btn` and `#menu-open`, and remove `.is-none` from `#cart-title` and `#currency-btn`. Closing restores the closed state.
- Keep existing drawer functions (`openDrawer`, `closeDrawer`, `setDrawerButtons`, overlay swap). Navbar no longer exposes a menu↔cart swap because both open controls hide whenever either drawer is open.
- Add `.link-secondary.is-none { display: none }` so `#lights-switch-btn` actually hides. `#cart-title` and `#currency-btn` already match `.menu-link.is-none`.

## Capabilities

### New Capabilities

- `drawer-chrome`: Navbar control visibility while menu or cart is open, using `.is-none`.

### Modified Capabilities

- None.

## Impact

- `js/global.js` (`setDrawerButtons`).
- `css/global.css` (`.link-secondary.is-none`).
- Published navbar markup stays as it is (`#cart-title` is `div.menu-link.is-none`).
- No new dependencies. No Shopify or CMS API changes.
