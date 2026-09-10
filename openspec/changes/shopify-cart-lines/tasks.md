## 1. Cart selection and fill

- [x] 1.1 In `js/cart.js`, extend the FUNCTIONS EXPLAINER box with `updateCartLine`, `removeCartLine`, `onCartQuantityChange`, `onCartRemove`, `bindLineControls`
- [x] 1.2 In `js/cart.js`, add `id` to each `lines.nodes` entry in `CART_FIELDS`
- [x] 1.3 In `js/cart.js`, in `fillLine`, write `data-cart-line-id` from `line.id`; if `[data-cart-quantity]` is a `SELECT`, set `.value`, else `textContent`

## 2. Mutations and bind

- [x] 2.1 In `js/cart.js`, add `CART_LINES_UPDATE` and `CART_LINES_REMOVE` using `CART_FIELDS`, returning cart or `""` from `updateCartLine` and `removeCartLine` (no `ensureCart`; `readCartId` only)
- [x] 2.2 In `js/cart.js`, add `onCartQuantityChange` and `onCartRemove` — ignore `[data-cart-line-template]`; no line id → no request; on a truthy cart call `renderCart`, do not call `openDrawer`
- [x] 2.3 In `js/cart.js`, add `bindLineControls` — document click on `[data-cart-remove]`, document change on `[data-cart-quantity]`; call it at boot next to `bindAddToCart`

## 3. Docs

- [x] 3.1 In `README.md`, update the `js/cart.js` row to cover line quantity update and remove

## 4. Webflow (manual, outside this repo)

- [ ] 4.1 Point the Footer `js/cart.js` tag at the new commit SHA and publish

## 5. Verify

- [ ] 5.1 With a line in the drawer, change qty to `2`: `cartLinesUpdate` fires, row amount and subtotal match, drawer stays open
- [ ] 5.2 With two lines, click remove on one: that line gone, the other remains, drawer stays open
- [ ] 5.3 Click remove on the last line: `.empty-cart` visible, `.cart-list` hidden, drawer stays open
- [ ] 5.4 Failed update/remove (`userErrors` or throw): drawer markup unchanged
