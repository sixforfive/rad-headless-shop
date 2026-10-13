## Why

Following a link from the open menu has two problems. The menu copy, the drawer, and the page underneath have no set order. And the dimmed page jumps down `0.75rem` with no transition. Separately, when the menu closes without a page change, the drawer sits still for about `0.5s` after its copy has visually finished leaving. The jump happens because `html.is-leaving .main-wrapper` and `html.is-ready .main-wrapper.is-dimmed` have the same specificity. The dim rule comes later, so it keeps the opacity at `0.3`, while the leave's `translateY` still applies with no `transform` transition. The dead time comes from the reveal ease: its last ~`0.45s` moves each line less than 4% of its height.

## What Changes

- A menu-link leave runs in a fixed order. First the menu copy plays backward. When the last line is visually out, the drawer shell and the dimmed page content fade out together. The next page loads only after that fade ends.
- The dimmed page content fades to transparent in place during a leave. It does not move down.
- On `#menu-close` and backdrop close, the drawer shell fade starts when the reverse is visually done, not when its timer ends. This removes the dead time. The menu-link leave uses the same early start.
- Pressing Back after a drawer leave restores the page with every drawer closed. Today the back/forward cache brings back an empty overlay, a locked scroll, and dimmed content.
- **BREAKING** (behavior): the open menu no longer stays on screen for the whole leave. It fades out before navigation. An open cart drawer still stays through a leave.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `page-load-transition`: "Open drawer stays through the leave" now applies only to the cart drawer. A menu-link leave fades the drawer and the dimmed content before navigating. Dimmed content does not move during a leave. A new requirement says a back/forward restore shows every drawer closed.
- `menu-drawer-reveal`: "A menu link reverses without hiding the drawer" becomes a sequenced leave: reverse first, then the shell and page fade, then navigation. "Close and backdrop play the stages backward" starts the shell fade when the last line is visually out.

## Impact

- `js/global.js`: `closeDrawer`, `interceptPageClicks`, `radLeaveTo`, a new menu-leave sequencer, and the `pageshow` restore.
- `css/global.css`: a leave rule for `.main-wrapper.is-dimmed` and `.gallery-full-screen.is-dimmed`.
- No new dependencies. Webflow markup is unchanged.
