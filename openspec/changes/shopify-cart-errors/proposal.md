## Why

Cart mutations fail closed and stay silent. A double-click adds twice, and a sold-out or dead cart looks like a no-op. Webflow now has `.error-wrapper` copy for the four visitor-facing failures.

## What Changes

- Failed `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, and `cartLinesRemove` show the matching published node (`#error-no-reach`, `#error-soldout`, `#error-stock`, `#error-no-item`) with fade-in and move-up.
- Add failures show inside `.layer-cta .error-wrapper`. Qty and remove failures show inside `.cart-drawer .error-wrapper`. Success hides that wrapper's four nodes. Copy stays in Webflow.
- While a cart request is in flight, add, qty, and remove controls are inert (`aria-busy`). Missing variant id stays silent.

## Capabilities

### New Capabilities

- `shopify-cart-errors`: map Storefront failures to the four published error nodes, show them on the surface that fired, hide them on success, and lock cart controls during the request.

### Modified Capabilities

- `shopify-add-to-cart`: a failed add still adds no line, but now shows the mapped error in `.layer-cta`.
- `shopify-cart-drawer`: a failed qty/remove still leaves drawer markup unchanged, but now shows the mapped error in `.cart-drawer`.

## Impact

- `js/cart.js` — `userErrors { code field }`, error kind from mutations, `showCartError` / `hideCartErrors`, `cartBusy` in the three handlers.
- `css/global.css` — hide `.error-wrapper [id^="error-"]` with opacity and `translateY`; `.is-visible` fades and moves up.
- `README.md` — the `js/cart.js` row covers error UI and the busy lock.
- `js/shopify.js`, `js/global.js` — unchanged.
- Webflow — already published: `.error-wrapper` in `.layer-cta` (product/merch templates) and `.cart-drawer`, four nodes with those ids. Nodes must stay in layout (not `display: none`). Footer `js/cart.js` SHA after commit.
- Checkout redirect is not in this change.
