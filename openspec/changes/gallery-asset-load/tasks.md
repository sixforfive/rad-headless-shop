## 1. Collection textures

- [x] 1.1 In `js/collection.js` `readGallerySrcs`, store each image's display URL: the `srcset` candidate whose width descriptor is nearest 800 when `srcset` is present, otherwise `src`. Ignore `currentSrc`. Do not rewrite the filename.
- [x] 1.2 In `js/collection.js` `preloadTextures`, load `urlForIndex` for each light index only. Do not walk `darkSrcs` on its own.
- [x] 1.3 Update the `js/collection.js` header explainer for `readGallerySrcs` and `preloadTextures`.

## 2. Shop first row

- [x] 2.1 In `js/shop.js` `eagerThumbImages`, set `loading="eager"` on every original shop thumb image so the measured loop height is final at load.
- [x] 2.2 In `js/shop.js` `cloneGalleryList`, set `loading="lazy"` on the clone's images after `cloneNode`.
- [x] 2.3 In `js/shop.js` `originalsSized`, also require every `img` in each original thumb to be `complete`, since thumb text alone satisfies the height check.
- [x] 2.4 Update the `js/shop.js` header explainer for `eagerThumbImages`, `cloneGalleryList`, and `originalsSized`.
