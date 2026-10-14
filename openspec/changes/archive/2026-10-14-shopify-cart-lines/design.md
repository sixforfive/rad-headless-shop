## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- `shopifyFetch` lives in `js/shopify.js`. `fillLine`, `renderCart`, `addCartLines`, and `readCartId` live in `js/cart.js`. Shared `CART_FIELDS` is already used by `CART_QUERY` and `CART_LINES_ADD`.
- Published template: `.cart-product[data-cart-line-template]` with `<select data-cart-quantity>` options 1–5 inside `.qnt-box`, and `data-cart-remove` on the row's `.link-secondary` (a `div`, not an anchor). `data-cart-line-id` is not a Webflow attribute.
- `hydrateVariants` collects every `[data-variant-id]` on the page. Cart rows must not carry that attribute.

## Goals / Non-Goals

**Goals:**

- Line `id` on the shared cart selection and on each cloned row.
- Remove and quantity select call Storefront mutations and re-render from the mutation cart.
- Fail closed, same as add: no markup change, no error UI.

**Non-Goals:**

- Checkout redirect, badge, error/loading UI.
- Creating a cart in order to update or remove.
- Changing `js/shopify.js` or `js/global.js`.
- Webflow markup (already published).

## Decisions

**Stay in `js/cart.js`.** Line edit is cart behavior. Alternative considered: a fourth Footer file. Rejected — `cart.js` already owns render and add.

**Line id, not variant id.** `fillLine` writes `data-cart-line-id` from `line.id` onto the cloned `.cart-product`. `cartLinesUpdate` and `cartLinesRemove` need the cart line gid. Alternative considered: `data-variant-id` on the row. Rejected — `hydrateVariants` would fetch those wrappers, and variant id cannot remove a line.

**`CART_FIELDS` gains `id` on each line node.** Same selection on query, add, update, and remove, so every mutation can re-render without a follow-up query. Alternative considered: refetch `cart(id)` after update/remove. Rejected — extra round trip; add already returns the cart.

**`fillLine` sets `select.value` on `[data-cart-quantity]`.** The published control is a native select. Keep `textContent` only if the node is not a `SELECT`. Alternative considered: always `textContent`. Rejected — that would wipe the options.

**`readCartId()` then mutate. No `ensureCart`.** Lines only exist on an already-stored cart. Creating a cart to remove from it is wrong. Missing id is a no-op. Alternative considered: `ensureCart` like add. Rejected — add needs a cart; edit does not.

**`updateCartLine` / `removeCartLine` return the cart object or `""`.** Same fail-closed contract as `addCartLines`: no cart, `userErrors`, or throw → `""`. Caller renders only on a truthy cart.

**Document click on `[data-cart-remove]`, document `change` on `[data-cart-quantity]`.** Ignore events whose target is inside `[data-cart-line-template]`. Closest `.cart-product` supplies the line id. Alternative considered: bind each clone in `renderCart`. Rejected — `renderCart` replaces rows; one listener survives.

**Successful edit does not call `openDrawer`.** The visitor is already in the drawer. Last line removed still uses `renderCart`'s empty state. Alternative considered: close the drawer when empty. Rejected — the spec keeps it open.

Functions added or changed in `js/cart.js`:

- `CART_FIELDS` — line `id`
- `fillLine` — `data-cart-line-id`; select value when `[data-cart-quantity]` is a `SELECT`
- `CART_LINES_UPDATE` / `CART_LINES_REMOVE` — shared cart selection
- `updateCartLine` / `removeCartLine` — cart object or `""`
- `onCartQuantityChange` / `onCartRemove` — ignore template; no id → no request
- `bindLineControls` — document click and change
- boot — `bindLineControls()` next to `bindAddToCart()`

GraphQL additions:

```
lines.nodes.id
```

```
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart { CART_FIELDS }
    userErrors { field message }
  }
}

mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart { CART_FIELDS }
    userErrors { field message }
  }
}
```

Published Webflow (already live):

| Where | Attribute |
|---|---|
| quantity `<select>` inside `.qnt-box` | `data-cart-quantity` |
| `.link-secondary` (remove) | `data-cart-remove` |
| cloned `.cart-product` (JS) | `data-cart-line-id` |

Do not put `data-variant-id` or `id="quantity"` on cart rows.

## Risks / Trade-offs

- [Select options are 1–5] → Accepted. Product add uses the same range; a line qty outside that set would not match an option.
- [Failed update leaves the select showing the new value until the next successful render] → Accepted. Fail closed does not rewrite markup; the next successful render or reload restores Shopify qty.
- [Missing line id on a clone] → No mutation. `fillLine` must write `line.id`.

## Migration Plan

1. Implement `js/cart.js` and the `README.md` row; commit.
2. Point the Footer `js/cart.js` tag at the new SHA; publish.
3. With a line in the drawer, change qty to `2`: confirm `cartLinesUpdate` and the row amount / subtotal.
4. Click remove on one of two lines: confirm that line gone, drawer still open.
5. Click remove on the last line: confirm empty state, drawer still open.
6. Rollback: previous `js/cart.js` SHA. Marked Webflow controls stay inert.
