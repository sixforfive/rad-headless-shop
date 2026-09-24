## 1. Bottom edge

- [x] 1.1 In `js/smooth-scroll.js`, change `isShopGallery` to match `.product-list:not(.is-merch)` so `dampVirtualScroll` stays top-only on both Shop views; update its comment

## 2. Counter

- [x] 2.1 In `js/shop.js`, add `syncScrollCounter`: `is-none` on `#gallery-scroll-counter` when the shop list lacks `is-gallery`; call it from `applyView` and on boot next to `syncActive`; update the header explainer
- [x] 2.2 In `css/global.css`, add `#gallery-scroll-counter.is-none` to the `display: none` combo list and delete the `body:has(...) #gallery-scroll-counter` rule

## 3. Check

- [ ] 3.1 Shop list view reaches the end without a slowed last stretch, and `#gallery-scroll-counter` has `is-none`. Gallery does not have `is-none` on the counter.
