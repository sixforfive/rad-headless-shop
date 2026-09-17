## Why

Collection `/` already publishes light and dark hero photos inside `.collection-hero-photo`, but `#lights-switch-btn` only swaps shop thumbs. Dark mode still shows the light hero.

## What Changes

- Collection `.hero-photo-dark` fades over a still `.hero-photo-light` with `body.dark-mode`. Light stays opaque so the holder never shows through.
- Webflow `.hero-photo-dark.is-none` no longer permanently hides the dark photo; opacity follows the mode.
- Empty dark CMS bind (`.w-dyn-bind-empty`) keeps the light photo.
- Fade is `0.3s ease`, off under `prefers-reduced-motion`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `lights-switch`: Collection hero photos follow the mode; dark fades over a still light photo.

## Impact

- `css/global.css` (already loaded site-wide).
- Collection `/` published markup stays as it is.
- No JS. No Webflow markup change. No new dependencies.
