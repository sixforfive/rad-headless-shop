## 1. Shared gaps

- [x] 1.1 In `js/global.js`, add `DRAWER_OPEN_GAP` `0.3` and `DRAWER_CLOSE_GAP` `0.3` next to the menu and cart clocks. Delete `CART_OPEN_GAP` and `CART_CLOSE_GAP`.

## 2. Open wait

- [x] 2.1 In `playMenuReveal` in `js/global.js`, bump a token on open and on close. On open, after the split, the timing write, and the reflow, add `is-revealed` in that turn when reduced motion is set or `DRAWER_OPEN_GAP` is `0`. Otherwise wait `DRAWER_OPEN_GAP * 1000` and add `is-revealed` only if the token and `activeDrawer === "menu"` still match.
- [x] 2.2 In `playCartReveal` in `js/global.js`, wait `DRAWER_OPEN_GAP` instead of `CART_OPEN_GAP`. Leave the image-ready wait, the empty-cart return, and the reduced-motion snap.
- [x] 2.3 In the `js/global.js` explainer, change the `playMenuReveal` line so it says the open waits `DRAWER_OPEN_GAP` before `is-revealed`.

## 3. Close wait

- [x] 3.1 In `closeDrawer` in `js/global.js`, set the menu wait to `menuRevealReverseMs() + DRAWER_CLOSE_GAP * 1000` and the cart wait to `cartRevealReverseMs() + DRAWER_CLOSE_GAP * 1000`. Leave `radMenuLeaveTo` on `MENU_LEAVE_TAIL_MS`.

## 4. Shell easing

- [x] 4.1 In `css/global.css`, set `.drawer-wrapper` opacity and `.drawer-wrapper::before` blur to `0.45s` `ease-out`. Leave the dim rules at `0.45s` `ease-out`.
