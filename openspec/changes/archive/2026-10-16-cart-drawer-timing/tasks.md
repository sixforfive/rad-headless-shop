## 1. Cart clock

- [x] 1.1 In `js/global.js`, replace the derived cart constants with literals: `CART_REVEAL_DURATION` `0.375`, `CART_REVEAL_ORDER3_DURATION` `0.15`, `CART_REVEAL_GAP` `0.375`, `CART_OPEN_GAP` `0`, `CART_CLOSE_GAP` `0`. Delete `CART_LEAVE_TAIL_MS`.
- [x] 1.2 In `js/global.js`, at startup write `--cart-row-duration` and `--cart-title-duration` on `.cart-drawer` from `CART_REVEAL_DURATION` and `CART_REVEAL_ORDER3_DURATION`.
- [x] 1.3 In the `js/global.js` explainer, change the `playCartReveal` line so it no longer says the cart uses the menu clocks.

## 2. Open and close gaps

- [x] 2.1 In `playCartReveal` in `js/global.js`, after the rows are ready, call `startCartReveal` in the same turn when `CART_OPEN_GAP` is `0`. Otherwise wait `CART_OPEN_GAP * 1000` and skip `startCartReveal` if `cartRevealToken` or `activeDrawer` changed. Empty cart and reduced motion return before that wait.
- [x] 2.2 In `closeDrawer` in `js/global.js`, set the cart wait to `cartRevealReverseMs() + CART_CLOSE_GAP * 1000`. Leave the menu wait as `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS`.

## 3. One duration on screen

- [x] 3.1 In `css/global.css`, point `.cart-product` height, padding, and border, and `.cart-drawer .menu-reveal-line-inner`, at `--cart-row-duration`. Point `.cart-list-titles` and `.cart-bottom` at `--cart-title-duration`. Remove the numeric duration fallbacks on those cart rules. Leave the menu `1.47s` fallback and the `.drawer-wrapper` `0.45s` / `0.9s`.
- [x] 3.2 In `onCartRemove` in `js/cart.js`, stop setting `--menu-reveal-duration`. Keep `--menu-reveal-delay` at `0s` and `is-removing`.
