## 1. product.js

- [ ] 1.1 In `js/product.js`, on `.next-product` click set `rad-fs-gallery` to `"0"` when `galleryOpen` is false, and `removeItem` when it is true
- [ ] 1.2 In `js/product.js` boot, call `setFullScreenGallery(true)` unless `rad-fs-gallery` is `"0"`, then `removeItem`. A storage error still opens. Do not fade

## 2. Webflow Head

- [ ] 2.1 Replace the Head custom code on Products Template and Merch Template with:

```html
<script>
try {
  if (sessionStorage.getItem("rad-fs-gallery") !== "0") {
    document.documentElement.classList.add("is-full-screen");
  }
} catch (e) {
  document.documentElement.classList.add("is-full-screen");
}
</script>
```
