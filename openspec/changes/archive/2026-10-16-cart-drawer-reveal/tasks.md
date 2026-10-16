## 1. Cart reveal styles

- [x] 1.1 In `css/global.css`, add the from-state and `.cart-drawer.is-revealed` rules for `.cart-list-titles`, `.cart-prod-img_dummy`, the line masks, the subtotal texts, and `.cart-bottom`
- [x] 1.2 In `css/global.css`, add `.cart-product.is-removing` so the image, masks, padding, and qty height return to 0 on the line ease
- [x] 1.3 In the existing `prefers-reduced-motion` block, zero those transforms and transition durations

## 2. Open and close

- [x] 2.1 In `js/global.js`, add `playCartReveal`: on open, wrap the single-line texts, measure each image, write delays, flush, then add `.cart-drawer.is-revealed`; on close, write the reverse delays and remove `is-revealed`
- [x] 2.2 In `openDrawer`, call `playCartReveal(true)` when opening the cart. An empty cart does not run the sequence
- [x] 2.3 In `closeDrawer`, when the cart has lines and motion is allowed, fade the shell at `cartRevealReverseMs() - 600`. An empty cart and reduced motion fade immediately. Switching to the menu does not reverse the cart

## 3. Render and remove

- [x] 3.1 In `js/cart.js` `fillLine`, write sku and price into `.menu-reveal-line-inner` when that wrap exists
- [x] 3.2 In `renderCart`, when `.cart-drawer` is already revealed, rebuild and snap each image to its measured height
- [x] 3.3 In `onCartRemove`, add `is-removing` and call `renderCart` on the image `transitionend`. A failed remove drops `is-removing`. Reduced motion renders immediately
