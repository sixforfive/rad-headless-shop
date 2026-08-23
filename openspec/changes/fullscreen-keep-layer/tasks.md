## 1. CSS

- [x] 1.1 In `css/global.css`, add `.product-gallery-collection.is-none` to the existing `display: none` list
- [x] 1.2 In `css/global.css`, add `.layer.is-blend { mix-blend-mode: difference }` and `.layer.is-blend .cta-wrapper { isolation: isolate; mix-blend-mode: normal }`

## 2. Gallery JS

- [x] 2.1 In `js/product.js`, look up `.product-gallery-collection.is-default`
- [x] 2.2 In `setFullScreenGallery`, toggle `.is-none` on `.gallery-full-screen` and `.product-gallery-collection.is-default`, toggle `.is-blend` on `.layer`, and do not toggle `.is-none` on `.layer`
- [x] 2.3 Update the `product.js` file-header comments for the new hide/blend targets
