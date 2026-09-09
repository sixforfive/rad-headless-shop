## 1. readQuantity

- [x] 1.1 In `js/cart.js`, update `readQuantity(wrapper)` — if the matched node is a `SELECT` or contains one, parse that `.value` as a positive int; else keep `.w-dropdown-toggle` then last digit-only child; else `1`

## 2. Webflow (manual, outside this repo)

- [x] 2.1 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 3. Verify

- [x] 3.1 On `/product/{slug}`, choose qty `3`, click Add to cart; confirm `cartLinesAdd` `lines[0].quantity` is `3`
