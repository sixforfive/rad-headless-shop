## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- `shopifyFetch` and `formatPrice` live in `js/shopify.js`. `openDrawer(kind, event)` lives in `js/global.js`. `fetchCart`, `restoreCart`, `ensureCart`, and `addCartLines` live in `js/cart.js`.
- Published `.cart-drawer`: `.empty-cart` (`display: none` in Webflow CSS), `.cart-list` with titles, dummy `.cart-product` rows, `.cart-summary`, and `.cart-bottom`. `.is-none` is not a global utility for these classes.
- Navbar open/close already uses `openDrawer("cart", event)` from `#cart-open`.

## Goals / Non-Goals

**Goals:**

- One cart selection used by `CART_QUERY` and `cartLinesAdd`, enough to fill the drawer.
- Clone the Webflow template row; empty state via `style.display` on `.empty-cart` and `.cart-list`.
- Open after a successful add only, through `openDrawer("cart", event)`.

**Non-Goals:**

- Line qty update/remove, badge, error/loading UI, checkout redirect.
- A new open/close helper in `js/global.js` or `js/cart.js`.
- CSS for `.is-none` on cart classes.

## Decisions

**Stay in `js/cart.js`.** Rendering the cart is cart behavior. Alternative considered: `js/cart-drawer.js`. Rejected — `cart.js` already boots restore and add; a third Footer tag is not needed.

**Shared cart selection on query and `cartLinesAdd`.** Boot renders from the restore `fetchCart` result (no second load request). A successful add renders the mutation's `cart` (no follow-up query). Alternative considered: keep `CART_QUERY` as `id` only and refetch after add. Rejected — extra round trip for fields the mutation can return.

**`restoreCart` still returns an id string for `ensureCart`.** `fetchCart` already returns the cart object. Keep that object on a module-level `restoredCart` assigned when the query succeeds, cleared when the cart is null; on throw leave it null. Boot: `restoreCart().then(() => renderCart(restoredCart))`. Alternative considered: change `restoreCart` to return the cart object. Rejected — `ensureCart` and the throw path (`return id`) stay as they are.

**`addCartLines` returns the cart object or `""`.** `onAddToCart` already has the click `event`. On a truthy cart: `renderCart(cart)` then `openDrawer("cart", event)`. On `""`: return without opening or rendering. Alternative considered: `document.getElementById("cart-open").click()`. Rejected — that is a second open path.

**Clone `[data-cart-line-template]`, insert before `.cart-summary`.** Remove previous `.cart-list .cart-product:not([data-cart-line-template])` first. Fill `[data-cart-sku]`, `[data-cart-image]`, `[data-cart-quantity]`, `[data-cart-line-price]`; write `[data-cart-subtotal]` on the summary. SKU is `merchandise.sku` or `product.title`. Amounts go through `formatPrice`. Keep the template in the DOM at `display: none`. Alternative considered: `innerHTML` strings. Rejected — the user owns markup in Webflow.

**Empty vs list is `style.display`.** `.empty-cart` is published `display: none` with `flex-flow: column`; show with `flex`, hide with `none`. `.cart-list` is published `display: flex`; hide with `none`, show with `flex`. Alternative considered: `.is-none`. Rejected — Webflow only defines that combo on other classes.

Functions added or changed in `js/cart.js`:

- `CART_QUERY` / `CART_LINES_ADD` — shared cart fields
- `addCartLines` — return the cart object or `""`
- `fillLine(el, line)` — write sku, image, qty, line price
- `renderCart(cart)` — empty state or clones + subtotal
- `onAddToCart` — on success, `renderCart` then `openDrawer("cart", event)`
- boot — `restoreCart().then(() => renderCart(restoredCart))` then `bindAddToCart()`

GraphQL cart selection:

```
id
totalQuantity
cost {
  subtotalAmount { amount currencyCode }
}
lines(first: 50) {
  nodes {
    quantity
    cost { totalAmount { amount currencyCode } }
    merchandise {
      ... on ProductVariant {
        sku
        product { title }
        image { url altText }
      }
    }
  }
}
```

Webflow (manual, before the new SHA):

| Where | Attribute |
|---|---|
| the remaining `.cart-product` | `data-cart-line-template` |
| SKU `.text-meta` inside `.cart-product_sku` | `data-cart-sku` |
| `img` inside `.cart-product_img` | `data-cart-image` |
| qty number inside `.qnt-box` | `data-cart-quantity` |
| price `div` inside `.cart-product_price` (not remove) | `data-cart-line-price` |
| `.cart-summary .text-size-large` | `data-cart-subtotal` |

Delete extra dummy `.cart-product` rows. Leave `.empty-cart`, `.cart-list`, `.cart-bottom` unmarked. Leave remove / checkout unwired.

## Risks / Trade-offs

- [`ensureCart` re-queries the now-larger cart on every add] → Accepted. Restore rules stay; the mutation payload is what gets rendered.
- [Template attributes missing] → No clones; empty state if there are no leftover dummy rows. Webflow task is required before publish.
- [Throw on restore shows empty while `rad-cart-id` is kept] → Accepted. Same keep-on-throw rule; dummy rows still must not remain.
- [More than 50 lines] → Truncated. Limited series; qty/remove is a later change.

## Migration Plan

1. Mark the template and fields in Webflow; delete extra dummy rows; publish.
2. Implement `js/cart.js` and the `README.md` row; point the Footer `js/cart.js` tag at the new SHA; publish.
3. Hard-refresh with no `rad-cart-id`: confirm no cart `graphql.json` beyond hydration, `.empty-cart` visible, no dummy rows, drawer closed.
4. Add to cart on `/product/{slug}`: confirm `cartLinesAdd` cart payload fills the list, drawer opens via the same overlay as `#cart-open`.
5. Reload with `rad-cart-id`: confirm one cart query, lines shown, drawer stays closed.
6. Rollback: previous `js/cart.js` SHA. Unmarked Webflow rows are inert.
