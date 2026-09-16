## Why

`#checkout-btn` is visible when the cart has lines, but the click still goes nowhere. Checkout is a redirect to `checkoutUrl` on the Storefront cart object; without that wiring the visitor cannot pay.

## What Changes

- Cart queries and line mutations request `checkoutUrl` on the cart payload.
- Clicking `#checkout-btn` navigates to that URL in the same window.
- Missing `checkoutUrl` shows `#error-no-reach` in `.cart-drawer` and does not navigate. Sold-out, stock, and no-item do not apply — checkout is not a cart mutation.
- While a cart request is in flight, `#checkout-btn` is inert (`aria-busy`) like add, qty, and remove.
- The stored cart id is not cleared on click. Empty-cart hide of the button stays as it is.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shopify-cart-drawer`: `#checkout-btn` navigates to `cart.checkoutUrl` in the same window.
- `shopify-cart-errors`: missing `checkoutUrl` shows `#error-no-reach` in `.cart-drawer`; checkout click is inert while a cart request is in flight.

## Impact

- `js/cart.js` — `checkoutUrl` on `CART_FIELDS`, click binding on `#checkout-btn`, `#checkout-btn` in the `aria-busy` set.
- `README.md` — the `js/cart.js` row covers checkout redirect.
- `js/shopify.js`, `js/global.js`, CSS — unchanged.
- Webflow — `#checkout-btn` and `#error-no-reach` already published. Footer `js/cart.js` SHA after commit.
