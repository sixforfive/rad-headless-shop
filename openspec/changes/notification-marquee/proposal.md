## Why

The navbar notification sits between `[` `]` brackets with two identical CMS copies already in the item, but the text is static. It should scroll continuously so the banner catches the eye, looping without a visible jump.

## What Changes

- CSS in `css/global.css` animates `.notification-item` with `translateX(0)` → `translateX(-50%)`, linear, infinite, so the second copy resets the loop.
- Hover on `.notification-holder` pauses the animation.
- Motion always runs (letter-limited copy; no “fits so stop” check).

## Capabilities

### New Capabilities

- `notification-marquee`: Navbar notification text scrolls as an infinite CSS loop between the `.text-meta` brackets.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- Webflow markup is already published (collection limit 1, two `.notification-text` nodes, clip on `.notification-holder`).
- No JS. No GSAP. No new dependencies. No Shopify changes.
