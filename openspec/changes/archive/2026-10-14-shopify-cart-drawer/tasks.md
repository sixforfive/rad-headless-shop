## 1. Cart selection

- [x] 1.1 In `js/cart.js`, extend the FUNCTIONS EXPLAINER box with `fillLine`, `renderCart`, and the `addCartLines` return change (cart object or `""`)
- [x] 1.2 In `js/cart.js`, extract a shared cart selection (`id`, `totalQuantity`, `cost.subtotalAmount`, `lines(first: 50).nodes` with merchandise sku/product/image, quantity, line `cost.totalAmount`) and use it in `CART_QUERY` and `CART_LINES_ADD`
- [x] 1.3 In `js/cart.js`, assign `restoredCart` from `fetchCart` inside `restoreCart` when the cart has an id; clear it when the cart is null; leave it null on throw
- [x] 1.4 In `js/cart.js`, change `addCartLines` to return the cart object when present and `userErrors` is empty, otherwise `""`

## 2. Render

- [x] 2.1 In `js/cart.js`, add `fillLine(el, line)` — write `[data-cart-sku]`, `[data-cart-image]`, `[data-cart-quantity]`, `[data-cart-line-price]`; SKU is `merchandise.sku` or `product.title`; amounts through `formatPrice`
- [x] 2.2 In `js/cart.js`, add `renderCart(cart)` — remove `.cart-list .cart-product:not([data-cart-line-template])`; if no lines, `.empty-cart` `display:flex` and `.cart-list` `display:none`; else clone the template, insert before `.cart-summary`, hide the template, show the list, write `[data-cart-subtotal]`

## 3. Boot and add

- [x] 3.1 In `js/cart.js`, change boot to `restoreCart().then(() => renderCart(restoredCart))` then `bindAddToCart()`
- [x] 3.2 In `js/cart.js`, in `onAddToCart`, after a successful `addCartLines`, call `renderCart(cart)` then `openDrawer("cart", event)`; on `""` return without rendering or opening

## 4. Docs

- [x] 4.1 In `README.md`, update the `js/cart.js` row to cover drawer render

## 5. Webflow (manual, outside this repo)

- [ ] 5.1 Keep one `.cart-product` as `data-cart-line-template`; mark `data-cart-sku`, `data-cart-image`, `data-cart-quantity`, `data-cart-line-price`, `data-cart-subtotal`; delete extra dummy rows; publish
- [ ] 5.2 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 6. Verify

- [ ] 6.1 Hard-refresh with no `rad-cart-id`: no cart `graphql.json` beyond hydration, `.empty-cart` visible, no dummy rows, drawer closed
- [ ] 6.2 On `/product/{slug}`, add to cart: drawer shows the new line, opens via the same overlay as `#cart-open`
- [ ] 6.3 Reload with `rad-cart-id`: one cart query, lines shown, drawer stays closed
- [ ] 6.4 Failed add (`userErrors` or throw): drawer does not open and line markup is unchanged
