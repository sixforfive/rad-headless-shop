## 1. Marquee CSS

- [x] 1.1 In `css/global.css`, animate `.notification-item` from `translateX(0)` to `translateX(-50%)`, linear, infinite, 20s
- [x] 1.2 Pause that animation while `.notification-holder` is hovered (`animation-play-state: paused`)

## 2. Empty bar

- [x] 2.1 In `js/global.js`, add `hideNotificationIfEmpty`: if `.notification-bar-box` has no `.notification-item`, add `.is-none`; call on load
- [x] 2.2 In `closeDrawer`, remove `.is-none` from `.notification-bar-box` only when a `.notification-item` exists
- [x] 2.3 Record Notifications collection slug `notifications` (navbar list, limit 1) in `.cursor/rules/webflow-rad.mdc`
