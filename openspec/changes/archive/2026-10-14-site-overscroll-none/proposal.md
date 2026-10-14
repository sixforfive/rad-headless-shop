## Why

Elastic overscroll (rubber-band) shows a white or unblended strip at the page edge. Collection had a one-page lock for that; `.layout` is now `100dvh` site-wide, so the lock and the bounce-only blend backdrop can go. The kill belongs on every page.

## What Changes

- `overscroll-behavior: none` on `html` and `body` site-wide.
- Remove the Collection-only `html`/`body:has(.section_home-page)` lock (`height: 100dvh`, `overflow: hidden`, `overscroll-behavior: none`).
- Remove `body::before` blend backdrop and its `prefers-reduced-motion` entry.
- Keep `html { background-color: var(--_theme---background--primary); }` as the theme canvas. Keep `body.is-scroll-locked` for the drawer.

## Capabilities

### New Capabilities

- `site-overscroll`: Document rubber-band is off on every page. Collection is not a special overflow case. Difference blend uses the html canvas, not a bounce-only `body::before`.

### Modified Capabilities

- None.

## Impact

- `css/global.css` only.
- Webflow: `.layout` and `.section_home-page` already `height: 100dvh` (no Designer edit in this change).
- No JS, no new dependencies, no Shopify.
- Rollback: restore the three removed rules (or revert the commit) and drop `overscroll-behavior` from `html`/`body`.
