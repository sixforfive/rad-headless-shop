## 1. CSS

- [x] 1.1 In `css/global.css`, replace `.layer.is-blend #close-product` with `.layer.is-blend .close-product` and add `.layer.is-blend .next-product`
- [x] 1.2 In `css/global.css`, add `html.is-full-screen` paint: show `.gallery-full-screen` (`display: block !important`), white chrome on `.layer *`, desktop hide `.product-gallery-collection.is-default` and blend `.layer`, mobile hide `.layer`

## 2. product.js

- [x] 2.1 In `js/product.js` `setFullScreenGallery`, toggle `is-full-screen` on `document.documentElement` as well as `body`
- [x] 2.2 In `js/product.js`, on `.next-product` click write `sessionStorage` key `rad-fs-gallery` to `"1"` when `galleryOpen`, else `removeItem`
- [x] 2.3 In `js/product.js` boot, if `rad-fs-gallery` is `"1"` call `setFullScreenGallery(true)`, then `removeItem`

## 3. Webflow

- [ ] 3.1 Paste this in Head custom code on Products Template and Merch Template:

```html
<script>
try {
  if (sessionStorage.getItem("rad-fs-gallery") === "1") {
    document.documentElement.classList.add("is-full-screen");
  }
} catch (e) {}
</script>
```
