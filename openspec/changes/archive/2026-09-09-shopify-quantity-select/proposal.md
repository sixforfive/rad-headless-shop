## Why

Add to cart already sends a quantity, but `readQuantity` does not read a native `<select>`. The product Embed is a `<select data-quantity>` whose options are children, so walking digit-only children takes the last option (e.g. 5), not the selected `.value`.

## What Changes

- `readQuantity` in `js/cart.js` reads `select.value` when the quantity control is a native select or contains one.
- Existing fallbacks stay: `.w-dropdown-toggle`, then last digit-only child, then `1`.
- No Webflow markup change. The Embed is already on the product template.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shopify-add-to-cart`: quantity comes from the selected value of a native `<select>`, not from option text.

## Impact

- `js/cart.js` — `readQuantity` only.
- Webflow — unchanged.
- `js/shopify.js`, CSS, README — unchanged.
