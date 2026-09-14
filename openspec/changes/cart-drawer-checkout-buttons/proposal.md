## Why

`.checkout-wrapper` already has `#keep-shopping` and `#checkout-btn`, but neither is wired. Keep shopping does not close the drawer, and Checkout stays visible when the cart is empty.

## What Changes

- Clicking `#keep-shopping` closes `.cart-drawer` through the existing `closeDrawer` path used by `#cart-close`.
- `renderCart` hides `#checkout-btn` when the cart has no lines and shows it when lines exist.
- Checkout redirect is not in this change.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shopify-cart-drawer`: Keep shopping closes the drawer; Checkout is hidden when the cart is empty and shown when it has lines.

## Impact

- `js/global.js` — `#keep-shopping` click calls `closeDrawer`.
- `js/cart.js` — `renderCart` toggles `#checkout-btn` `style.display`.
- `README.md` — the `js/cart.js` and `js/global.js` rows cover the two CTAs.
- Webflow — IDs already published. Footer SHA after commit.
- Checkout URL / Shopify checkout redirect is not in this change.
