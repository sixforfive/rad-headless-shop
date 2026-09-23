## 1. Canvas stays visible

- [x] 1.1 In `css/global.css`, remove `:has(> .collection-hero-logo) > :not(.collection-hero-logo)` from the initial `opacity: 0` rule and from the `html.is-ready` show rule
- [x] 1.2 Keep `html.is-leaving` fading that sibling out
- [x] 1.3 In `js/collection.js`, call `radPageReady()` at the end of `bootInfiniteGallery()` and delete the all-textures wait in `revealGallery()`

## 2. Per-image fade

- [x] 2.1 In `makePlaneMesh`, start `opacity` at `0` and set `userData.reveal` to `0`
- [x] 2.2 In the `getTexture` load callback, store `performance.now() + Math.random() * 500` for that URL
- [x] 2.3 In `tick`, once a plane's texture has decoded and its delay has passed, ease `reveal` from `0` to `1` over 0.45s and set `material.opacity` to it. The three copies of one URL share that timestamp
- [x] 2.4 In `applyHoverDim`, write `userData.reveal` instead of `1`. Under `prefers-reduced-motion: reduce`, snap a decoded plane to `1`
