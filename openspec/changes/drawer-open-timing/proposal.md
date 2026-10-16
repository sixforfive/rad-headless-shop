## Why

The blur radius eased for `0.9s` while the page dim and the overlay opacity eased for `0.45s`, and the overlay fade made the blur snap at the end. The menu content started with the shell. The cart content started during it. On close, the menu sat still after the text was already gone.

## What Changes

- The backdrop blur stays `32px`. `.drawer-wrapper::before` fades its opacity over `0.45s` with `ease-out`. `.drawer-wrapper` opacity snaps. The page dim stays `0.45s` `ease-out`: `.main-wrapper` to `0.3`, `.gallery-full-screen` to `0.2`.
- Menu reveal starts `0.3s` after the open (`DRAWER_OPEN_GAP`). Cart titles, rows, subtotal, and bottom start `0.45s` after the open (`DRAWER_SHELL`), once the veil and the dim have finished. An empty cart fades `.empty-cart` over `0.3s` `ease-out` on that same `0.45s`, and the veil waits for that fade on close.
- Cart close waits `0.3s` after the reverse (`DRAWER_CLOSE_GAP`), then the veil fades. Menu close starts the veil `0.6s` before the last line's transition ends, which is when that line is already out of sight. A menu link that leaves the page keeps that same early fade.

## Capabilities

### New Capabilities

- `drawer-open-timing`: The veil, the menu open gap, the cart open wait, and the two close waits.

### Modified Capabilities

- `drawer-backdrop-blur`: The radius stays `32px`. The veil opacity fades over `0.45s` `ease-out`. The drawer hides when that fade ends.
- `menu-drawer-reveal`: The line stages start `0.3s` after the open. Button and backdrop close start the veil `0.6s` before the last line's transition ends.

## Impact

- `js/global.js` — `DRAWER_OPEN_GAP`, `DRAWER_SHELL`, `DRAWER_CLOSE_GAP`, the menu open wait, the cart open wait, and the menu close wait.
- `css/global.css` — the veil. The dim rules stay.
- No Webflow markup. No new dependency.
