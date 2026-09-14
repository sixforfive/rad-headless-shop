## 1. CSS

- [x] 1.1 In `css/global.css`, inside the existing `@media (max-width: 767px)` empty-bar block, add `body:not(:has(.notification-item)) .empty-cart { margin-top: var(--_layout---spacing--space-400); }`

## 2. Check

- [x] 2.1 At 767px and down with no published notification item, `.empty-cart` is `margin-top: space-400`. With a published item, or wider than 767px, it stays Webflow `space-600`.
