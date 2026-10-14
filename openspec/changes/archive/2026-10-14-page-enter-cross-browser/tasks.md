## 1. Rise rules

- [x] 1.1 In `css/global.css`, set `.main-wrapper` to `opacity: 0` and `transform: translateY(0.75rem)` without `:has()`. Keep `.products-collection.is-leaving` on that same from-state
- [x] 1.2 Lock `/` with `html:has(.collection-hero-logo) .main-wrapper` at `opacity: 1` and `transform: none`. Add `html.is-ready:has(.collection-hero-logo)` and `html.is-leaving:has(.collection-hero-logo)` rules that outrank the generic ready and leave rules and keep the same values
- [x] 1.3 Set `html.is-ready .main-wrapper` and the resting `.products-collection` to `transform: translateY(0)`. Set `html.is-leaving .main-wrapper` to `opacity: 0` and `transform: translateY(0.75rem)`
- [x] 1.4 Leave the reduced-motion block covering `.main-wrapper` at duration `0s`

## 2. Reveal timing

- [x] 2.1 In `revealPage` in `js/global.js`, read `documentElement.offsetWidth`, then add `html.is-ready` inside a second `requestAnimationFrame`. Leave the `pageshow` restore path adding `is-ready` immediately
