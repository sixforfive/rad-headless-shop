## 1. CSS

- [x] 1.1 In `css/global.css`, inside the existing `@media (max-width: 767px)` empty-bar block, add `body:not(:has(.notification-item)) .product-gallery-col { padding-top: var(--_layout---spacing--space-300); }`
- [x] 1.2 In that same block, move the `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` selectors from `body:has(.notification-bar-box.is-none)` to `body:not(:has(.notification-item))`, since a published page with an empty collection has no `.notification-bar-box` at all

## 2. Check

- [x] 2.1 At 767px and down with no published notification item, `.product-gallery-col` is `padding-top: 3rem` on product and merch detail. With a published item, or wider than 767px, it stays Webflow `5rem`.
- [x] 2.2 Confirm the drawer lists still drop to `space-400` under the same empty condition, and keep Webflow padding while a drawer is open with a live banner
