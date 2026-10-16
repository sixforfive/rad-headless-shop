## Context

See proposal.md. `.cart-product` is published with `padding-bottom: var(--_layout---spacing--space-100)`. With `box-sizing: border-box`, a specified `height: 0` cannot get smaller than that padding, so the row never starts at zero. The image is still driven from `width`/`height` `0` to `--cart-img-h` in `css/global.css`, and `is-removing` scales it back to zero.

## Goals / Non-Goals

**Goals:**

- The row clip is the only reveal of the image.
- The closed row has no bottom padding, so `height: 0` is a real zero.
- Webflow markup and the published padding rule stay.

**Non-Goals:**

- Changing the cart stage clocks.
- Editing `.cart-product` in Webflow.

## Decisions

### Padding is overridden here

The closed rule sets `padding-bottom: 0` on `.cart-product:not([data-cart-line-template])`. The revealed rule sets it back to `var(--_layout---spacing--space-100)`. Both `height` and `padding-bottom` already share the row’s transition. `is-removing` already sets `padding-bottom: 0` and `height: 0`. Alternative considered: remove the padding in Webflow and add a spacer. Rejected — the spacing stays published, and the closed state is the only thing that must drop it.

### The image does not animate size

Delete the from-state `width`/`height: 0` on `.cart-prod-img_dummy`, the revealed `height: var(--cart-img-h)`, and the `is-removing` image size. Webflow’s `width: 100%` and the image’s own height stay. `overflow: hidden` on the row uncovers that full image as `height` goes from `0` to `--cart-row-h`. Alternative considered: keep the scale because the open already looks like a wipe. Rejected — the scale is still running, and the row clip is the reveal.

### Measure the row with padding and a full image

`measureCartRow` reads `offsetHeight` while `height` is `auto`, `padding-bottom` is the Webflow value, and the image is at its normal size. It stores `--cart-row-h`, then clears the inline overrides so the first frame is height `0` and padding `0`. `--cart-img-h` is no longer part of the reveal.

## Risks / Trade-offs

- [A later Webflow padding change] → The revealed rule names the same variable, so it follows. The closed rule stays `0`.
- [The measured height includes a border] → `offsetHeight` is the border box, which is what `height` sets under `border-box`.

## Migration Plan

1. Ship `css/global.css`, `js/global.js`, and `js/cart.js`.
2. Rollback: revert those three files.

## Open Questions

None.
