## 1. Error kind and mutation returns

- [x] 1.1 In `js/cart.js`, add `code` to every `userErrors` selection (`CART_CREATE`, `CART_LINES_ADD`, `CART_LINES_UPDATE`, `CART_LINES_REMOVE`)
- [x] 1.2 In `js/cart.js`, add `errorKind(userErrors, action)` — `no-item` / `stock` / add `soldout` / else `no-reach`
- [x] 1.3 In `js/cart.js`, change `createCart`, `addCartLines`, `updateCartLine`, and `removeCartLine` to return `{ cart, kind }` (throw and `userErrors` → empty cart + kind; success → cart + `""`)
- [x] 1.4 In `js/cart.js`, extend the FUNCTIONS EXPLAINER box with `errorKind`, `showCartError`, `hideCartErrors`, `setCartBusy`, and the new mutation returns

## 2. Show, hide, and busy

- [x] 2.1 In `js/cart.js`, add `hideCartErrors(root)` and `showCartError(root, kind)` — scoped `querySelector` on `[id^="error-"]` / `#error-${kind}`
- [x] 2.2 In `js/cart.js`, add `setCartBusy(busy)` — `cartBusy` flag and `aria-busy` on `[data-add-to-cart]`, `[data-cart-quantity]`, `[data-cart-remove]`
- [x] 2.3 In `js/cart.js` `onAddToCart`, return when `cartBusy`; lock around `ensureCart` + `addCartLines`; on fail `showCartError` on `.layer-cta`; on success `hideCartErrors` then existing render/open
- [x] 2.4 In `js/cart.js` `onCartQuantityChange` and `onCartRemove`, same busy lock; on fail `showCartError` on `.cart-drawer`; on success `hideCartErrors` then `renderCart`

## 3. CSS

- [x] 3.1 In `css/global.css`, hide `.error-wrapper [id^="error-"]` with opacity 0 and `translateY(0.5rem)`, show `.is-visible` with opacity 1 and no transform, overlay with `position: absolute`, 0.3s ease
- [x] 3.2 In `css/global.css`, add `.error-wrapper [id^="error-"]` to the existing `prefers-reduced-motion` `transition-duration: 0s` list

## 4. Docs

- [x] 4.1 In `README.md`, update the `js/cart.js` row to cover error nodes and the busy lock
- [x] 4.2 In `openspec/specs/shopify-add-to-cart/spec.md`, replace the failed-add requirement with the delta (show mapped error in `.layer-cta`)
- [x] 4.3 In `openspec/specs/shopify-cart-drawer/spec.md`, add the failed line-change error requirement from the delta

## 5. Webflow (manual, outside this repo)

- [ ] 5.1 Confirm `.error-wrapper` nodes are not `display: none`
- [ ] 5.2 Point the Footer `js/cart.js` and `css/global.css` tags at the new commit SHAs and publish

## 6. Verify

- [ ] 6.1 On `/product/{slug}`, fail add (offline): `#error-no-reach` in `.layer-cta` fades in; drawer does not open
- [ ] 6.2 Double-click add while the first request is in flight: only one Storefront add mutation
- [ ] 6.3 Successful add after a failure: `.layer-cta` error nodes lose `is-visible`
- [ ] 6.4 Fail qty or remove (offline): `#error-no-reach` in `.cart-drawer`; line markup unchanged
