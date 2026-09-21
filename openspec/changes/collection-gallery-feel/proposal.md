## Why

The reverted dart-throw gallery is the right density, but the wrap repeats too soon and size contrast was too wide. 1:1 drag killed coast when the pointer stopped before release. Need a tight size band and the old lerp inertia, without extra black or the `520ebdd` blow-up.

## What Changes

- Period stays 320×180; viewport stays `VIEW_H` 90 so one screen is a crop. Tile sizes stay in world units (`0.12–0.24 × 160`). Tile count 28.
- Size classes sit in a narrow band. More photos later fill uniqueness; density does not drop.
- Grab ease-in on pointer gain only. `targetVel` lerp 0.16, decay 0.92. Tick always integrates. No 1:1 `basePos` write. No auto-drift.
- Keep boot, lights, shop click, cursor, torus AABB, neighbor uniqueness, logo overlay.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: Larger unique period at the same visual scale, tighter size contrast, lerp inertia with grab ramp, rest still.

## Impact

- `js/collection.js` only.
- No new dependencies. No Webflow markup.
- After commit: pin Collection Footer SHA.
