## 1. Gallery opacity

- [x] 1.1 In `css/global.css`, while `html.is-gallery-fading`, do not apply the first-paint `display: none` on `.product-gallery-collection.is-default`, and keep `.gallery-full-screen` displayed
- [x] 1.2 Add `.is-fade-out.is-switching` and `.is-switching:not(.is-fade-out)` on `.gallery-full-screen` and `.product-gallery-collection.is-default`: opacity `0.3s ease` with no delay, and keep background, color, and border at `0.45s ease-out`. Leave the base `.gallery-full-screen` opacity at `0.45s ease-out`
- [x] 1.3 The surface fading out gets `pointer-events: none` immediately. Drawer dim (`.gallery-full-screen.is-dimmed` at opacity `0.2`) stays as it is

## 2. Settle after the fade

- [x] 2.1 In `js/product.js` `setFullScreenGallery`, on a user-driven open or close add `html.is-gallery-fading`, fade the shown gallery out, then fade the other in, and drop pointer events on the outgoing one at the start
- [x] 2.2 On mobile, use that same out-then-in sequence. Do not add `is-none` to `.product-gallery-collection.is-default`
- [x] 2.3 On `transitionend` for each phase, or immediately when `prefers-reduced-motion: reduce` or the computed duration is `0s`, continue to the next phase or settle. Settle removes `is-gallery-fading` and `.is-switching` and, on desktop, adds `is-none` to the surface that faded out. If `transitionend` does not fire, that phase falls back after `300ms`. A new call cancels an in-flight settle
- [x] 2.4 A persisted open (`html.is-full-screen` before script, no `is-gallery-fading`) does not run the fade

## 3. Cursor copy handoff

- [x] 3.1 In `css/global.css`, keep `.custom-cursor-label` enter/leave at opacity `0.15s ease-out`. Add `.is-out` at `opacity 0.3s ease` and `.is-in` at `opacity 0.3s ease 0.3s`
- [x] 3.2 In `js/global.js` `applyLabel`, create two stacked `.custom-cursor-label.text-meta` nodes that share one `translate3d`. On a non-empty to non-empty value change, put `.is-out` on the node still showing the old string without changing its text, and put the new string plus `.is-in` on the other. A change mid-handoff fades out the incoming node
- [x] 3.3 Enter and leave still use `.is-visible` at `0.15s ease-out`. Under `prefers-reduced-motion: reduce`, swap the string immediately

## 4. Reduced motion and note

- [x] 4.1 In the existing `prefers-reduced-motion` block in `css/global.css`, set transition duration to `0s` on the gallery switch selectors and on `.custom-cursor-label.is-out` / `.is-in`
- [x] 4.2 In `README.md`, on the `js/global.js` row, note that a `custom-cursor` string change fades the old copy out and the new copy in
