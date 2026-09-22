## Context

See proposal.md for motivation. All of this lives in `css/global.css`.

Today, `openDrawer` calls `radLenisStop()` and adds `body.is-scroll-locked`. Stopped Lenis adds `lenis-stopped` on `html`. This file then sets `html.lenis.lenis-stopped { overflow: clip }`. `body.is-scroll-locked { overflow: hidden }` already locks the page. Webflow owns overflow on `.menu-list` / `.cart-list`.

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

`overflow: clip` on `html` is the extra lock Designer never has. Page lock stays on `body.is-scroll-locked`. Leave `html.lenis, html.lenis body { height: auto }` until a list still fails to scroll after the clip is gone.

Alternative considered: stop calling `radLenisStop`. Rejected — window Lenis should stay frozen behind the drawer.

Alternative considered: `data-lenis-prevent` on the lists. Rejected — Lenis is already stopped; the clip is the live-only difference.

## Risks / Trade-offs

- [Lists still do not scroll] → Next cut is `height: auto` on `html.lenis body`, not a JS change.
- [Page scrolls behind the drawer] → `body.is-scroll-locked` stays; do not restore the clip to fix that.

## Migration Plan

1. Delete the `html.lenis.lenis-stopped` rule in `css/global.css`.
2. After commit, point the site-wide Head `<link>` at the new SHA.
3. Rollback: restore that one rule.
