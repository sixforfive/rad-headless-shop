## 1. Row clip

- [x] 1.1 In `css/global.css`, set `padding-bottom: 0` on the closed `.cart-product:not([data-cart-line-template])`, and restore `padding-bottom: var(--_layout---spacing--space-100)` under `.cart-drawer.is-revealed`.
- [x] 1.2 In `css/global.css`, remove the image width and height animation from the closed, revealed, and `.is-removing` rules so `.cart-prod-img_dummy` stays full size.

## 2. Measure and remove

- [x] 2.1 In `measureCartRow` in `js/global.js`, measure the row with the image at its normal size and the Webflow padding applied, store `--cart-row-h`, then clear those overrides so the first frame is height `0` and padding `0`.
- [x] 2.2 In `onCartRemove` in `js/cart.js`, stop driving the image size. The row’s `is-removing` height and padding cover the full-size image.
