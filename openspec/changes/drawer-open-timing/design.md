## Context

See proposal.md. The shell and the two sequences already live in `js/global.js` and `css/global.css`. `.drawer-wrapper` fades opacity over `0.45s` `ease`. Its `::before` blurs `0px` to `32px` over `0.9s` `ease`. `.main-wrapper.is-dimmed` and `.gallery-full-screen.is-dimmed` already fade over `0.45s` `ease-out`. `playMenuReveal(true)` adds `is-revealed` in the same turn as `is-visible`. `playCartReveal(true)` waits `CART_OPEN_GAP` (`0.3`) after the rows are ready. `closeDrawer` starts the menu fade at `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS` (`600`) and the cart fade at `cartRevealReverseMs() + CART_CLOSE_GAP * 1000` (`0.3`). `radMenuLeaveTo` uses that same `600` so the page is gone before the drawer fades. Hide still waits for the blur `transitionend`.

## Goals / Non-Goals

**Goals:**

- One open gap and one close gap, both `0.3s`, read by the menu and the cart.
- Blur and overlay opacity use `0.45s` `ease-out`. Dim stays on the values it already has.

**Non-Goals:**

- Line, row, order-3, and bottom-gap durations or eases.
- `radMenuLeaveTo`. It keeps `MENU_LEAVE_TAIL_MS`.
- Dim opacity targets, blur radius, empty-cart immediate fade, reduced-motion snap.

## Decisions

**Two constants beside the existing clocks.**

```js
const DRAWER_OPEN_GAP = 0.3;
const DRAWER_CLOSE_GAP = 0.3;
```

`CART_OPEN_GAP` and `CART_CLOSE_GAP` go away. Both drawers read the shared pair. Alternative considered: leave the cart names and set them equal to the shared ones. Rejected — two names for one pause is how the clocks drifted.

**The open gap is a wait before `is-revealed`, not a delay baked into the stages.** `playMenuReveal(true)` still splits, writes timing, and flushes layout, then waits `DRAWER_OPEN_GAP * 1000` before adding `is-revealed`. `playCartReveal(true)` keeps its image wait, then uses `DRAWER_OPEN_GAP` instead of `CART_OPEN_GAP`. A close or a swap during the pause must not reveal: the menu gets the same token `playCartReveal` already uses, and the timeout checks it plus `activeDrawer`. Reduced motion adds `is-revealed` in that same turn. Alternative considered: add `0.3s` to every CSS delay. Rejected — the close reverse would then sit still before the first line leaves.

**The menu close branch adds the gap.** `closeDrawer` waits `menuRevealReverseMs() + DRAWER_CLOSE_GAP * 1000` before `fadeDrawerOut`. The cart branch uses `DRAWER_CLOSE_GAP` in the sum it already has. `MENU_LEAVE_TAIL_MS` stays, and only `radMenuLeaveTo` reads it. Alternative considered: drive the link leave off `DRAWER_CLOSE_GAP` too. Rejected — that sequence has to finish the page fade while the drawer is still opaque. A pause after the lines would hold a still drawer over a cleared page.

**Shell easing is CSS only.** `.drawer-wrapper` opacity and `.drawer-wrapper::before` blur both become `0.45s` `ease-out`. The dim rules are already `0.45s` `ease-out`, so they stay. The hide listener still keys off `backdrop-filter`. At `0.45s` it fires with the opacity fade, which is the new "finish together" behavior. No JS change there.

## Risks / Trade-offs

- [Menu close used to fade during the last `0.6s` of the line] → The shell now holds `0.3s` after the reverse. That hold is `DRAWER_CLOSE_GAP`.
- [An open timeout can add `is-revealed` after a fast close] → The menu token is bumped on both open and close, same as `cartRevealToken`.
- [Blur no longer outlasts the opacity fade] → Hide still waits for the blur `transitionend`, which is now the same `0.45s`.
