## Why

The navbar notification sits between `[` `]` brackets with three identical CMS copies in the item, but the text is static. It should scroll continuously so the banner catches the eye, looping without a visible jump. Empty brackets must not remain when the Notifications collection has no published item.

## What Changes

- CSS in `css/global.css` animates `.notification-item` with `translateX(0)` → `translateX(calc(-100% / 3))`, linear, infinite, so one of the three copies resets the loop.
- Hover on `.notification-holder` pauses the animation.
- Motion always runs (letter-limited copy; no “fits so stop” check).
- JS in `js/global.js` adds `.is-none` to `.notification-bar-box` when no `.notification-item` is in the DOM. Closing a drawer does not remove `.is-none` in that case.
- When the bar is empty, `.menu-cart-wrapper` uses `padding-top: var(--_layout---spacing--space-400)`.
- Record CMS collection slug `notifications` in the Webflow rule.

## Capabilities

### New Capabilities

- `notification-marquee`: Navbar notification text scrolls as an infinite CSS loop between the `.text-meta` brackets, and the bar is hidden when the collection has no published item.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- `js/global.js` (already loaded site-wide).
- `.cursor/rules/webflow-rad.mdc` (Notifications slug).
- Webflow markup is already published (collection limit 1, three `.notification-text` nodes, clip on `.notification-holder`). `.notification-bar-box.is-none` already sets `display: none`.
- No GSAP. No new dependencies. No Shopify changes.
