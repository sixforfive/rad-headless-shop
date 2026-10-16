## Context

See proposal.md. Cart times live next to the menu times in `js/global.js`. `CART_REVEAL_DURATION` is already the literal `0.375`. `CART_REVEAL_ORDER3_DURATION` is still `MENU_REVEAL_ORDER3_DURATION / 2` (`0.15`). `CART_LEAVE_TAIL_MS` is `MENU_LEAVE_TAIL_MS / 2` (`300`), and `closeDrawer` subtracts it from `cartRevealReverseMs()` before `fadeDrawerOut`. `playCartReveal(true)` calls `startCartReveal` in the same turn the shell gets `is-visible`.

`setRevealTiming` writes `--menu-reveal-duration` per node. `css/global.css` still falls back to `0.735s` on `.cart-product` and `0.15s` on `.cart-list-titles` / `.cart-bottom`. The shared `.menu-reveal-line-inner` rule falls back to `1.47s`. `onCartRemove` in `js/cart.js` sets the row to `0.375s` and the text inside it to `0.735s`.

`const` in `global.js` is not visible to `cart.js`. `function` declarations are. Both files are Footer scripts. A click handler runs after both have loaded.

## Goals / Non-Goals

**Goals:**

- One literal block for the cart clock. Menu constants stay menu-only.
- `CART_OPEN_GAP` and `CART_CLOSE_GAP` are the only waits around the sequence.
- CSS and remove paint from that block. No second number.

**Non-Goals:**

- Changing the menu clocks, the overlay `0.45s` / `0.9s`, empty-cart close, or reduced motion.
- A timeline library. Webflow markup. A new dependency.

## Decisions

### One literal block, in seconds

```js
const CART_REVEAL_DURATION = 0.375;
const CART_REVEAL_ORDER3_DURATION = 0.15;
const CART_REVEAL_GAP = 0.375;
const CART_OPEN_GAP = 0;
const CART_CLOSE_GAP = 0;
```

Delete `CART_LEAVE_TAIL_MS`. `writeCartRevealTiming` and `cartRevealReverseMs` keep using the first three. Alternative considered: leave the title duration as `MENU_REVEAL_ORDER3_DURATION / 2`. Rejected — a menu edit would move the cart.

### Open wait sits in front of `startCartReveal`

`openDrawer` still adds `is-visible` immediately. `playCartReveal(true)` still waits for row images, then:

- `CART_OPEN_GAP` is `0`: call `startCartReveal` in that same turn.
- Otherwise `setTimeout` for `CART_OPEN_GAP * 1000`, then `startCartReveal` only if `cartRevealToken` and `activeDrawer === "cart"` still match.

Empty cart and reduced motion return before the wait. Alternative considered: add the gap onto every CSS delay and add `is-revealed` immediately. Rejected — a close during the gap would reverse a sequence that had already been armed.

### Close wait is added, not subtracted

The cart branch in `closeDrawer` becomes `cartRevealReverseMs() + CART_CLOSE_GAP * 1000`. The menu branch stays `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS`. Empty cart and reduced motion still call `fadeDrawerOut` immediately. Alternative considered: keep `CART_LEAVE_TAIL_MS` and add the gap beside it. Rejected — a negative tail and a positive gap describe the same moment twice.

### CSS reads two variables written once

At startup, write on `.cart-drawer`:

- `--cart-row-duration` from `CART_REVEAL_DURATION`
- `--cart-title-duration` from `CART_REVEAL_ORDER3_DURATION`

`.cart-product` height, padding, and border use `--cart-row-duration`. `.cart-drawer .menu-reveal-line-inner` uses it for its transform and opacity duration. `.cart-list-titles` and `.cart-bottom` use `--cart-title-duration`. Drop the numeric fallbacks on those cart rules. The menu rule keeps its `1.47s` fallback. Eases stay in CSS.

`setRevealTiming` still writes `--menu-reveal-delay` from the sequence. Cart duration on screen comes from the two drawer variables, so a per-node duration cannot override them.

`onCartRemove` stops setting `--menu-reveal-duration`. It still sets `--menu-reveal-delay` to `0s` and adds `is-removing`. Alternative considered: a `cartRowRevealSeconds()` function for `cart.js` to copy onto the row. Rejected — that is a second write of a number the CSS already has.

## Risks / Trade-offs

- [Close used to fade `300ms` early] → With `CART_CLOSE_GAP` at `0`, the shell starts as the last stage ends. Raise that constant to hold the shell. There is no early fade left to tune.
- [`--cart-row-duration` missing] → The cart transition duration is invalid and the row snaps. `global.js` writes the variables at startup, before a click can remove a row.
- [Open gap timer vs a second open] → `cartRevealToken` already invalidates the image wait. The gap timer uses the same check.

## Migration Plan

1. Ship `js/global.js`, `css/global.css`, and `js/cart.js`.
2. Rollback: revert those three files.
