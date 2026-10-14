## 1. CSS

- [x] 1.1 In `css/global.css`, add `.gallery-full-screen` next to `.main-wrapper` on the opacity, transition, and `.is-dimmed` rules
- [x] 1.2 Add `.gallery-full-screen` to the `prefers-reduced-motion` transition-duration kill list

## 2. Drawer dim JS

- [x] 2.1 In `js/global.js`, look up `.gallery-full-screen` next to `.main-wrapper` as `dimGallery` (not `galleryFullScreen`; that name is already a `const` in `product.js`)
- [x] 2.2 In `openDrawer`, add `is-dimmed` to `.gallery-full-screen` as well as `.main-wrapper`; in `closeDrawer`, remove it from both; optional chaining when the gallery node is missing
