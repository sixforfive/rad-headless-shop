## Context

See proposal.md for motivation. Clip drop and `height: auto` scoped off while stopped are live. Lists still do not scroll. Designer inner-scroll means Webflow already owns overflow. `openDrawer` still calls `radLenisStop()` and adds `body.is-scroll-locked`. Stopped Lenis `preventDefault`s cancelable wheel/touch unless a node on the path has `data-lenis-prevent`. Only `.product-gallery-col` has that attr.

## Goals / Non-Goals

**Goals:**

- Let Webflow drawer overflow receive gestures while Lenis is stopped and the page stays locked.

**Non-Goals:**

- Turning `syncTouch` on.
- Dropping `radLenisStop` / `radLenisStart`.
- Changing Webflow overflow or height on the lists.
- Reverting the clip / `height: auto` CSS cuts.

## Decisions

### `data-lenis-prevent` on the drawers

Set `data-lenis-prevent` on `.menu-drawer` and `.cart-drawer` when they open; remove it on close. Keep `radLenisStop` so the page behind stays frozen. Keep `body.is-scroll-locked`.

Alternative considered: more CSS (`overflow` / `max-height`). Rejected — the scrollport already exists; Lenis eats the gesture.

Alternative considered: stop calling `radLenisStop`. Rejected — window Lenis must stay frozen behind the drawer.

## Risks / Trade-offs

- [Gestures on the dimmed page still move the drawer] → Attr is on the drawer panels, not `.drawer-wrapper`.
- [Page scrolls behind the drawer] → `body.is-scroll-locked` and `radLenisStop` stay.

## Migration Plan

1. Toggle `data-lenis-prevent` in `openDrawer` / `hideDrawerOverlay`.
2. After commit, pin Footer `js/global.js`.
3. Rollback: drop those attr writes.
