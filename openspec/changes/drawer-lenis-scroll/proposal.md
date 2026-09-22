## Why

Menu and cart lists scroll in Webflow Designer but not on the published site. `radLenisStop()` adds `lenis-stopped` on `html`, and `html.lenis.lenis-stopped { overflow: clip }` clips the document so the drawer lists have no overflow.

## What Changes

- Remove `html.lenis.lenis-stopped { overflow: clip }` from `css/global.css`.
- Keep `body.is-scroll-locked` so the page stays locked behind an open drawer.
- Keep `radLenisStop` / `radLenisStart` so window Lenis still freezes while a drawer is open.

## Capabilities

### New Capabilities

- `drawer-scroll`: Menu and cart lists keep their own scroll while the page is locked. `html` SHALL NOT use `overflow: clip` from `lenis-stopped`.

### Modified Capabilities

- None.

## Impact

- `css/global.css` only.
- No JS, no Webflow markup, no new dependencies.
- Rollback: restore the `html.lenis.lenis-stopped` rule.
