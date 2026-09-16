## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- Shared `CART_FIELDS` is already used by `CART_QUERY`, `CART_LINES_ADD`, `CART_LINES_UPDATE`, and `CART_LINES_REMOVE`. Restore and successful mutations already call `renderCart`, which stores the payload on `restoredCart`.
- `#checkout-btn` is already shown or hidden from line count. `#keep-shopping` is bound in `js/global.js`. `#error-no-reach` already exists in `.cart-drawer`. `showCartError` and `setCartBusy` already live in `js/cart.js`.
- Checkout is a redirect, not a Storefront mutation. Shopify checkout re-checks inventory after navigation.

## Goals / Non-Goals

**Goals:**

- `checkoutUrl` on the shared cart selection.
- `#checkout-btn` click navigates to that URL in the same window.
- Missing URL shows `#error-no-reach` in `.cart-drawer`.
- Checkout click ignored while `cartBusy`; `#checkout-btn` in the `aria-busy` set.

**Non-Goals:**

- A fifth error node.
- Refetch on click.
- Clearing `rad-cart-id` on click.
- Changing empty-cart hide of `#checkout-btn`.
- Changing `js/shopify.js`, `js/global.js`, or CSS.
- Webflow markup (already published).

## Decisions

**Stay in `js/cart.js`.** Checkout is cart behavior. Alternative considered: `js/global.js` next to `#keep-shopping`. Rejected — the URL lives on `restoredCart`, not in drawer chrome.

**`CART_FIELDS` gains `checkoutUrl`.** Same selection on query, add, update, and remove, so `restoredCart` always has the URL. Alternative considered: refetch `cart(id)` on click. Rejected — extra round trip; item 13 is the URL already on the cart object.

**`onCheckout` uses `restoredCart.checkoutUrl`.** `preventDefault`, then if `cartBusy` return, if no URL `showCartError(.cart-drawer, "no-reach")`, else `window.location.assign(url)`. Alternative considered: set `href` on the node in `renderCart` and let the browser navigate. Rejected — `#checkout-btn` is already a published control whose `href` is not the Shopify URL; a click handler matches add/qty/remove.

**Reuse `#error-no-reach`.** Missing URL is the same class of failure as a missing cart payload. Alternative considered: a fifth Webflow node. Rejected — sold-out, stock, and no-item do not apply, and a new notice is not needed for this path.

**Do not clear `rad-cart-id`.** Abandoned checkout should keep the cart. A completed checkout already comes back as `cart(id) → null` on the next restore. Alternative considered: clear on click. Rejected — a back-button from checkout would lose lines.

**`setCartBusy` includes `#checkout-btn`.** Same `aria-busy` set as add/qty/remove. Alternative considered: leave checkout clickable during a mutation. Rejected — navigating mid-update can send the visitor to a stale checkout.

Functions added or changed in `js/cart.js`:

- `CART_FIELDS` — `checkoutUrl`
- `onCheckout` — busy lock; missing URL → `#error-no-reach`; else `location.assign`
- `bindCheckout` — document click on `#checkout-btn`
- `setCartBusy` — `#checkout-btn` in the `aria-busy` selector
- boot — `bindCheckout()` next to `bindLineControls()`

GraphQL addition:

```
checkoutUrl
```

## Risks / Trade-offs

- [`#checkout-btn` missing] → No-op. ID is already published.
- [Stale `checkoutUrl` after a line change that has not returned] → `cartBusy` blocks the click until the mutation writes the new cart onto `restoredCart`.
- [Shopify checkout then rejects stock] → Accepted. Inventory is re-checked on Shopify's checkout page, not in this drawer.

## Migration Plan

1. Implement `js/cart.js` and the `README.md` row; commit.
2. Point the Footer `js/cart.js` tag at the new SHA; publish.
3. Add a line, click `#checkout-btn`: confirm navigation to Shopify checkout in the same window; `rad-cart-id` still set.
4. With lines, go offline, click `#checkout-btn` after clearing `checkoutUrl` from the in-memory cart: `#error-no-reach` in `.cart-drawer`, no navigation.
5. Click `#checkout-btn` while a qty update is in flight: no navigation.
6. Rollback: previous `js/cart.js` SHA. `#checkout-btn` stays visible but inert.
