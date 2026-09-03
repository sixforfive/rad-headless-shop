## Why

When the notification bar is hidden, drawer lists already drop their mobile `padding-top` so content does not sit in leftover banner space. `.product-gallery-col` still keeps Webflow’s `5rem` top padding at 767px and down, so the in-page gallery has the same gap.

## What Changes

- When `.notification-bar-box` has `is-none` and the viewport is 767px or narrower, `.product-gallery-col` uses `padding-top: 3rem` (`var(--_layout---spacing--space-300)`).
- When the viewport is wider than 767px, or when the bar is not `is-none`, `.product-gallery-col` keeps Webflow `padding-top`.
- Same `:has(.notification-bar-box.is-none)` gate as the drawer lists. No new JS.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `notification-marquee`: When the empty bar is hidden at 767px and down, `.product-gallery-col` `padding-top` drops from `5rem` to `3rem`, matching the existing drawer padding dependence.

## Impact

- `css/global.css` only: one extra selector in the existing `max-width: 767px` empty-bar block.
- Applies wherever `.product-gallery-col` exists (`/product/{slug}` and `/merch/{slug}`).
- No JS, markup, or Webflow structure changes.
- No new dependencies.
