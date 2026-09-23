## Why

`.menu-drawer` opens as a finished block. The copy should arrive in the order marked on `menu-reveal`, and leave in reverse, inside the same `0.45s` the page already uses to sink.

## What Changes

- On menu open, each `[menu-reveal]` moves into place. The attribute is `{order}[-stagger]-{up|down}`. Shared orders start together. `up` travels up from `+1.25rem`. `down` travels down from `-1.25rem`.
- Orders `1` and `2` move only. Order `3` and above also fade in.
- `stagger` splits that node's text into wrapped lines. Each line is masked and moves on its own. The host does not move.
- The whole sequence lasts `0.45s` with `ease-out`. Close plays it backwards.
- `#menu-close` and a backdrop click reverse the sequence and fade `.drawer-wrapper` out over `0.45s`.
- A same-origin link inside `.menu-drawer` reverses the sequence in parallel with the page leave. The overlay stays up for the leave.
- `.drawer-wrapper` opacity fades over `0.45s` on open and close for both the menu and the cart.
- `prefers-reduced-motion: reduce` snaps. No move, no fade, no line split.

## Capabilities

### New Capabilities

- `menu-drawer-reveal`: ordered move and fade of `[menu-reveal]` inside `.menu-drawer`, the line stagger, the reverse on close and on a menu link, and the `0.45s` drawer shell fade.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — from-states, revealed rest state, `.drawer-wrapper` opacity duration, reduced motion.
- `js/global.js` — play and reverse from `openDrawer`, `closeDrawer`, and `radLeaveTo`. Line split on the stagger node.
- Published `menu-reveal` values stay as they are. No new dependency.
