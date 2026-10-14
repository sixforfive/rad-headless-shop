## Why

The cart drawer renders lines but visitors cannot change quantity or remove a line. Until those controls call Storefront mutations, the only way out of a wrong qty or SKU is checkout or a new cart.

## What Changes

- `js/cart.js` adds line `id` to the shared cart selection, writes it onto each cloned row, and sets the row's quantity `<select>` to the line quantity.
- Clicking `[data-cart-remove]` calls `cartLinesRemove` for that line. Changing `[data-cart-quantity]` calls `cartLinesUpdate` with the selected quantity.
- A successful mutation re-renders the drawer from the returned cart. Removing the last line shows the empty state. The drawer stays open.
- A failed mutation does not rewrite the drawer.

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `shopify-cart-drawer`: cloned rows expose remove and quantity controls that update the Shopify cart and re-render the list.

## Impact

- `js/cart.js` — line `id` on `CART_FIELDS`, `fillLine` writes `data-cart-line-id` and `select.value`, `cartLinesUpdate` / `cartLinesRemove`, click/change binding.
- `README.md` — the `js/cart.js` row covers line update and remove.
- `js/shopify.js`, `js/global.js` — unchanged.
- Webflow — already published: `<select data-cart-quantity>` options 1–5 inside `.qnt-box`, `data-cart-remove` on the row's `.link-secondary`. Footer `js/cart.js` SHA after commit.
- Checkout redirect, badge, and error/loading UI are not in this change.
