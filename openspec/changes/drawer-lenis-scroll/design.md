## Context

See proposal.md for motivation. All of this lives in `css/global.css`.

Today, `openDrawer` calls `radLenisStop()` and adds `body.is-scroll-locked`. Stopped Lenis adds `lenis-stopped` on `html`. The `overflow: clip` companion is gone; lists still do not scroll live. `html.lenis, html.lenis body { height: auto }` is still on. Designer inner-scroll means Webflow already owns overflow on `.menu-list` / `.cart-list`. `body.is-scroll-locked { overflow: hidden }` still locks the page.

## Goals / Non-Goals

**Goals:**

- Let Webflow drawer overflow work while the page stays locked.

**Non-Goals:**

- Turning `syncTouch` on.
- Changing `radLenisStop` / `radLenisStart`.
- Adding `data-lenis-prevent` on drawers.
- Changing Webflow overflow or height on the lists.

## Decisions

### Drop the `lenis-stopped` clip only

Done. Live still failed. Designer inner-scroll confirmed the lists already have a scrollport.

### `height: auto` only when not stopped

`height: auto` on `html`/`body` collapses the Webflow `height: 100%` chain, so the list has no box. Scope it to `html.lenis:not(.lenis-stopped)`. Drawer open already adds `lenis-stopped` via `radLenisStop()`. Page lock stays on `body.is-scroll-locked`.

Alternative considered: drop `height: auto` entirely. Rejected — window Lenis still needs the document to grow when it is running.

Alternative considered: `overflow` / `max-height` on the lists. Rejected — Webflow already owns that; restore the height chain.

## Risks / Trade-offs

- [Lists still do not scroll] → Then set overflow / max-height on the lists in this file; do not touch JS.
- [Page scrolls behind the drawer] → `body.is-scroll-locked` stays; do not put `height: auto` back on while stopped.

## Migration Plan

1. Scope the companion `height: auto` rule to `:not(.lenis-stopped)` in `css/global.css`.
2. After commit, point the site-wide Head `<link>` at the new SHA.
3. Rollback: restore `html.lenis, html.lenis body { height: auto }`.
