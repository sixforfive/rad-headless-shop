## 1. Marquee CSS

- [x] 1.1 In `css/global.css`, animate `.notification-item` from `translateX(0)` to `translateX(-50%)`, linear, infinite, 20s
- [x] 1.2 Pause that animation while `.notification-holder` is hovered (`animation-play-state: paused`)
- [x] 1.3 Change the keyframe to `translateX(calc(-100% / 3))` for three `.notification-text` copies; keep 30s

## 2. Empty bar

- [x] 2.1 In `js/global.js`, add `hideNotificationIfEmpty`: if `.notification-bar-box` has no `.notification-item`, add `.is-none`; call on load
- [x] 2.2 In `closeDrawer`, remove `.is-none` from `.notification-bar-box` only when a `.notification-item` exists
- [x] 2.3 Record Notifications collection slug `notifications` (navbar list, limit 1) in `.cursor/rules/webflow-rad.mdc`
- [x] 2.4 In `css/global.css`, at `max-width: 767px`, set `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` `padding-top` to `var(--_layout---spacing--space-400)` when `body:has(.notification-bar-box.is-none)`
