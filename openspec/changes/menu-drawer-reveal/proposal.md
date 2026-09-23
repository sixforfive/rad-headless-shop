## Why

`.menu-drawer` opens as a finished block. Orders `1` and `2` should reveal as masked lines, then both order `3` nodes should enter from opposite sides.

## What Changes

- On menu open, order `1` reveals first, then order `2`, then both order `3` nodes together. The attribute is `{order}[-stagger]-{up|down}`.
- Orders `1` and `2` split into wrapped lines and reveal through a mask. Each line moves from `yPercent: 100` to `0` over `1.47s`, staggered `0.07s`, with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`. The host does not move. A line stays one row and does not rebreak. These orders do not fade.
- Order `2` starts when order `1`'s last line ends. Both order `3` nodes start when order `2`'s last line ends. `down` travels from above. `up` travels from below. Same duration and ease. Order `3` also fades in.
- Close plays the stages backward. `#menu-close` and a backdrop click also fade `.drawer-wrapper` out over `0.45s`.
- A same-origin link inside `.menu-drawer` plays the reverse and leaves the overlay up. The reverse is longer than the page sink.
- `.drawer-wrapper` opacity fades over `0.45s` on open and close for both the menu and the cart.
- `prefers-reduced-motion: reduce` snaps. No move, no fade, no line split.

## Capabilities

### New Capabilities

- `menu-drawer-reveal`: staged line reveal for orders `1` and `2`, then both order `3` nodes from opposite sides, the reverse on close and on a menu link, and the `0.45s` drawer shell fade.

### Modified Capabilities

- None.

## Impact

- `css/global.css` — masked lines, from-states, revealed rest state, `.drawer-wrapper` opacity duration, reduced motion.
- `js/global.js` — stage delays, line split that does not rebreak, play and reverse from `openDrawer`, `closeDrawer`, and `interceptPageClicks`.
- Published `menu-reveal` values stay as they are. No new dependency.
