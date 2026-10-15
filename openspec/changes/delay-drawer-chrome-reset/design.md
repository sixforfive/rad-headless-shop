## Context

See proposal.md for motivation. `closeDrawer` in `js/global.js` no longer restores chrome. `fadeDrawerOut` removes `is-visible`, which starts the `backdrop-filter` transition from `blur(32px)` to `blur(0px)` over `0.9s`. `hideDrawerOverlay` runs after that transition ends. `radMenuLeaveTo` and `resetDrawerState` already call `setDrawerButtons(null)` themselves.

## Goals / Non-Goals

**Goals:**

- One restore point: the same turn `is-visible` comes off and the blur starts.

**Non-Goals:**

- Delaying the page dim or the notification bar. Those clear at the start of `fadeDrawerOut`.
- Changing `radMenuLeaveTo` or `resetDrawerState`. Both already restore chrome on their own.
- CSS, Webflow markup, or the open and swap paths.

## Decisions

### Restore chrome in `fadeDrawerOut`, with the blur

`setDrawerButtons(null)` stays out of `closeDrawer`. Call it in `fadeDrawerOut` in the same turn as `classList.remove("is-visible")`. That is the frame the blur starts. The reverse timer, the empty-cart immediate fade, and reduced motion all reach that function before the overlay is removed.

`radMenuLeaveTo` still restores at the start of a page leave. It does not go through `fadeDrawerOut`.

Alternative considered: restore in `hideDrawerOverlay`, after `transitionend` on `backdrop-filter`. Rejected — that is after the blur has finished, which is too late.

## Risks / Trade-offs

- [Backdrop-filter `transitionend` never fires] → The overlay stays up. Chrome has already returned with the blur. Same hide failure as before.
- [jsDelivr cache] → New SHA on the Footer `global.js` script after commit. Do not rely on `@main`.

## Migration Plan

1. Move the closed-chrome call to `fadeDrawerOut`, beside the `is-visible` removal.
2. After commit, point the site-wide Footer `<script>` for `global.js` at the new SHA and publish Webflow.
3. Rollback: revert the SHA (or `js/global.js`). Markup is unchanged.
