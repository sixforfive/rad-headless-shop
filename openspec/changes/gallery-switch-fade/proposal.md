## Why

Opening and closing the full-screen gallery cuts between `.product-gallery-collection.is-default` and `.gallery-full-screen` with `display: none`. The cursor label swaps its string in the same frame. Both should dissolve instead of popping.

## What Changes

- On viewports wider than 767px, opening fades `.gallery-full-screen` in and `.product-gallery-collection.is-default` out together; closing reverses it. Opacity `0.8s ease` on both, starting together. The surface fading out drops pointer events immediately.
- On viewports 767px wide and narrower, `.product-gallery-collection.is-default` stays up. Only `.gallery-full-screen` fades in and out over it.
- `is-none` (`display: none`) applies after the fade, not before it. A gallery already open on first paint (next-product flag) stays an instant paint.
- Drawer dim and the theme color fade stay on their current timing.
- When `custom-cursor` changes from one non-empty value to another, the old copy fades out with `opacity 0.3s ease` and the new copy fades in with `opacity 0.3s ease 0.3s` — the same handoff as `#menu-open` / `#menu-close`. Enter and leave stay `0.15s ease-out`.
- `prefers-reduced-motion: reduce` makes both fades instant.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: Open and close crossfade the two galleries on desktop and fade only the full-screen gallery on mobile. Settled `is-none` comes after the fade. An already-open first paint does not fade.
- `cursor-label`: Switching from one non-empty `custom-cursor` value to another fades the copy out, then in, with the menu open/close opacity timing. Enter and leave stay as they are.

## Impact

- `css/global.css` — gallery opacity crossfade; two cursor labels with the menu opacity pair.
- `js/product.js` — `setFullScreenGallery` keeps the outgoing node displayed until the fade ends, then applies `is-none`. Merch detail uses the same nodes and this function.
- `js/global.js` — `applyLabel` inside `initCursorLabel` swaps two stacked labels instead of replacing `textContent` on the visible one.
- No Webflow markup. No new dependency.
