## Why

On `/shop` and on product pages, the enter rise never plays in Safari or Arc. The page shows up already settled. Chrome plays the fade and the move up.

## What Changes

The hidden, lowered state paints before `html.is-ready` is added. The rise for pages other than `/` no longer depends on a `:has()` selector or on `transform: none`. It ends at `translateY(0)`. The shop Gallery/List switch uses that same end value. `/` still fades `.collection-hero-logo` and does not move.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `page-load-transition`: the enter rise and the shop view-switch rise run in Chrome, Safari, and Arc. The collection page still fades the logo and does not rise.

## Impact

- `js/global.js` — `revealPage` waits until the hidden state has painted, then adds `html.is-ready`.
- `css/global.css` — the non-home rise and the shop view switch end at `translateY(0)`. `:has()` stays only on the `/` override.
- No new dependencies. Webflow markup unchanged.
