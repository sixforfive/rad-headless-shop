## Why

When there is no notification to show, drawer lists already drop their mobile `padding-top` so content does not sit in leftover banner space. `.product-gallery-col` still keeps Webflow’s `5rem` top padding at 767px and down, so the in-page gallery has the same gap.

## What Changes

- When the page has no `.notification-item` and the viewport is 767px or narrower, `.product-gallery-col` uses `padding-top: 3rem` (`var(--_layout---spacing--space-300)`).
- When the viewport is wider than 767px, or when a `.notification-item` is present, `.product-gallery-col` keeps Webflow `padding-top`.
- Both the gallery column and the drawer lists gate on `body:not(:has(.notification-item))`. Webflow omits `.notification-bar-box` entirely when the collection is empty, so `.is-none` on that box never matches on a published page. No new JS.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `notification-marquee`: With no notification item at 767px and down, `.product-gallery-col` `padding-top` drops from `5rem` to `3rem`, matching the existing drawer padding dependence. The empty condition for that dependence is the absence of `.notification-item`, not `is-none` on `.notification-bar-box`.

## Impact

- `css/global.css` only: the `max-width: 767px` empty-bar block gains the gallery selector, and its existing drawer selectors move to the `.notification-item` condition.
- Applies wherever `.product-gallery-col` exists (`/product/{slug}` and `/merch/{slug}`).
- No JS, markup, or Webflow structure changes.
- No new dependencies.
