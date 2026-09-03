## Why

Webflow split Add to cart into `#add-to-cart-landscape` (inside `.layer`) and `#add-to-cart-desktop` (inside `.layer-cta`), and moved `#quantity` into `.layer`. Repo CSS and gallery specs still name `#add-to-cart` and still target a `.layer-cta .qty-dropdown` that no longer exists.

## What Changes

- `.layer.is-blend` pointer-events list uses `#add-to-cart-landscape`.
- Drop the dead `body.is-full-screen .layer-cta .qty-dropdown` white-chrome selectors and the `mix-blend-mode: difference` rule on that dropdown.
- Gallery specs name `#add-to-cart-landscape` inside `.layer` and `#add-to-cart-desktop` in `.layer-cta`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: clickable-actions IDs match the split buttons.
- `merch-fullscreen-gallery`: same.

## Impact

- `css/global.css` only.
- No JS.
- Delete `openspec/changes/qty-dropdown-fullscreen-blend/` — its deltas describe a dropdown in `.layer-cta` that is gone.
