## 1. CSS (shipped)

- [x] 1.1 Add `.product-gallery-collection.is-none` and `.layer.is-none` to the `display: none` list in `css/global.css`
- [x] 1.2 Add `.layer.is-blend` difference blend, CTA `normal` + `isolation`, pointer-events none on the layer and auto on `.navbar` / `.cta-wrapper` / `.footer`
- [x] 1.3 Raise `.gallery-full-screen_close` z-index while the gallery is not `is-none`
- [x] 1.4 Add `pointer-events: auto` on `.layer.is-blend` for `#close-product`, `#download-spec`, `#add-to-cart`, and `#quantity`
- [x] 1.5 Add `body.is-full-screen { color: #fff }` in `css/global.css`
- [x] 1.6 Remove `mix-blend-mode` from `.layer.is-blend` and from `.cta-wrapper`; set `difference` on `.product-info-col`, `.price-tag`, `.product-details-wrapper`, and `.footer`

## 2. JS (shipped)

- [x] 2.1 `setFullScreenGallery` desktop keep-chrome vs mobile hide `.layer`; clear the other mode’s classes
- [x] 2.2 Re-apply open state on `max-width: 767px` `change` when the gallery is open
- [x] 2.3 Desktop list open/close; mobile `#full-screen-open`; `#full-screen-close` at every breakpoint
- [x] 2.4 Toggle `body.is-full-screen` on/off in `setFullScreenGallery`
