## 1. Shop script

- [x] 1.1 Add `js/shop.js`: copy `gallery-column-start`, `gallery-column-end` (+ 1), and `list-column` from each `.product-list .product-thumb` onto matching CSS variables; skip a variable when its attribute is missing
- [x] 1.2 In `js/shop.js`, on `.switch-btn[data-view]` click: `gallery` adds `is-gallery` on `.product-list`, `list` removes it; move `is-active` onto the clicked button (read `data-view`, not label text)
- [x] 1.3 On load, set `is-active` on `[data-view="gallery"]` if `.product-list` has `is-gallery`, else on `[data-view="list"]`
- [x] 1.4 Delete `js/shop-gallery.js` and `js/shop-list.js`

## 2. Placement CSS

- [x] 2.1 In `css/global.css`, apply gallery variables on `.product-list.is-gallery .product-thumb` and `--list-column` on `.product-list:not(.is-gallery):not(.is-merch) .product-thumb`
- [x] 2.2 Reset gallery `grid-column: auto` at `max-width: 479px` and list `grid-column: auto` at `max-width: 767px`

## 3. Docs

- [x] 3.1 Point Shop at `js/shop.js` in `rad-workflow-scripts.md` and `README.md`; drop the old gallery/list script rows
- [x] 3.2 Update `.cursor/rules/webflow-rad.mdc`: Shop path `/shop`, page id `6a58b76fe9bb8994dff07072`; note Gallery/List as views on that page
