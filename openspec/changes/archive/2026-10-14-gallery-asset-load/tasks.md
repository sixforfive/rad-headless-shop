## 1. Collection textures

- [x] 1.1 In `js/collection.js` `readGallerySrcs`, store each image's display URL: the `srcset` candidate whose width descriptor is nearest 800 when `srcset` is present, otherwise `src`. Ignore `currentSrc`. Do not rewrite the filename.
- [x] 1.2 In `js/collection.js` `preloadTextures`, load `urlForIndex` for each light index only. Do not walk `darkSrcs` on its own.
- [x] 1.3 Update the `js/collection.js` header explainer for `readGallerySrcs` and `preloadTextures`.

## 2. Revert the shop scope

- [x] 2.1 Restore `js/shop.js` to its `a8dc990` state, dropping the first-row eager pass, the clone lazy pass, and the `originalsSized` image gate.
