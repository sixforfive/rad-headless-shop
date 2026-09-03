## 1. CSS

- [x] 1.1 In `css/global.css`, inside the existing `@media (max-width: 767px)` empty-bar block, add `body:has(.notification-bar-box.is-none) .product-gallery-col { padding-top: var(--_layout---spacing--space-300); }`

## 2. Check

- [x] 2.1 At 767px and down with no published notification item, `.product-gallery-col` is `padding-top: 3rem` on product and merch detail. With a published item, or wider than 767px, it stays Webflow `5rem`.
