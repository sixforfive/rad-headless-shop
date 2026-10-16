## 1. Empty fade

- [x] 1.1 In `js/global.js`, add a token and `fadeEmptyCart`. When motion is allowed, snap `.empty-cart` to opacity `0` with `transition: none`, flush, restore the CSS transition, then after `DRAWER_SHELL` clear the inline opacity if the token still matches, the drawer is `is-revealed`, and the cart is still empty. Reduced motion clears any inline opacity and returns
- [x] 1.2 At the start of `playCartReveal`, bump that token and clear `.empty-cart` inline opacity so a close or a new open during the wait owns the copy

## 2. Last-line render

- [x] 2.1 In `renderCart` in `js/cart.js`, call `fadeEmptyCart` only when the empty branch runs, the drawer is already `is-revealed`, and real line rows were just removed. A render that shows lines clears the inline opacity and bumps the token
