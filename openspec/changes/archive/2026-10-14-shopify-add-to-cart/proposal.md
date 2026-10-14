## Why

`shopify-cart-init` gives the storefront a cart id, but nothing puts a product into that cart. Add to cart on `/product/{slug}` and `/merch/{slug}` is two `[data-add-to-cart]` anchors that currently go nowhere (`href="#"`). Until they call `cartLinesAdd`, checkout and the drawer have nothing to show.

## What Changes

- `js/cart.js` wires a document click on `[data-add-to-cart]`: read the variant from the nearest `[data-variant-id]`, read quantity from `#quantity` (or `[data-quantity]` if present), `ensureCart()`, then `cartLinesAdd`.
- Quantity is the digit shown in `#quantity`. Published HTML has no `data-quantity` attribute; the control is a `.qty-dropdown` with a numeric child, not a Webflow `w-dropdown`.
- Failed add (missing variant, failed `ensureCart`, `userErrors`, network throw) does nothing visible. No drawer render, badge, error UI, or checkout redirect.

## Capabilities

### New Capabilities

- `shopify-add-to-cart`: add a merchandise line to the current Shopify cart from a `[data-add-to-cart]` click, including how variant id and quantity are read from the published DOM.

### Modified Capabilities

- None. `shopify-cart-init` and `shopify-variant-hydration` keep their requirements; this change reuses `ensureCart`, `shopifyFetch`, and `toGid`.

## Impact

- `js/cart.js` — gains the add mutation, quantity read, and the click binding. Identity helpers stay as they are.
- `README.md` — the `js/cart.js` row covers add to cart.
- `js/shopify.js` — unchanged.
- Webflow — no markup change. `js/cart.js` is already in the Footer after `js/shopify.js`.
- `/shop` and `/merch` listings have no `[data-add-to-cart]`; the listener is inert there.
- Later changes (drawer, line update/remove, badge, error UI, checkout) build on a cart that can hold lines; none of them are in this change.
