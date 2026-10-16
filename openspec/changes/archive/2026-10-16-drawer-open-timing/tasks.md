## 1. Shared gaps

- [x] 1.1 In `js/global.js`, add `DRAWER_OPEN_GAP` `0.3`, `DRAWER_CLOSE_GAP` `0.3`, and `DRAWER_SHELL` `0.45` next to the menu and cart clocks. Delete `CART_OPEN_GAP` and `CART_CLOSE_GAP`.

## 2. Open wait

- [x] 2.1 In `playMenuReveal` in `js/global.js`, bump a token on open and on close. On open, after the split, the timing write, and the reflow, add `is-revealed` in that turn when reduced motion is set or `DRAWER_OPEN_GAP` is `0`. Otherwise wait `DRAWER_OPEN_GAP * 1000` and add `is-revealed` only if the token and `activeDrawer === "menu"` still match.
- [x] 2.2 In `playCartReveal` in `js/global.js`, wait `DRAWER_SHELL` instead of `CART_OPEN_GAP`. Leave the image-ready wait and the reduced-motion snap.
- [x] 2.4 In `playCartReveal` and `closeDrawer` in `js/global.js`, an empty cart waits `DRAWER_SHELL` then fades `.empty-cart` over `CART_EMPTY_FADE` (`0.3s`). On close, the veil starts after that fade.
- [x] 2.3 In the `js/global.js` explainer, change the `playMenuReveal` line so it says the open waits `DRAWER_OPEN_GAP` before `is-revealed`.

## 3. Close wait

- [x] 3.1 In `closeDrawer` in `js/global.js`, set the menu wait to `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS` and the cart wait to `cartRevealReverseMs() + DRAWER_CLOSE_GAP * 1000`. Leave `radMenuLeaveTo` on `MENU_LEAVE_TAIL_MS`.

## 4. Veil

- [x] 4.1 In `css/global.css`, keep `::before` at `blur(32px)` and fade its opacity over `0.45s` `ease-out`. Do not ease `.drawer-wrapper` opacity. Leave the dim rules at `0.45s` `ease-out`.
- [x] 4.2 In `fadeDrawerOut` in `js/global.js`, hold inline opacity at `1` while `.is-visible` is removed, hide on the veil `opacity` `transitionend`, then clear the inline opacity. Do the same hold in `radMenuLeaveTo`. Clear it on the reduced-motion path and in `resetDrawerState`.
