## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- `renderCart` already runs on boot (`restoreCart().then(() => renderCart(restoredCart))`) and after a successful `addCartLines`, `updateCartLine`, or `removeCartLine`. Those callers do not render on `""`.
- `CART_FIELDS` already includes `totalQuantity`.
- Published `#cart-open`: `cart` plus `.link-sec-brack` wrapping `[`, a dummy `2`, and `]`. `#cart-open` is hidden while a drawer is open.

## Goals / Non-Goals

**Goals:**

- Write `totalQuantity` into every `[data-cart-count]` from the cart already passed to `renderCart`.
- Empty or missing cart writes `0`.
- Fail closed: failed mutations never reach `renderCart`.

**Non-Goals:**

- Hiding the brackets when the count is `0`.
- A new request, helper, or Footer file.
- Changing `js/shopify.js` or `js/global.js`.
- Checkout redirect or error/loading UI.

## Decisions

**Write the count at the top of `renderCart`.** Boot, add, update, and remove already call it. The empty-list path returns before the subtotal write, so the count must run first. Alternative considered: a separate `renderCount` called from each caller. Rejected — four extra call sites for one `textContent`.

**`querySelectorAll("[data-cart-count]")` then `textContent`.** One published node today; `All` stays correct if a second mark is added. `String(cart?.totalQuantity ?? 0)`. Alternative considered: `getElementById("cart-count")`. Rejected — cart fields already use `data-cart-*` role attributes.

**Show `0`, do not hide.** The published control always shows `[n]`. Alternative considered: hide `.link-sec-brack` at `0`. Rejected — extra CSS and a second mark for a number the markup already displays.

**Webflow marks the dummy `2`.** Same contract as `data-cart-subtotal`. Leave the brackets unmarked.

Functions changed in `js/cart.js`:

- `renderCart` — write `[data-cart-count]` before the empty-list return

Webflow (manual, before the new SHA):

| Where | Attribute |
|---|---|
| the `2` inside `#cart-open .link-sec-brack` | `data-cart-count` |

Leave `#cart-open`, the `cart` label, and the `[` `]` divs unmarked.

## Risks / Trade-offs

- [Attribute missing] → Count stays the dummy `2`. Webflow task is required before publish.
- [Throw on restore shows `0` while `rad-cart-id` is kept] → Accepted. Same keep-on-throw rule; `renderCart(null)` already runs.
- [`#cart-open` is `is-none` while the drawer is open] → Accepted. The count updates while hidden and is visible after close.

## Migration Plan

1. Mark `data-cart-count` on the `2` in the navbar component; publish.
2. Implement `js/cart.js` and the `README.md` row; point the Footer `js/cart.js` tag at the new SHA; publish.
3. Hard-refresh with no `rad-cart-id`: confirm the count is `0` and no cart `graphql.json` beyond hydration.
4. Add to cart on `/product/{slug}`: confirm the count matches `totalQuantity`.
5. Change a line qty and remove the last line: confirm the count updates, then `0`.
6. Reload with `rad-cart-id` and lines: confirm the count matches the restore cart.
7. Rollback: previous `js/cart.js` SHA. Unmarked or leftover `data-cart-count` is inert.
