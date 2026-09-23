## 1. One theme fade in CSS

- [x] 1.1 In `css/global.css`, set `html, body, body *` to transition `background-color`, `color`, and `border-color` at `0.45s ease-out`
- [x] 1.2 Set `.thumb-dark` and `.hero-photo-dark` opacity to `0.45s ease-out`
- [x] 1.3 On the page-enter shorthand (`.main-wrapper:not(:has(.collection-hero-logo))`, `:has(> .collection-hero-logo) > :not(.collection-hero-logo)`, `.products-collection`), keep opacity and transform at `0.6s ease` and add `background-color`, `color`, and `border-color` at `0.45s ease-out`
- [x] 1.4 On `.gallery-full-screen` and `html.is-ready .main-wrapper.is-dimmed`, keep the existing opacity timing and add those three color properties at `0.45s ease-out`
- [x] 1.5 Add `html` to the `prefers-reduced-motion: reduce` `transition-duration: 0s` list

## 2. Canvas texture crossfade

- [x] 2.1 In `js/collection.js` `patchHoverMaterial`, mix an incoming map before the `uDim` mix
- [x] 2.2 Drive that mix from the frame loop over 450ms with `cubic-bezier(0, 0, 0.58, 1)`. Start when the incoming image has decoded. A second toggle mid-fade restarts from the current mix
- [x] 2.3 Under reduced motion, assign the map in one frame. Do not call `fitPlaneScale` or move the camera on a mode toggle
