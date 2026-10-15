## Context

See proposal.md for motivation. `setDrawerButtons(null)` runs at the start of `closeDrawer` in `js/global.js`, before the reverse and before `fadeDrawerOut`. `hideDrawerOverlay` runs after the backdrop-filter fade (or immediately under reduced motion) and returns early when a drawer reopened. `radMenuLeaveTo` and `resetDrawerState` already call `setDrawerButtons(null)` themselves.

## Goals / Non-Goals

**Goals:**

- One restore point: the moment the overlay is actually hidden.

**Non-Goals:**

- Delaying the page dim or the notification bar. Those clear at the start of `fadeDrawerOut`.
- Changing `radMenuLeaveTo` or `resetDrawerState`. Both already restore chrome on their own.
- CSS, Webflow markup, or the open and swap paths.

## Decisions

### Restore chrome in `hideDrawerOverlay`, not at the start of close

Remove `setDrawerButtons(null)` from `closeDrawer`. Call it in `hideDrawerOverlay` after the `activeDrawer !== null` return. The reverse timer, the empty-cart immediate fade, and reduced motion all end in that function, so the closed set lands when `.drawer-wrapper` is hidden. A reopen during the fade hits the early return, and `openDrawer` has already set the new drawer's chrome.

`radMenuLeaveTo` still restores at the start of a page leave. A second call from `hideDrawerOverlay` is the same closed set.

Alternative considered: restore at the start of `fadeDrawerOut`. Rejected — the overlay is still on screen for the fade, which is the moment the navbar currently snaps too early.

## Risks / Trade-offs

- [Backdrop-filter `transitionend` never fires] → Chrome stays in the open set and the overlay stays up. Same failure the hide path already has.
- [jsDelivr cache] → New SHA on the Footer `global.js` script after commit. Do not rely on `@main`.

## Migration Plan

1. Move the closed-chrome call to `hideDrawerOverlay`.
2. After commit, point the site-wide Footer `<script>` for `global.js` at the new SHA and publish Webflow.
3. Rollback: revert the SHA (or `js/global.js`). Markup is unchanged.
