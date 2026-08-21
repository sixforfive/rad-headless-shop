## 1. CSS

- [x] 1.1 In `css/global.css`, add `.link-secondary.is-none` to the existing `display: none` list

## 2. Drawer chrome JS

- [x] 2.1 In `js/global.js`, look up `#cart-title` and `#currency-btn` next to the other drawer controls
- [x] 2.2 In `setDrawerButtons`, set `.is-none` on `#menu-open` and `#cart-open` when `kind !== null`, on `#lights-switch-btn` when `kind !== null`, and on `#cart-title` and `#currency-btn` when `kind !== "cart"`; leave `#menu-close` / `#cart-close` as they are
