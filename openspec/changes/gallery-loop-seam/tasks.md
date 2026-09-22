## 1. Scroll helpers

- [x] 1.1 In `js/smooth-scroll.js`, add `radScrollShift(delta)`: when `radLenis` is live subtract `delta` from both `animatedScroll` and `targetScroll` then `window.scrollTo(0, radLenis.animatedScroll)`; otherwise `window.scrollTo(0, window.scrollY - delta)`
- [x] 1.2 In `js/smooth-scroll.js`, add `radOnScroll(fn)`: bind `radLenis.on("scroll", fn)` when Lenis is live, otherwise a passive `window` `scroll` listener
- [x] 1.3 Add both to the header explainer block; leave `radScrollTo`, `radScrollToTop`, and the stop/start pair unchanged

## 2. Clone the list container

- [x] 2.1 In `js/shop.js`, replace `cloneGalleryThumbs` with `cloneGalleryList`: `cloneNode(true)` the shop list, add `.is-clone` and `aria-hidden="true"`, set `tabindex="-1"` on every link inside, remove `id` from the clone and all descendants, insert as the next sibling; skip if `.product-list.is-clone` already exists
- [x] 2.2 In `js/shop.js`, move `eagerThumbImages()` above the clone call in the boot sequence so `loading="eager"` copies with the nodes
- [x] 2.3 In `css/global.css`, replace `.product-list:not(.is-gallery) .product-thumb.is-clone { display: none }` with `.product-list.is-clone:not(.is-gallery) { display: none }`

## 3. Seam geometry

- [x] 3.1 In `js/shop.js`, add a seam-gap correction inside `measureLoopHeight`: read the clone list's computed `marginTop`, the grid's computed `rowGap`, and the current visual gap (clone list top minus original list bottom), then write `marginTop + (rowGap - visualGap)` back as the clone list's inline `margin-top`
- [x] 3.2 In `js/shop.js`, change `loopHeight` to `cloneList.getBoundingClientRect().top - list.getBoundingClientRect().top`, measured after the gap correction
- [x] 3.3 In `js/shop.js`, fold `originalsSized()` into `measureLoopHeight` as a cached boolean and read the cache in `onGalleryScroll`

## 4. Wrap without stalling

- [x] 4.1 In `js/shop.js` `onGalleryScroll`, replace the `jumpScrollY(window.scrollY - h)` wrap with `radScrollShift(h)`, keeping the `overflow-anchor: none` bracket and the gallery / `h > 0` / sized guards
- [x] 4.2 In `js/shop.js`, register `onGalleryScroll` through `radOnScroll` instead of the direct `window.addEventListener("scroll", ...)`
- [x] 4.3 In `js/shop.js`, leave `jumpScrollY` in place for `setView`, which wants a dead stop at the top
- [x] 4.4 Update the `js/shop.js` header explainer to match the renamed and changed functions

## 5. Hover dim across the seam

- [x] 5.1 In `css/global.css`, narrow the existing sibling dim rule to `.product-list.is-merch:has(.product-link:hover) .product-link:not(:hover)`
- [x] 5.2 In `css/global.css`, add `body:has(.product-list:not(.is-merch) .product-link:hover) .product-list:not(.is-merch) .product-link:not(:hover)` with the same opacity so the shop dim spans the original list and its clone

## 6. Verify

- [ ] 6.1 On `/shop` in gallery view, confirm `clone[i].top - original[i].top` is one single value across the whole set
- [ ] 6.2 Confirm no cloned thumb shares a row with an original, including when the original set leaves its last row partly empty
- [ ] 6.3 Scroll fast through the wrap and confirm no stall and no rearranged first row; repeat at ≤479px where gallery columns go auto
- [ ] 6.4 Confirm the seam gap matches the gap between any other two gallery rows, at each breakpoint
- [ ] 6.5 Confirm hovering an original thumb at the seam dims cloned thumbs too, and that merch dim is unchanged
- [ ] 6.6 Confirm list view still hides clones, the counter still reads 00–99 and returns to 00 after the wrap, and merch and the product detail nested gallery are unaffected
