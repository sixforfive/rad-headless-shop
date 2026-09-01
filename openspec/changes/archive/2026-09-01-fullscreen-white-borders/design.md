## Context

See proposal.md for motivation. Open gallery already toggles `body.is-full-screen` in `js/product.js` (product and merch detail). `css/global.css` already has `body.is-full-screen { color: #fff }`. Webflow paints `border-color` on descendants with `--_theme---border--*` tokens. `border-color` is not inherited.

## Goals / Non-Goals

**Goals:**

- One CSS override on the existing class so every CSS border is `#fff` while the gallery is open.
- Closed state stays on Webflow tokens. Do not hardcode the closed color.

**Non-Goals:**

- JS changes.
- Sold-out X (gradient using the border token, not `border-color`).
- Outlines and box-shadows.
- `:has()`.

## Decisions

### `body.is-full-screen, body.is-full-screen * { border-color: #fff !important }`

Webflow sets `border-color` per element. A rule on `body` alone would miss chrome. Same `body *` pattern as the theme-swap transition already in `css/global.css`. Keep `color: #fff` on `body` only; do not widen the text override.

`!important` is required: combo classes such as `.button.is-secondary` (two classes) beat `body.is-full-screen *` (one class + one element). Without it, those borders stay on the theme token.

Alternative considered: `body.is-full-screen { border-color: #fff }` only. Rejected: not inherited, token-bound children would stay on theme. Alternative considered: raise selector specificity without `!important`. Rejected: Webflow combo count is unbounded.

## Risks / Trade-offs

- [Webflow combo classes beat `body.is-full-screen *`] → `!important` on the override. If a token still wins, it is using `!important` too; raise nothing further until that shows up.
- [jsDelivr pin] → CSS does not go live until the Head `<link>` SHA moves.

## Migration Plan

1. Edit `css/global.css` as in tasks.md.
2. Point the site-wide Head `<link>` at the new commit SHA and publish Webflow when you want it live.
3. Rollback: revert the CSS (or re-pin the previous SHA).
