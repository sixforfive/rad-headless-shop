## 1. Chrome opacity

- [x] 1.1 In `css/global.css`, next to the fullscreen chrome rules, set `opacity 0.3s ease` on `.layer`, `.layer-cta`, and `.product-nav-tab`, and keep `background-color`, `color`, and `border-color` at `0.45s ease-out`
- [x] 1.2 `html.is-chrome-fading` sets opacity `0` on those three nodes
- [x] 1.3 Add `.layer`, `.layer-cta`, and `.product-nav-tab` to the `prefers-reduced-motion` `transition-duration: 0s` list

## 2. Desktop open and close

- [x] 2.1 In `js/product.js`, desktop click open and close add `is-chrome-fading` on `html`, wait for `opacity` `transitionend` on the first existing node of `.layer`, `.layer-cta`, `.product-nav-tab` or 300ms, call `syncGalleryChrome`, then remove `is-chrome-fading`
- [x] 2.2 Boot restore, the `matchMedia` change listener, mobile open and close, and `prefers-reduced-motion: reduce` call `syncGalleryChrome` in the same turn and do not add `is-chrome-fading`
- [x] 2.3 A second click during the fade increments a token. A stale `transitionend` does not call `syncGalleryChrome` or remove `is-chrome-fading`
