## Why

Opening the menu and opening the cart do not share a clock. The blur runs `0.9s` on `ease` while the page dim and the overlay opacity run `0.45s`, and the menu content starts in the same turn as that shell. The cart already waits `0.3s` before its sequence and `0.3s` after the reverse. The menu close does the opposite: the shell fade starts `0.6s` before the last line ends.

## What Changes

- Blur, page dim, and overlay opacity all run `0.45s` with `ease-out`, starting together. The blur radius stays `32px`. The dimmed opacities stay `0.3` on `.main-wrapper` and `0.2` on `.gallery-full-screen`.
- Add `DRAWER_OPEN_GAP` at `0.3s`. Menu lines and cart rows start after that pause. An empty cart still has no sequence.
- Add `DRAWER_CLOSE_GAP` at `0.3s`. After the menu or cart reverse finishes, the shell waits that long, then fades. `#menu-close`, `#cart-close`, `#keep-shopping`, and a backdrop click use it. The menu-link page leave keeps its early fade.
- Line, row, and order-3 durations and eases stay as they are. Reduced motion still snaps.

## Capabilities

### New Capabilities

- `drawer-open-timing`: Shared open and close gaps, and a `0.45s` `ease-out` shell, for both drawers.

### Modified Capabilities

- `drawer-backdrop-blur`: The blur ramp is `0.45s` `ease-out`. The drawer still hides when the blur ends, which is now the same moment the overlay opacity ends.
- `menu-drawer-reveal`: The line stages start after the open gap. Button and backdrop close wait the close gap after the reverse, instead of fading `0.6s` early.

## Impact

- `js/global.js` — the two gap constants, the menu open wait, and the menu close wait.
- `css/global.css` — blur duration and the shell easings.
- No Webflow markup. No new dependency.
