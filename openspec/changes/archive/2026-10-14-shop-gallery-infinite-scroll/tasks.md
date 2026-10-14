## 1. Clone and wrap

- [x] 1.1 In `js/shop.js`, after `hydrateThumbs`, clone each shop `.product-thumb:not(.is-clone)` once: `cloneNode(true)`, add `.is-clone` and `aria-hidden="true"`, set `tabindex="-1"` on inner links, append to that thumb’s `parentNode`; skip if clones already exist
- [x] 1.2 In `js/shop.js`, compute loop height as first `.is-clone` `getBoundingClientRect().top` minus first original; on scroll, if the shop list has `.is-gallery` and `scrollY >=` that height, instant-`scrollTo` `scrollY - height` with `overflow-anchor: none` on `html`; do nothing in list view or when height is `<= 0`
- [x] 1.3 Recalc loop height on `ResizeObserver` of the shop list, on `resize`, and at the end of `setView`

## 2. Counter and hide

- [x] 2.1 In `js/shop.js`, write zero-padded `00`–`99` of `scrollY /` loop height into `#gallery-scroll-counter` on scroll (floor, clamp; no `%` suffix)
- [x] 2.2 In `css/global.css`, `display: none` on `.product-list:not(.is-gallery) .product-thumb.is-clone` and on `body:has(.product-list:not(.is-gallery):not(.is-merch)) #gallery-scroll-counter`

## 3. Publish

- [ ] 3.1 Point the Shop footer `shop.js` pin and the site-wide `global.css` pin at the new commit SHA and publish
