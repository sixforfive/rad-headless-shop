## Why

On `/product/{slug}` the desktop CTA now lives in `.layer-cta.is-desktop`, a fixed sibling of `.layer`. Gallery-open chrome rules are scoped to `.layer`, so with the gallery open the desktop `.qty-dropdown` keeps its theme border and text over the photos instead of inverting with the rest of the chrome.

## What Changes

- While `body` has `is-full-screen`, `.layer-cta .qty-dropdown` SHALL use `mix-blend-mode: difference`.
- While `body` has `is-full-screen`, `.layer-cta .qty-dropdown` and its descendants SHALL get `color` and `border-color` `#fff`.
- `.qty-dropdown` inside `.layer` is untouched: it already inverts with the layer's blend group.
- `#add-to-cart` is untouched: Webflow gives `.button` its own background and `mix-blend-mode: normal`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: white gallery-open chrome extends to `.layer-cta .qty-dropdown`, and the no-own-blend-mode rule is scoped to elements inside `.layer`.

## Impact

- `css/global.css` only: one new rule plus two selectors on the existing `body.is-full-screen` white-chrome rule.
- No JS, no Webflow edits.
- Merch is unaffected: `/merch/{slug}` has no `.layer-cta`.
- No new dependencies.
