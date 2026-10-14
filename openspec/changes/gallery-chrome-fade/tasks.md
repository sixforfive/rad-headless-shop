## 1. Chrome opacity

- [x] 1.1 In `css/global.css`, give `.layer`, `.layer-cta`, and `.product-nav-tab` `transition: opacity 0.3s ease-out` plus `background-color`, `color`, and `border-color` at `0.45s ease-out`
- [x] 1.2 Add `.is-chrome-out` on those three: `opacity: 0`, transition limited to `opacity 0.3s ease-out`, and `transition: none` on their descendants
- [x] 1.3 In the `prefers-reduced-motion: reduce` block, set `transition-duration: 0s` on `.layer`, `.layer-cta`, and `.product-nav-tab`

## 2. Sequence

- [x] 2.1 In `js/product.js` `setFullScreenGallery`, on a viewport wider than 767px and without reduced motion, add `is-chrome-out`, wait for the opacity transition, call `syncGalleryChrome`, then remove `is-chrome-out` on the next frame
- [x] 2.2 A second open or close during that fade-out replaces the pending open state and does not add `is-chrome-out` again. A timeout at the transition length runs the same settle if `transitionend` does not fire
- [x] 2.3 Boot restore from `rad-fs-gallery` and the `mobileQuery` listener call `syncGalleryChrome` immediately. Mobile and reduced motion take that immediate path
- [x] 2.4 Update the `setFullScreenGallery` line in the header explainer
