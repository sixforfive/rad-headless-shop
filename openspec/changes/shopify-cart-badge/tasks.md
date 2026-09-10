## 1. Render count

- [x] 1.1 In `js/cart.js`, at the top of `renderCart`, write `String(cart?.totalQuantity ?? 0)` to every `[data-cart-count]` before the empty-list return

## 2. Docs

- [x] 2.1 In `README.md`, update the `js/cart.js` row to cover the navbar count

## 3. Webflow (manual, outside this repo)

- [ ] 3.1 On the navbar component, mark the `2` inside `#cart-open .link-sec-brack` with `data-cart-count`; publish
- [ ] 3.2 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 4. Verify

- [ ] 4.1 Hard-refresh with no `rad-cart-id`: `[data-cart-count]` is `0`, no cart `graphql.json` beyond hydration
- [ ] 4.2 On `/product/{slug}`, add to cart: `[data-cart-count]` matches `totalQuantity`
- [ ] 4.3 Change a line qty, then remove the last line: count updates, then `0`
- [ ] 4.4 Reload with `rad-cart-id` and lines: count matches the restore cart
- [ ] 4.5 Failed add/update/remove (`userErrors` or throw): `[data-cart-count]` unchanged
