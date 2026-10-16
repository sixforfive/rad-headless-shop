## Why

Removing the last cart line shrinks that row, then `renderCart` shows `.empty-cart` while `.cart-drawer` is already `is-revealed`. The copy is already at full opacity, so it pops in. Opening an empty cart already waits `0.45s`, then fades that copy over `0.3s` with `ease-out`. The last-item empty state should use that same fade.

## What Changes

- After the last line finishes shrinking and the drawer stays open, `.empty-cart` starts at opacity `0`, waits `0.45s`, then fades to `1` over `0.3s` with `ease-out`.
- `.cart-bottom` stays where the filled cart left it. It does not fade out and back in.
- Reduced motion still shows the empty state at rest, with no wait.
- A close during that wait does not fade the copy in afterward.
- Opening an already-empty cart, removing a line that is not the last, and changing quantity stay as they are.

## Capabilities

### New Capabilities

### Modified Capabilities

- `cart-drawer-reveal`: When the last line is removed and the drawer stays open, `.empty-cart` fades in on the empty-open clocks instead of appearing at full opacity.

## Impact

- `js/cart.js` — empty branch of `renderCart` after the last-line collapse.
- `js/global.js` — reuse `DRAWER_SHELL` (`0.45`) and `CART_EMPTY_FADE` (`0.3`). No new durations.
- `css/global.css` — the existing `.empty-cart` opacity transition (`--cart-empty-duration`, `ease-out`) is the fade. No new ease.
- No Webflow markup change. No new dependency.
