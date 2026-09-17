## 1. Hover CSS

- [x] 1.1 In `css/global.css`, under `@media (hover: hover) and (pointer: fine)`, add `transition: opacity 0.3s ease` on `.product-list .product-thumb`; when the list `:has(.product-thumb:hover)`, set sibling thumbs to `opacity: 0.3` and the hovered thumb to `opacity: 1`
- [x] 1.2 Set that opacity transition duration to `0s` under `prefers-reduced-motion: reduce`

## 2. Publish

- [ ] 2.1 Point the site-wide Head `<link>` for `css/global.css` at the new commit SHA and publish
