## 1. CSS

- [x] 1.1 In `css/global.css`, add `body.is-full-screen .layer-cta .qty-dropdown { mix-blend-mode: difference }` next to the existing full-screen chrome rules
- [x] 1.2 In `css/global.css`, add `body.is-full-screen .layer-cta .qty-dropdown` and `body.is-full-screen .layer-cta .qty-dropdown *` to the selector list on the `body.is-full-screen .layer *` rule

## 2. Check

- [ ] 2.1 Open the product gallery above 991px: `.qty-dropdown` border and text invert against the photos, `Add to cart` keeps its solid background, the dropdown still takes clicks. Close: border and text return to theme tokens
- [ ] 2.2 Open the gallery at 768-991px: the landscape `.qty-dropdown` inside `.layer` still inverts with the layer
- [ ] 2.3 Open the merch gallery: unchanged
