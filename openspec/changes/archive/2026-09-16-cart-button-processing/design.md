## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules.
- `setCartBusy` already sets `cartBusy` and `aria-busy="true"` on `[data-add-to-cart]`, `[data-cart-quantity]`, `[data-cart-remove]`, and `#checkout-btn` around `ensureCart` / mutate, cleared in `finally`.
- Add-to-cart is two published anchors, both `[data-add-to-cart]`. Checkout is `#checkout-btn`. Qty and remove stay label-unchanged.
- `#checkout-btn` click with a URL already `location.assign`s with no fetch.

## Goals / Non-Goals

**Goals:**

- Swap add and checkout labels to `PROCESSING` for the same window `setCartBusy(true)` already covers.
- Restore the idle labels in `setCartBusy(false)`.
- Draw a `1em` spinner with CSS `::before` on those two controls while `aria-busy="true"`.

**Non-Goals:**

- Changing `onCheckout` or refetching `checkoutUrl`.
- PROCESSING on qty or remove.
- Injecting spinner markup in Webflow or JS.
- Changing `js/shopify.js` or `js/global.js`.

## Decisions

**Stay in `setCartBusy`.** The busy window is already the wait. Alternative considered: swap labels in each handler. Rejected — four call sites would duplicate restore in `finally`.

**Store the idle label on the node.** On `busy === true`, if `data-cart-idle-label` is missing, write `textContent.trim()` there, then set `textContent` to `PROCESSING`. On `busy === false`, restore from that attribute and remove it. Target `[data-add-to-cart], #checkout-btn` only. Alternative considered: a module-level map of original strings. Rejected — two add buttons and checkout are already in the DOM; the attribute survives as long as the node does.

**Spinner is CSS `::before`, not a child node.** `[data-add-to-cart][aria-busy="true"]::before` and `#checkout-btn[aria-busy="true"]::before`: `content: ""`, `inline-block`, `width`/`height: 1em`, `currentColor` ring, `animation` rotate. `margin-inline-end` separates it from `PROCESSING`. Alternative considered: insert an `<span>` in JS. Rejected — published button markup stays Webflow's.

**Reduced motion stops the spin.** Existing `prefers-reduced-motion` only sets `transition-duration: 0s`, which does not kill a keyframe. Add `animation: none` on those `::before` rules. Alternative considered: leave the spinner spinning. Rejected — it is the only new motion this change adds.

Functions changed in `js/cart.js`:

- `setCartBusy` — also swap/restore `[data-add-to-cart]` and `#checkout-btn` text

## Risks / Trade-offs

- [Duplicate `#add-to-cart` ids] → Label swap uses `[data-add-to-cart]`, same as the click binding.
- [Empty published label] → `textContent.trim()` stores `""`; restore is still that empty string.
- [Checkout redirect while idle] → `onCheckout` does not call `setCartBusy`; no PROCESSING flash.

## Migration Plan

1. Implement `js/cart.js`, `css/global.css`, and the `README.md` row; commit.
2. Point the Footer `js/cart.js` and `css/global.css` tags at the new SHAs; publish.
3. On `/product/{slug}`, click add: both add controls show spinner + `PROCESSING` until the drawer opens, then the published label returns.
4. With lines, change qty: `#checkout-btn` shows spinner + `PROCESSING` until the line updates, then `CHECKOUT` (or the published label) returns.
5. Click `#checkout-btn` with a URL and no mutation in flight: immediate redirect, no PROCESSING.
6. Rollback: previous SHAs. Labels stay published text.
