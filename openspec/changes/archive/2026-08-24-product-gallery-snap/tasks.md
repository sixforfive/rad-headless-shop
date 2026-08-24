## 1. Snap CSS

- [x] 1.1 In `css/global.css` at `max-width: 767px`, set `scroll-snap-type: x mandatory` and `scroll-snap-stop: always` on `.product-gallery-collection.is-default .product-gallery-list`
- [x] 1.2 In that same query, set `scroll-snap-align: start` on `.product-gallery-collection.is-default .product-gallery-item`
- [x] 1.3 Add `.pagination-bar.is-none` to the existing `display: none` list in `css/global.css`

## 2. Pagination JS

- [x] 2.1 In `js/product.js`, count `.product-gallery-item` in `.product-gallery-collection.is-default`; if fewer than 2, add `is-none` on `.pagination-bar` and skip cloning
- [x] 2.2 If two or more, remove `is-none` and clone the bar’s `.pagination-item` until tick count equals image count
- [x] 2.3 On load and on that list’s `scroll`, set `is-choosen` only on the tick whose index equals `Math.round(list.scrollLeft / list.clientWidth)`
