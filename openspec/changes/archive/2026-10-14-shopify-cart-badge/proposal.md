## Why

The navbar cart control still shows a dummy `2`. `totalQuantity` is already on every cart payload, and `renderCart` already runs on load and after add, update, and remove.

## What Changes

- `renderCart` writes `totalQuantity` into every `[data-cart-count]` node. Missing cart or empty lines write `0`.
- Webflow marks the dummy `2` inside `#cart-open .link-sec-brack` with `data-cart-count`.
- A failed mutation does not rewrite the count.

## Capabilities

### New Capabilities

- `shopify-cart-badge`: show Shopify `totalQuantity` on the marked navbar count after restore and after a successful cart mutation.

### Modified Capabilities

- (none)

## Impact

- `js/cart.js` — `renderCart` writes `[data-cart-count]` before the empty-list return.
- `README.md` — the `js/cart.js` row covers the navbar count.
- `js/shopify.js`, `js/global.js` — unchanged. No new request, no CSS.
- Webflow (manual): `data-cart-count` on the `2` inside `#cart-open .link-sec-brack`. Footer `js/cart.js` SHA after commit.
- Checkout redirect and error/loading UI are not in this change.
