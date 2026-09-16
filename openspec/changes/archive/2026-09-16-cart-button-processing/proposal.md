## Why

Add and checkout already lock with `aria-busy` while a cart mutation is in flight, but the published labels stay put, so the wait looks like a no-op.

## What Changes

- While `cartBusy` is true, `[data-add-to-cart]` and `#checkout-btn` show a `1em` spinner before the text `PROCESSING`.
- When the request finishes, those controls restore their published labels.
- Qty and remove stay `aria-busy` only. Checkout with a URL still redirects immediately; it shows PROCESSING only when a mutation is already in flight.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shopify-cart-errors`: while a cart request is in flight, add-to-cart and checkout show spinner + `PROCESSING` in addition to `aria-busy`.

## Impact

- `js/cart.js` — `setCartBusy` swaps and restores labels on `[data-add-to-cart]` and `#checkout-btn`.
- `css/global.css` — `::before` spinner on those controls when `aria-busy="true"`; reduced-motion stops the spin.
- `README.md` — the `js/cart.js` row covers the processing label.
- `js/shopify.js`, `js/global.js` — unchanged.
- Webflow — no markup change. Footer `js/cart.js` and `css/global.css` SHAs after commit.
