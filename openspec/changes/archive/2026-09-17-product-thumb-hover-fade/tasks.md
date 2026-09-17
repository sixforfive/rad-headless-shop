## 1. Hover CSS

- [x] 1.1 In `css/global.css`, under `@media (hover: hover) and (pointer: fine)`, add `transition: opacity 0.3s ease` on `.product-list .product-link`; when the list `:has(.product-link:hover)`, set `.product-link:not(:hover)` to `opacity: 0.3`
- [x] 1.2 Set that opacity transition duration to `0s` under `prefers-reduced-motion: reduce`

## 2. Publish

- [x] 2.1 Point the site-wide Head `<link>` for `css/global.css` at the new commit SHA and publish
