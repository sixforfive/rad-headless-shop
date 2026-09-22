## Why

Difference-blended chrome on `.second-menu` and `.footer` still uses subpixel antialias, so those links read heavier than `.navbar`. The grayscale opt-out targets a dead `.second-men` selector and never includes `.footer`.

## What Changes

- `.second-menu` gets the same grayscale font-smoothing as `.navbar`.
- `.footer` gets that same smoothing.
- `.footer` still does not set `mix-blend-mode`; product and merch fullscreen already forbid blend on nodes inside `.layer`.

## Capabilities

### New Capabilities

- `blend-chrome`: Grayscale antialias on difference-blended chrome — `.navbar`, `.second-menu`, `.footer`, and `.layer.is-blend`.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- Navbar, shop `.second-menu`, and `.footer` type on every page.
- No JS. No new dependencies. No Webflow markup change.
