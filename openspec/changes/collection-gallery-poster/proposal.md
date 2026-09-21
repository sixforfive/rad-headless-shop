## Why

The Collection infinite gallery still uses Codrops scatter: random points in chunks, continuous sizes, no collision, no neighbor uniqueness. Images overlap, the same frame sits twice in view, and the composition reflows with the viewport. Binding look is `references/Sep-18-2026 6-16-27 PM.gif` — a sparse poster mosaic that wraps, not that scatter.

## What Changes

- Replace chunk scatter in `js/collection.js` with one seeded finite period: sparse grid, discrete size classes, gutter, AABB, no identical neighbors, torus wrap.
- Lock period geometry. Resize crops the camera; tiles do not reflow or scale independently.
- Pan stays drag + inertia. Add rest auto-drift. Wheel pans X/Y. Drop zoom, pinch-depth, and edge fade.
- Keep boot, CMS light/dark swap, shop click, cursor label, `.collection-hero-logo` fixed on the viewport.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: Poster mosaic instead of Codrops scatter — torus period, sparse occupancy, no overlap, no adjacent duplicates, locked scale, auto-drift, no zoom.

## Impact

- `js/collection.js` only (layout generator, camera fit, motion). Three.js stays.
- `css/global.css` unchanged unless a fade/canvas rule fights the GIF.
- `.collection-hero-logo` stays the published overlay. No Webflow markup change.
- After commit: pin Collection Footer `js/collection.js` SHA and publish.
