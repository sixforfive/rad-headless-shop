## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order.
- `shopifyFetch` and `toGid` live in `js/shopify.js`. `ensureCart` lives in `js/cart.js`, already loaded after `shopify.js` in the Footer.
- Published detail pages: `data-variant-id` on `.page-wrapper`, two `[data-add-to-cart]` anchors (`#add-to-cart-landscape`, `#add-to-cart-desktop`, `href="#"`), `#quantity.qty-dropdown` with a `QTY` label and a numeric child. No `data-quantity`. Listings have wrappers but no add-to-cart.
- Navbar and cart drawer markup already exist. This change does not render them.

## Goals / Non-Goals

**Goals:**

- One click path for both add-to-cart controls, scoped to the nearest `[data-variant-id]` wrapper.
- Quantity from the published `#quantity` control, default `1`.
- `cartLinesAdd` only after `ensureCart()` returns an id.

**Non-Goals:**

- Drawer render, line update/remove, badge, error/loading UI, checkout redirect.
- Expanding `CART_QUERY` beyond `id`.
- Webflow markup changes (`data-quantity` stays optional).
- Disabling the button during the request.

## Decisions

**Stay in `js/cart.js`.** Adding a line is cart behavior. `shopify.js` stays the Storefront client plus hydration. Alternative considered: a new `js/add-to-cart.js`. Rejected — `cart.js` is already on every page after `shopify.js`.

**Document click on `[data-add-to-cart]`.** Both detail-page buttons share the attribute. Delegation survives Webflow re-renders and needs no per-button ids. `preventDefault` stops the `href="#"` jump. Alternative considered: bind each id. Rejected — the attribute is the contract from `shopify-variant-hydration`.

**Variant from `closest("[data-variant-id]")`, then `toGid`.** Same wrapper hydration uses. Both buttons sit inside `.page-wrapper`. Empty or missing id is a no-op, no request.

**Quantity: `[data-quantity]` else `#quantity`.** Hydration named `data-quantity` as a role attribute; production never bound it. Read the optional attribute first so a later Webflow bind works, then `#quantity` so today's HTML works. Parse `.w-dropdown-toggle` text if present (future Webflow dropdown), else the last child whose text is only digits, else `1`. Alternative considered: require `data-quantity` in Webflow. Rejected — add to cart would wait on a republish for a control that already shows `1`.

**`ensureCart()` then `cartLinesAdd`.** First click on a new visit creates the cart; later clicks reuse `rad-cart-id`. Alternative considered: skip restore and pass `readCartId()` straight to add. Rejected — an expired id would fail the add with no recovery.

**Mutation returns `cart { id }` only.** Lines, `totalQuantity`, and `checkoutUrl` wait for the changes that render them. `userErrors` or a throw fail closed, same as `createCart`: no UI, no throw to the page.

Functions added in `js/cart.js`:

- `readQuantity(wrapper)` — `[data-quantity]` else `#quantity`; positive int or `1`
- `addCartLines(cartId, merchandiseId, quantity)` — `CART_LINES_ADD`; return the cart id or `""`
- `onAddToCart(event)` — `preventDefault`; wrapper; `toGid`; `ensureCart`; `addCartLines`
- `bindAddToCart()` — `document` click on `[data-add-to-cart]`

GraphQL:

```
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart { id }
    userErrors { field message }
  }
}
```

Boot: `restoreCart()` then `bindAddToCart()`.

## Risks / Trade-offs

- [Double-click adds twice] → Accepted. Button disable is the error-UI change.
- [Static `#quantity` is always `1` until Webflow ships a real dropdown] → `readQuantity` still maps whatever digit is shown; a later `w-dropdown` is already handled.
- [`ensureCart` re-queries `cart(id)` on every add] → Accepted. Same restore rules as boot; skipping it would add against a possibly expired id.
- [Sold-out click if CSS is bypassed] → Shopify `userErrors`; fail closed, no line.

## Migration Plan

1. Implement `js/cart.js` and the `README.md` row.
2. Point the Footer `js/cart.js` tag at the new commit SHA. Publish.
3. On `/product/{slug}` with no `rad-cart-id`, click Add to cart; confirm `cartCreate` then `cartLinesAdd` with the wrapper's variant gid and quantity `1`.
4. Click the other add-to-cart control; confirm a second `cartLinesAdd` on the same cart id.
5. On `/shop`, confirm no `cartLinesAdd`.
6. Rollback: point the `js/cart.js` tag at the previous SHA.
