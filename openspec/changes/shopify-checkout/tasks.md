## 1. Cart selection and handler

- [x] 1.1 In `js/cart.js`, add `checkoutUrl` to `CART_FIELDS` next to `id`
- [x] 1.2 In `js/cart.js`, add `onCheckout` — `preventDefault`; if `cartBusy` return; if `restoredCart.checkoutUrl` is empty, `showCartError` on `.cart-drawer` with `"no-reach"` and return; else `window.location.assign(checkoutUrl)` (do not clear `rad-cart-id`)
- [x] 1.3 In `js/cart.js`, add `bindCheckout` — document click on `#checkout-btn`; call it at boot next to `bindLineControls`
- [x] 1.4 In `js/cart.js`, extend the FUNCTIONS EXPLAINER box with `onCheckout` and `bindCheckout`

## 2. Busy lock

- [x] 2.1 In `js/cart.js` `setCartBusy`, include `#checkout-btn` in the `aria-busy` selector

## 3. Docs

- [x] 3.1 In `README.md`, update the `js/cart.js` row to cover checkout redirect

## 4. Webflow (manual, outside this repo)

- [ ] 4.1 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 5. Verify

- [ ] 5.1 Add a line, click `#checkout-btn`: navigates to Shopify checkout in the same window; `rad-cart-id` still set
- [ ] 5.2 With lines and no `checkoutUrl` on the in-memory cart, click `#checkout-btn`: `#error-no-reach` in `.cart-drawer` has `is-visible`; page does not navigate
- [ ] 5.3 Click `#checkout-btn` while a qty update is in flight: page does not navigate; `#checkout-btn` has `aria-busy="true"`
