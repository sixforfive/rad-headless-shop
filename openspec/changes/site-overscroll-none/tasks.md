## 1. CSS

- [x] 1.1 In `css/global.css`, add `overscroll-behavior: none` on `html` and `body`; retitle the `html` background comment to theme canvas, not overscroll
- [x] 1.2 Delete the `html:has(.section_home-page), body:has(.section_home-page)` lock block
- [x] 1.3 Delete `body::before` and remove `body::before` from the `prefers-reduced-motion` list; leave `body.is-scroll-locked`

## 2. Check

- [x] 2.1 Collection `/`: no extra canvas strip below the hero; shop `/shop` still scrolls; navbar / `.layer.is-blend` still invert at rest
