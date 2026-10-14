## 1. Logo leave fade

- [x] 1.1 In `css/global.css`, add `.collection-hero-logo` to the `0.3s` opacity transition list beside the gallery sibling
- [x] 1.2 On `html.is-leaving`, set `.collection-hero-logo` to `opacity: 0`. Do not set `transform`
- [x] 1.3 In the existing `prefers-reduced-motion` block, set `transition-duration: 0s` on `.collection-hero-logo`

## 2. Tile pop

- [x] 2.1 In `advanceReveal` in `js/collection.js`, after `fitPlaneScale`, multiply scale `x` and `y` by `0.98 + 0.02 * reveal`. When `prefers-reduced-motion: reduce` is set, use `1`
- [x] 2.2 Ease that reveal with `themeEaseOut`. Keep `REVEAL_MIN_MS` at `0`, `REVEAL_DELAY_MS` at `1200`, and `REVEAL_FADE_MS` at `300`
