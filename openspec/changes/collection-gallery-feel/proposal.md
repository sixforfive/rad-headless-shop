## Why

The reverted dart-throw gallery is the right density, but the wrap repeats too soon, size contrast is mild, and pan still eases through a lerp instead of grab-to-coast. Need the GIF’s small feeling pass without the `520ebdd` blow-up (tiles scaled with period, rest drift).

## What Changes

- Period grows to 320×180; viewport stays `VIEW_H` 90 so one screen is a crop. Tile sizes stay in old world units (`0.08–0.32 × 160`), not fractions of the new period. Tile count 28.
- Size classes spread S vs L a bit more. XL is not larger than today.
- Grab ease-in, then 1:1 drag, then friction 0.92 coast. No auto-drift.
- Keep boot, lights, shop click, cursor, torus AABB, neighbor uniqueness, logo overlay.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: Larger unique period, wider size contrast at the same visual scale, grab-to-coast easing, rest still.

## Impact

- `js/collection.js` only.
- No new dependencies. No Webflow markup.
- After commit: pin Collection Footer SHA.
