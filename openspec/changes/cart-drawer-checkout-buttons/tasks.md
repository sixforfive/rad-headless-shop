## 1. Close

- [x] 1.1 In `js/global.js`, bind `#keep-shopping` click to `closeDrawer` next to the `#cart-close` listener

## 2. Render

- [x] 2.1 In `js/cart.js`, in `renderCart`, on the empty-list return set `#checkout-btn` `style.display` to `"none"`; on the lines path set it to `""`; optional chaining if the node is missing
- [x] 2.2 In `js/cart.js`, extend the FUNCTIONS EXPLAINER `renderCart` line to cover hiding `#checkout-btn` when empty

## 3. Docs

- [x] 3.1 In `README.md`, update the `js/global.js` and `js/cart.js` rows to cover Keep shopping close and Checkout hide

## 4. Webflow (manual, outside this repo)

- [ ] 4.1 Point the Footer `js/global.js` and `js/cart.js` tags at the new commit SHAs and publish

## 5. Verify

- [ ] 5.1 Open an empty cart: `#checkout-btn` hidden, `#keep-shopping` visible
- [ ] 5.2 Click `#keep-shopping`: `.cart-drawer` closes the same way `#cart-close` does
- [ ] 5.3 Add a line: `#checkout-btn` visible
- [ ] 5.4 Remove the last line: `#checkout-btn` hidden, `.cart-drawer` stays open
- [ ] 5.5 Click `#cart-close`: drawer still closes as before
