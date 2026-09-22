## 1. CSS

- [x] 1.1 In `css/global.css`, delete the `html.lenis.lenis-stopped` rule (`overflow: clip`); leave `html.lenis, html.lenis body { height: auto }` and `body.is-scroll-locked`
- [x] 1.2 In `css/global.css`, change the companion selectors to `html.lenis:not(.lenis-stopped), html.lenis:not(.lenis-stopped) body`; leave `body.is-scroll-locked`

## 2. Check

- [ ] 2.1 Open menu and cart: lists scroll when taller than the viewport; page behind stays locked
