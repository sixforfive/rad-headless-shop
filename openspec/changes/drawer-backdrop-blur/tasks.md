## 1. Blur radius

- [x] 1.1 In `css/global.css`, set `.drawer-wrapper` to `backdrop-filter: blur(0px)` and `-webkit-backdrop-filter: blur(0px)`, and transition both over `0.9s ease`. Keep the opacity transition at `0.45s ease`
- [x] 1.2 `.drawer-wrapper.is-visible` sets both filters to `blur(48px)`

## 2. Close

- [x] 2.1 In `js/global.js`, `fadeDrawerOut` hides the drawer on `backdrop-filter` or `-webkit-backdrop-filter` `transitionend`, not on opacity
- [x] 2.2 Reduced motion still hides immediately and does not ramp the blur
