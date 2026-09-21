## Why

The dart-throw mosaic is the right density, but wrap, size contrast, and 1:1 drag killed coast. Need a crop of a large period, lerp inertia, size-follow parallax, and cursor drift — without extra black or tiles that grow with the period.

## What Changes

- Period stays 320×180; viewport stays `VIEW_H` 90. Tile sizes stay in world units on `SIZE_BASE` 180. Tile count 32. Size classes `0.11 / 0.16 / 0.21 / 0.26` (weights 2, 4, 3, 1).
- Grab ease-in on pointer gain only (280ms smootherstep). `targetVel` lerp 0.16, decay 0.94. Mouse/touch gain 0.025 / 0.02. Tick always integrates. No 1:1 `basePos` write. No rest auto-drift.
- Size parallax via `followPos` (`PARALLAX_FOLLOW` 0.03, `PARALLAX_MIN` 0.82): small tiles trail the pan; layout stays unique at rest.
- Camera is `basePos` plus cursor NDC drift (`DRIFT_AMOUNT` 8, `DRIFT_LERP` 0.12). Light/dark maps stay paired by DOM index.
- Keep boot, shop click, cursor, torus AABB, neighbor uniqueness, logo overlay.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: Larger unique period at the same visual scale, tighter size band, lerp inertia with grab ramp, bounded size parallax, cursor drift, rest still of drag/coast, light/dark by DOM index.

## Impact

- `js/collection.js` only.
- No new dependencies. No Webflow markup.
- Collection Footer pinned at `@6f500fd`.
