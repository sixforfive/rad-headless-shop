## Why

The site has a published lights control and Webflow dark-mode tokens, but nothing switches them. Visitors should start in light mode, flip with `#lights-switch-btn`, and keep that choice on the next visit.

## What Changes

- Clicking `#lights-switch-btn` toggles `.dark-mode` on `body` (and `html` so first paint matches).
- Last mode is stored in `localStorage` (`rad-lights`). Missing or invalid value → light.
- Navbar `.meta-link.is-plus` shows in light; `.meta-link.is-minus` shows in dark, via `.is-none`.
- Product `.thumb-light` / `.thumb-dark` crossfade with the mode. Empty dark field (`.w-dyn-bind-empty`) keeps the light thumb.
- Color and thumb transitions are `0.3s ease`, off under `prefers-reduced-motion`.
- A tiny Webflow Head snippet applies stored dark mode before first paint.
- Favicon is unchanged: it still follows the browser `prefers-color-scheme`.

## Capabilities

### New Capabilities

- `lights-switch`: Site-wide light/dark toggle, persistence, glyph swap, and product thumb crossfade.

### Modified Capabilities

- None.

## Impact

- `css/global.css` and `js/global.js` (already loaded site-wide).
- Webflow Head custom code (inline script you paste; not in this repo).
- Published navbar and shop Collection List markup stay as they are.
- No new dependencies. No Shopify or CMS API changes.
