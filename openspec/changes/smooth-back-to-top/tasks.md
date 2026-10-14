## 1. Enter spring

- [x] 1.1 In `js/smooth-scroll.js`, delete `BACK_TO_TOP_DURATION`. Precompute an easing from rest at 0 toward 1 with `x'' = (-210 * (x - 1) - 29 * v)` over 700ms, divide by the last sample, and clamp to `0..1`
- [x] 1.2 In `radScrollToTop`, pass `{ duration: 0.7, easing: that curve }` unless `options.immediate`. A caller `duration` does not replace it
- [x] 1.3 Update the `radScrollToTop` line in the header explainer

## 2. Click

- [x] 2.1 In `scrollToTop` in `js/global.js`, call `radScrollToTop({ immediate: true })` when reduced motion matches, and `radScrollToTop()` otherwise. Remove `duration: 1.4`
- [x] 2.2 Update the `scrollToTop` line in the header explainer

## 3. Check

- [x] 3.1 Click `#back-to-top` on a long window page and on the desktop product gallery. With `prefers-reduced-motion: reduce`, the same click jumps
