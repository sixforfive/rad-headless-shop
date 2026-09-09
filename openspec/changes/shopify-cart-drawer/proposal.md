## Why

Add to cart already writes lines into a Shopify cart, but `.cart-drawer` still shows Webflow dummy `.cart-product` rows. `.empty-cart` is `display: none` in published CSS, so an empty cart never shows “Nothing here yet.” The drawer has nothing to render until the cart is queried for lines and cost.

## What Changes

- `js/cart.js` expands the cart query (and the `cartLinesAdd` cart selection) to `id`, `lines` (merchandise, quantity, cost), `cost.subtotalAmount`, and `totalQuantity`.
- On load, when `rad-cart-id` exists, the same restore query fills the drawer. When it does not, no cart request runs; dummy rows are removed and `.empty-cart` is shown.
- After a successful add, the mutation’s cart payload is rendered and the drawer opens through the existing `openDrawer("cart", event)` path.
- Line items are cloned from one Webflow `[data-cart-line-template]` row. Empty cart: `.empty-cart` visible, `.cart-list` hidden, no fake lines.
- Failed add does not open the drawer and does not rewrite lines.

## Capabilities

### New Capabilities

- `shopify-cart-drawer`: render Shopify cart lines into the published `.cart-drawer` markup after restore and after a successful add, including empty state and opening the drawer through `openDrawer`.

### Modified Capabilities

- `shopify-cart-init`: the cart query is no longer `id` only; restore keep/clear/throw rules stay the same.

## Impact

- `js/cart.js` — expanded cart selection, clone-and-fill render, boot render, open after successful add.
- `README.md` — the `js/cart.js` row covers drawer render.
- `js/shopify.js`, `js/global.js` — unchanged. `formatPrice` and `openDrawer` are called from the shared global scope.
- Webflow (manual): one `.cart-product` kept as `data-cart-line-template`; inner `data-cart-sku`, `data-cart-image`, `data-cart-quantity`, `data-cart-line-price`; `data-cart-subtotal` on the summary amount. Extra dummy rows deleted.
- Later changes (line qty/remove, badge, error/loading UI, checkout redirect) are not in this change.
