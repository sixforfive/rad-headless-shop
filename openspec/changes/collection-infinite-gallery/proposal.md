## Why

Collection `/` already publishes a gallery-format hero (`.collection-hero-gallery` plus hidden light/dark CMS image lists) but the host is empty. The hero should be an infinite pannable image space matching the Codrops Infinite Canvas feel, using those CMS images.

## What Changes

- On `/`, when `.collection-hero-gallery` is in the DOM with `.hero-gallery-img` nodes, mount a WebGL infinite canvas inside that host.
- Pan (drag), zoom (wheel/pinch), inertia, chunk layout, and fade copy the Codrops demo. Plane size is `× 1.166`. No WASD/QE.
- Image count is the DOM list length (not a fixed N). Light vs dark textures follow `body.dark-mode`; camera and layout do not reset.
- Canvas is transparent; page background stays the theme token on `html`/`body`.
- Click a plane without dragging → `/shop`. Hover a plane (fine pointer) → `custom-cursor="[SHOP COLLECTION]"` on the canvas so the existing cursor label shows.

## Capabilities

### New Capabilities

- `collection-infinite-gallery`: Collection hero infinite canvas: boot gate, Codrops motion, CMS light/dark textures, shop click, cursor label.

### Modified Capabilities

- None.

## Impact

- New `js/collection.js` (Collection page Footer only, `type="module"`).
- Third-party: `three@0.182.0` ESM imported from that file (`three.module.min.js`).
- `css/global.css` only if the canvas host needs a repo rule (transparent canvas, logo `pointer-events`).
- `js/global.js` unchanged: `applyLights` already toggles `.dark-mode`; `initCursorLabel` already reads `[custom-cursor]`.
- Webflow (already published): `.collection-hero-gallery` host; `.hero-gallery-light.is-none` / `.hero-gallery-dark.is-none` as data; `.collection-hero-logo` overlay. After commit: pin Footer tags to the new SHA and publish.
- Photo and video hero formats: no canvas (host absent).
