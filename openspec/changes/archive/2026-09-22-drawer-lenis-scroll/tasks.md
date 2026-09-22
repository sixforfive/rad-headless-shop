## 1. CSS

- [x] 1.1 In `css/global.css`, delete the `html.lenis.lenis-stopped` rule (`overflow: clip`); leave `html.lenis, html.lenis body { height: auto }` and `body.is-scroll-locked`
- [x] 1.2 In `css/global.css`, change the companion selectors to `html.lenis:not(.lenis-stopped), html.lenis:not(.lenis-stopped) body`; leave `body.is-scroll-locked`

## 2. JS

- [x] 2.1 In `js/global.js` `openDrawer`, set `data-lenis-prevent` on the shown drawer and remove it from the hidden one
- [x] 2.2 In `js/global.js` `hideDrawerOverlay`, remove `data-lenis-prevent` from both drawers

## 3. Check

- [x] 3.1 Open menu and cart: lists scroll when taller than the viewport; page behind stays locked; closed drawers have no `data-lenis-prevent`
