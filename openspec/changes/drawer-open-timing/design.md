## Context

See proposal.md. The shell and the two sequences live in `js/global.js` and `css/global.css`. `.drawer-wrapper` opacity used to ease, and `::before` used to ease the blur radius from `0px` to `32px`. That pair snapped at the end. `playMenuReveal(true)` now waits `DRAWER_OPEN_GAP` (`0.3`) before `is-revealed`. `playCartReveal(true)` waits `DRAWER_SHELL` (`0.45`) after the rows are ready. `closeDrawer` starts the menu veil at `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS` (`600`) and the cart veil at `cartRevealReverseMs() + DRAWER_CLOSE_GAP * 1000` (`0.3`). `radMenuLeaveTo` uses that same `600`.

## Goals / Non-Goals

**Goals:**

- One veil: fixed `32px` blur, opacity `0.45s` `ease-out`.
- Menu content at `0.3s`. Cart content at `0.45s`.
- Menu close when the last line is out of sight. Cart close `0.3s` after the reverse.

**Non-Goals:**

- Cart row, title, and bottom-gap durations. They stay on their own constants.
- `radMenuLeaveTo`. It already uses `MENU_LEAVE_TAIL_MS`.
- Dim opacity targets. Reduced-motion snap.

## Decisions

**Three constants beside the existing clocks.**

```js
const DRAWER_OPEN_GAP = 0.3;
const DRAWER_CLOSE_GAP = 0.3;
const DRAWER_SHELL = 0.45;
```

`CART_OPEN_GAP` and `CART_CLOSE_GAP` are gone. The menu open reads `DRAWER_OPEN_GAP`. The cart open reads `DRAWER_SHELL`. The cart close reads `DRAWER_CLOSE_GAP`. The menu close does not. Alternative considered: one gap for both drawers. Rejected — the menu's masked line ease already lands when the veil ends, and the cart's short ease does not.

**The open wait is before `is-revealed`, not a delay baked into the stages.** `playMenuReveal(true)` splits, writes timing, flushes, then waits `DRAWER_OPEN_GAP * 1000`. `playCartReveal(true)` keeps its image wait, then waits `DRAWER_SHELL * 1000`. An empty cart skips the row sequence and uses that same wait, then fades `.empty-cart` over `CART_EMPTY_FADE` (`0.3s`) `ease-out`. On close the veil starts when that fade ends. Each has a token. The timeout adds `is-revealed` only if the token and the active drawer still match. Reduced motion reveals in that same turn. Alternative considered: add the wait to every CSS delay. Rejected — the close reverse would sit still before the first line leaves.

**Menu close keeps the tail.** `closeDrawer` waits `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS` before `fadeDrawerOut`. The cart branch waits `cartRevealReverseMs() + DRAWER_CLOSE_GAP * 1000`. Adding `DRAWER_CLOSE_GAP` after the menu reverse left a pause once the line was already clipped. Alternative considered: drive the menu link leave off `DRAWER_CLOSE_GAP`. Rejected — that sequence has to finish the page fade while the drawer is still opaque.

**The veil is `::before` opacity. The radius does not ease.** `::before` is `blur(32px)` the whole time and fades opacity over `0.45s` `ease-out`. `.drawer-wrapper` opacity has no transition: `0` at rest, `1` while `.is-visible`. `fadeDrawerOut` sets inline opacity `1` before removing `.is-visible`, so the veil can fade, and clears it when the `opacity` `transitionend` fires. `radMenuLeaveTo` holds that same inline opacity across its `0.45s` fade. The dim rules stay `0.45s` `ease-out`.

## Risks / Trade-offs

- [The blur radius no longer eases] → The veil opacity is the ramp. A radius ease snapped when it landed.
- [An open timeout can add `is-revealed` after a fast close] → The menu token and the cart token are bumped on both open and close.
- [Inline opacity left at `1` would show a closed drawer] → `fadeDrawerOut`, the reduced-motion path, `radMenuLeaveTo`, and `resetDrawerState` clear it.
