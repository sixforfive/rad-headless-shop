## 1. Logo blur

- [x] 1.1 In `css/global.css`, set `.collection-hero-logo` to `filter: blur(8px)` with `filter` transitioning over `0.45s ease-out`. Leave its opacity at `1` and do not set `transform`
- [x] 1.2 Set `html.is-ready .collection-hero-logo` to `filter: blur(0px)`
- [x] 1.3 After that rule, set `html.is-leaving .collection-hero-logo` to `filter: blur(8px)`
- [x] 1.4 In the existing `prefers-reduced-motion` block, set `filter: none` on `.collection-hero-logo`, `html.is-ready .collection-hero-logo`, and `html.is-leaving .collection-hero-logo`

## 2. Tile pop

- [x] 2.1 In `advanceReveal` in `js/collection.js`, after `fitPlaneScale`, multiply scale `x` and `y` by `0.98 + 0.02 * reveal`. When `prefers-reduced-motion: reduce` is set, use `1`
- [x] 2.2 Leave `REVEAL_MIN_MS`, `REVEAL_DELAY_MS`, and `REVEAL_FADE_MS` as they are
