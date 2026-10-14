## Why

The drawer overlay only fades its opacity, so the page behind it dissolves instead of blurring. The 48px backdrop blur used to live in Webflow and is gone, so the repo has to own the radius and ramp it.

## What Changes

- `.drawer-wrapper` rests at `blur(0px)` and reaches `blur(48px)` while `.is-visible` is set.
- The blur radius eases over `0.9s`. Overlay opacity stays a `0.45s` fade.
- Close waits for the blur transition before the drawer is hidden, so the blur-out is not cut when opacity ends.
- Menu and cart share `.drawer-wrapper`, so both ramp the same way.
- `prefers-reduced-motion: reduce` still snaps. No blur ramp.

## Capabilities

### New Capabilities

- `drawer-backdrop-blur`: backdrop blur radius on `.drawer-wrapper` for menu and cart, ramped in and out, held until the blur finishes on close.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — `backdrop-filter` and `-webkit-backdrop-filter` on `.drawer-wrapper` and `.drawer-wrapper.is-visible`.
- `js/global.js` — `fadeDrawerOut` hides after the blur transition ends.
- No new dependency. Webflow no longer sets this blur.
