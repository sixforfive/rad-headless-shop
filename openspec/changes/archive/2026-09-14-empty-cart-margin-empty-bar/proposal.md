## Why

When there is no notification to show, drawer lists already drop their mobile `padding-top` so content does not sit in leftover banner space. `.empty-cart` still keeps Webflow’s `margin-top: var(--_layout---spacing--space-600)` at 767px and down, so the empty cart state has the same gap.

## What Changes

- When the page has no `.notification-item` and the viewport is 767px or narrower, `.empty-cart` uses `margin-top: var(--_layout---spacing--space-400)`.
- When the viewport is wider than 767px, or when a `.notification-item` is present, `.empty-cart` keeps Webflow `margin-top`.
- Gate on `body:not(:has(.notification-item))`, same as the existing empty-bar drawer and gallery rules. Webflow omits `.notification-bar-box` entirely when the collection is empty. No new JS.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `notification-marquee`: With no notification item at 767px and down, `.empty-cart` `margin-top` drops from `space-600` to `space-400`, matching the existing drawer padding dependence.

## Impact

- `css/global.css` only: the `max-width: 767px` empty-bar block gains the `.empty-cart` selector.
- Applies wherever `.empty-cart` exists (cart drawer on every page).
- No JS, markup, or Webflow structure changes.
- No new dependencies.
