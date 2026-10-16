## Context

See proposal.md. An empty open in `playCartReveal` drops `is-revealed`, waits `DRAWER_SHELL` (`0.45`), then adds it. `.empty-cart` opacity eases over `--cart-empty-duration` (`CART_EMPTY_FADE`, `0.3s`) with `ease-out`. `renderCart` shows `.empty-cart` with `display: flex` while `is-revealed` is already on, so that opacity is already `1`.

## Goals / Non-Goals

**Goals:**

- Reuse `DRAWER_SHELL` and `CART_EMPTY_FADE`. No new duration and no new ease.
- Fade only `.empty-cart` after the last row's shrink, while the drawer stays `is-revealed`.

**Non-Goals:**

- Fading `.cart-bottom` out and back in.
- Replaying the title, row, or subtotal sequence.
- Changing the empty open, the empty close, or a remove that leaves other lines.

## Decisions

### Hold `is-revealed` and release an inline opacity

`renderCart`'s empty branch, only when the drawer is already `is-revealed` and real line rows were just removed, snaps `.empty-cart` to opacity `0` with `transition: none`, flushes, restores the CSS transition, then after `DRAWER_SHELL * 1000` clears the inline opacity. The revealed rule's opacity `1` then runs the existing `0.3s` `ease-out`. `display: none` does not transition, so the snap has to land before the first paint of `display: flex`.

A token in `js/global.js` owns that timeout, same shape as `snapCartReveal`. `playCartReveal` bumps the token and clears the inline opacity, so a close or a new open during the wait owns the copy again. The lines branch of `renderCart` bumps it too.

Reduced motion skips the snap and the wait. `onCartRemove` already renders at once in that case, and `is-revealed` leaves the copy at rest.

Alternative considered: drop `is-revealed` and add it again after `0.45s`. Rejected — the empty not-revealed rule also sets `.cart-bottom` to opacity `0`, so the bar would leave and return.

Alternative considered: a new CSS animation class. Rejected — the open path is the class toggle plus the opacity transition. A second animation would drift from `DRAWER_SHELL` and `CART_EMPTY_FADE`.

## Risks / Trade-offs

- [Inline opacity `0` left on `.empty-cart`] → The next empty open stays invisible. `playCartReveal` and a render that shows lines clear it and bump the token.
- [Close during the `0.45s`] → The timeout must not clear the inline opacity after `is-revealed` is gone. The token check covers that. The copy is already at `0`, so the empty close has nothing to fade out. Accepted.

## Migration Plan

1. Ship `js/global.js` and `js/cart.js`.
2. Rollback: revert those two files.
