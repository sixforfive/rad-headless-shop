## 1. Collection textures

- [x] 1.1 In `js/collection.js` `readGallerySrcs`, store each image's display URL: the `srcset` candidate whose width descriptor is nearest 800 when `srcset` is present, otherwise `src`. Ignore `currentSrc`. Do not rewrite the filename.
- [x] 1.2 In `js/collection.js` `preloadTextures`, load `urlForIndex` for each light index only. Do not walk `darkSrcs` on its own.
- [x] 1.3 Update the `js/collection.js` header explainer for `readGallerySrcs` and `preloadTextures`.

## 2. Shop first row

- [x] 2.1 In `js/shop.js` `eagerThumbImages`, if no original thumb has height, leave every image `loading="lazy"`. Otherwise set `loading="eager"` only on original thumbs whose top is within 0.5px of the minimum top, and leave the rest untouched.
- [x] 2.2 Keep the `eagerThumbImages()` call before `cloneGalleryList()` in the boot sequence.
- [x] 2.3 Update the `js/shop.js` header explainer for `eagerThumbImages`.
