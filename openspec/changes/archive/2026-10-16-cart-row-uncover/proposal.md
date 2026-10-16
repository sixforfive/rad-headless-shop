## Why

The cart row is supposed to uncover from nothing. The image is still scaled from zero, and `.cart-product` never starts at height zero because Webflow’s `padding-bottom: var(--_layout---spacing--space-100)` remains part of the box.

## What Changes

- The product image stays at its full size. The row’s height uncovers it. The image does not scale.
- While a row is closed or leaving, its `padding-bottom` is `0`, so the box can actually be height `0`. The Webflow padding returns as the row opens.
- No Webflow change. The padding override lives in this repo’s CSS.

## Capabilities

### New Capabilities

- `cart-row-uncover`: A cart product row uncovers its full-size image from height zero, including the bottom padding.

### Modified Capabilities

## Impact

- `css/global.css` — drop the image width/height scale. Zero `.cart-product` padding in the closed state.
- `js/global.js` — row height is measured with the image at full size and the padding restored. Image pixel height is no longer required for the reveal.
- `js/cart.js` — remove no longer scales the image to zero. The row height covers it.
