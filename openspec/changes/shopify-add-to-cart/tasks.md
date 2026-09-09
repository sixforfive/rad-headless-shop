## 1. Mutation and quantity

- [x] 1.1 In `js/cart.js`, extend the FUNCTIONS EXPLAINER box with `readQuantity`, `addCartLines`, `onAddToCart`, `bindAddToCart`
- [x] 1.2 In `js/cart.js`, add `CART_LINES_ADD` — `cartLinesAdd(cartId, lines) { cart { id } userErrors { field message } }`
- [x] 1.3 In `js/cart.js`, add `readQuantity(wrapper)` — `[data-quantity]` else `#quantity`; `.w-dropdown-toggle` if present, else last digit-only child; else `1`
- [x] 1.4 In `js/cart.js`, add `async addCartLines(cartId, merchandiseId, quantity)` — `shopifyFetch(CART_LINES_ADD)`, return `cart.id` when present and `userErrors` is empty, otherwise return `""`

## 2. Click path

- [x] 2.1 In `js/cart.js`, add `async onAddToCart(event)` — `preventDefault`; `closest("[data-variant-id]")`; skip when gid is empty; `ensureCart()` then `addCartLines`
- [x] 2.2 In `js/cart.js`, add `bindAddToCart()` — document click on `[data-add-to-cart]`
- [x] 2.3 In `js/cart.js`, call `bindAddToCart()` at module bottom next to `restoreCart()`

## 3. Docs

- [x] 3.1 In `README.md`, update the `js/cart.js` row to cover add to cart

## 4. Webflow (manual, outside this repo)

- [ ] 4.1 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 5. Verify

- [ ] 5.1 On `/product/{slug}` with no `rad-cart-id`, click Add to cart; confirm `cartCreate` then `cartLinesAdd` with the wrapper's variant gid and quantity `1`
- [ ] 5.2 Click the other add-to-cart control; confirm a second `cartLinesAdd` on the same cart id
- [ ] 5.3 On `/merch/{slug}`, click Add to cart; confirm `cartLinesAdd` for that page's variant
- [ ] 5.4 On `/shop`, confirm no `cartLinesAdd`
- [ ] 5.5 Click Add to cart; confirm the page does not jump to the top
