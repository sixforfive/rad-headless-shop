## Context

See proposal.md for motivation. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- `closeDrawer` already lives in `js/global.js` and is bound to `#cart-close`. `openDrawer` is already called from `js/cart.js`.
- `renderCart` already branches on `cart?.lines?.nodes` length: empty path returns after showing `.empty-cart`; lines path shows `.cart-list`. Boot, add, update, and remove already call it.
- `.is-none` is not a global hide. `css/global.css` only pairs it with listed classes. `#checkout-btn` is not in that list.
- Published `.checkout-wrapper` already has `#keep-shopping` and `#checkout-btn`. Checkout redirect is unwired.

## Goals / Non-Goals

**Goals:**

- Bind `#keep-shopping` to the existing `closeDrawer` path.
- Toggle `#checkout-btn` visibility from `renderCart` on the empty-list and lines paths.

**Non-Goals:**

- Shopify checkout URL or `#checkout-btn` navigation.
- CSS for `.is-none` on `#checkout-btn`.
- A new close helper.
- Changing `#cart-close`, backdrop, or navbar chrome.

## Decisions

**Bind `#keep-shopping` in `js/global.js` next to `cartClose`.** Closing is drawer chrome, not cart data. `closeDrawer(event)` already `preventDefault`s. Alternative considered: bind in `js/cart.js`. Rejected — `cart.js` would duplicate the close listener that `#cart-close` already uses.

**Toggle `#checkout-btn` with `style.display` in `renderCart`.** Empty-list return: `display = "none"`. Lines path: `display = ""` so the published stylesheet display returns. Optional chaining when the node is missing. Alternative considered: `.is-none`. Rejected — that class only hides listed combos in `css/global.css`. Alternative considered: `hidden`. Rejected — empty vs list in this file already uses `style.display`.

**Write the toggle on both `renderCart` branches.** Boot, add, update, and remove already call `renderCart`. The empty-list path returns before clones, so the hide must run there. The show must run on the lines path. Alternative considered: a separate helper called from each caller. Rejected — four extra call sites for one display write.

Functions changed:

- `js/global.js` — `#keep-shopping` click → `closeDrawer`
- `js/cart.js` `renderCart` — hide or restore `#checkout-btn` from lines length

## Risks / Trade-offs

- [`#checkout-btn` missing] → No-op. IDs are already published.
- [Empty cart flashes Checkout until `renderCart` runs] → Accepted. No Webflow default hide in this change.
- [`display = ""` restores the published display] → Accepted. Same restore pattern as leaving stylesheet control on the node.

## Migration Plan

1. Implement `js/global.js` and `js/cart.js`; update `README.md`; point the Footer tags at the new SHAs; publish.
2. Open an empty cart: `#checkout-btn` hidden, `#keep-shopping` visible; click Keep shopping: drawer closes like `#cart-close`.
3. Add a line: `#checkout-btn` visible. Remove the last line: `#checkout-btn` hidden, drawer stays open.
4. Rollback: previous Footer SHAs.
