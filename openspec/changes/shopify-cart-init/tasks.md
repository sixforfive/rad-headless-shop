## 1. Storage

- [x] 1.1 In `js/cart.js`, replace the empty file with the FUNCTIONS EXPLAINER box listing `readCartId`, `writeCartId`, `clearCartId`, `fetchCart`, `createCart`, `restoreCart`, `ensureCart`
- [x] 1.2 In `js/cart.js`, add `CART_KEY = "rad-cart-id"` and `readCartId` / `writeCartId` / `clearCartId` wrapping `localStorage` in try/catch

## 2. Storefront cart calls

- [x] 2.1 In `js/cart.js`, add `CART_QUERY` — `cart(id: $id) { id }`
- [x] 2.2 In `js/cart.js`, add `CART_CREATE` — `cartCreate { cart { id } userErrors { field message } }` with no lines
- [x] 2.3 In `js/cart.js`, add `async fetchCart(id)` — `shopifyFetch(CART_QUERY, { id })`, return the cart or null
- [x] 2.4 In `js/cart.js`, add `async createCart()` — `shopifyFetch(CART_CREATE)`, return `cart.id` when present and `userErrors` is empty, otherwise return `""`

## 3. Restore and ensure

- [x] 3.1 In `js/cart.js`, add `async restoreCart()` — return early when domain or token is missing or no stored id; query; keep the id when the cart resolves, `clearCartId` when the cart is null, leave the key on throw
- [x] 3.2 In `js/cart.js`, add `async ensureCart()` — return the stored id when `restoreCart` leaves a valid one, otherwise `createCart` then `writeCartId`
- [x] 3.3 In `js/cart.js`, call `restoreCart()` at module bottom, matching the boot style of `js/shopify.js`

## 4. Docs

- [x] 4.1 In `README.md`, update the `js/cart.js` row to cover restore, lazy `cartCreate`, and `rad-cart-id`

## 5. Webflow (manual, outside this repo)

- [ ] 5.1 Add `js/cart.js` to Site Footer at the commit SHA, immediately below the `js/shopify.js` tag

## 6. Verify

- [ ] 6.1 Publish and hard-refresh with no `rad-cart-id`; confirm no cart `graphql.json` request
- [ ] 6.2 Set a known-good cart gid in `rad-cart-id`, hard-refresh; confirm one `cart(id)` request and the key remains
- [ ] 6.3 Set a garbage gid in `rad-cart-id`, hard-refresh; confirm the key is removed
- [ ] 6.4 From the console, call `ensureCart()` with no stored id; confirm one `cartCreate` and that `rad-cart-id` is written
