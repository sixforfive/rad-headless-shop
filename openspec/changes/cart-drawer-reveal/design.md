## Context

See proposal.md. `.drawer-wrapper` already fades over `0.45s` and blurs over `0.9s`. Menu stages live in `js/global.js`: line move `1.47s` with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`, order 3 `0.3s` `ease-out` over `--menu-reveal-distance` (`4px`), order 3 starting `0.75s` after the last line stage starts, shell fade `MENU_LEAVE_TAIL_MS` (`600`) before the reverse ends. `closeDrawer` fades the cart immediately. `renderCart` in `js/cart.js` reclones every `.cart-product` and writes `textContent` on `[data-cart-sku]` and `[data-cart-line-price]`.

Published cart, no markup edit: `.cart-list-titles`, `.cart-product` (border-top, 8-column grid), `.cart-prod-img_dummy` (`width: 100%`), `.cart-product_price` (column, `space-between`), `.qnt-box` (`1.5rem`), `.cart-summary` (border-top), `.cart-bottom` (flex-end of `.cart-wrapper`). `.cart-list` scrolls.

## Goals / Non-Goals

**Goals:**

- One class toggle, `.cart-drawer.is-revealed`, same pattern as the menu.
- Delays written in JS from the line count. CSS holds the eases.
- Remove waits for the row transition, then `renderCart`.

**Non-Goals:**

- A timeline library.
- Replaying the open when a line is added or a quantity changes while the cart is already open.
- Reversing the cart when the menu replaces it.
- Webflow markup or a new dependency.

## Decisions

### Shared clocks

Titles use the order-3 move: `0.3s`, `ease-out`, from `-4px`, fade. Each product is one `1.47s` line ease for image size and for the SKU, price, and remove masks together. Product `i` starts at `0.3 + i * 1.47`. Subtotal masks start at `0.3 + n * 1.47`. Bottom starts `0.75s` after that, `0.3s`, from `+4px`, fade. Close is those stages backward: bottom, subtotal, products last to first, titles. Shell fade at `cartRevealReverseMs() - 600`. Empty cart (`n = 0`, list hidden) does not run the sequence; close fades immediately. Alternative considered: a separate delay before the text mask so it finishes before the image hits 100%. Rejected — the line ease is still ~23% at 30% of the time and ~83% at 50%, which is the storyboard.

### Image size pushes the summary

`.cart-prod-img_dummy` transitions `width` `0 → 100%` and `height` `0 → var(--cart-img-h)` on one clock so the ratio holds. `--cart-img-h` is the image's `offsetHeight` at `width: 100%` and `height: auto`, measured after the cart panel is `display: flex` and before `is-revealed`. The row grows, so `.cart-summary`'s border and the next row's border move with flow. Alternative considered: `transform: scale`. Rejected — it does not push the border.

### Masks stay out of the row height

JS wraps `[data-cart-sku]`, `[data-cart-line-price]`, `[data-cart-remove]`, the `[SUBTOTAL]` node, and `[data-cart-subtotal]` in `.menu-reveal-line` / `.menu-reveal-line-inner` once. Those masks are `position: absolute` in the cell (price at the top, remove at the bottom). `fillLine` writes the inner when the wrap exists. The quantity box stays in flow. Alternative considered: `translateY(100%)` on the grid cell. Rejected — the cell stretches to the image, so the travel would be the row height, not one line.

### Remove collapses the hole

`.cart-product.is-removing` runs the same `1.47s` ease back to image size `0`, masks down, `padding-bottom: 0`, and `.qnt-box` height `0`. `onCartRemove` keeps the successful cart and calls `renderCart` on the image `transitionend`. A failed remove drops `is-removing`. Reduced motion renders immediately. Alternative considered: `renderCart` at the start of the click. Rejected — the row would be gone before it could shrink.

### Already open snaps

If `.cart-drawer` has `is-revealed`, `renderCart` rebuilds and sets each new image to its measured height with no from-state. `playCartReveal(true)` runs only from `openDrawer`. Switching to the menu still sets the cart panel to `display: none` with no reverse.

### Reduced motion

The new selectors join the existing `prefers-reduced-motion` block: `transform: none`, `transition-duration: 0s`. `playCartReveal(true)` adds `is-revealed` without measuring a from-state. Close fades the shell immediately.

## Risks / Trade-offs

- [Image not decoded when measured] → Height is `0` and the row never grows. Measure after `width: 100%`; if `offsetHeight` is `0` and `naturalHeight` is known, use column width times `naturalHeight / naturalWidth`.
- [Qty box is `1.5rem` in flow] → The row cannot start shorter than that box. Accepted. It matches the first storyboard frame.
- [Close interrupted by another open] → `clearMenuRevealHide` already drops the pending shell fade. The cart uses that same timer.
- [`fillLine` `textContent` wipes a mask] → Write the inner when `.menu-reveal-line-inner` is present.

## Migration Plan

1. Ship `css/global.css`, `js/global.js`, and `js/cart.js`.
2. Rollback: revert those three files.

## Open Questions

None.
