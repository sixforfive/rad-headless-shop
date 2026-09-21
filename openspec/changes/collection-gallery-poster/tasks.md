## 1. Period generator

- [x] 1.1 In `js/collection.js`, replace `CHUNK_SIZE`, `ITEMS_PER_CHUNK`, `VIEW_HEIGHT`, and `EDGE_FADE_*` with `PERIOD_W` 160, `PERIOD_H` 90, `GRID_COLS` 6, `GRID_ROWS` 4, `FILL` 0.35, size-class table, gutter `PERIOD_W * (24 / 1440)`, and `DRIFT`
- [x] 1.2 Replace `generateChunkPlanes` / `generateChunkPlanesCached` with `buildPeriod(lightSrcs)` — seeded occupancy, class pick, cell jitter, torus AABB, skip cell on collision
- [x] 1.3 In `buildPeriod`, greedy `mediaIndex` excluding 8-neighbors (wrap) when `lightSrcs.length >= 3`
- [x] 1.4 Update the FUNCTIONS EXPLAINER box for `buildPeriod` and drop chunk helpers

## 2. Torus instances and camera

- [x] 2.1 Replace `syncChunks` with one period meshed on a 3×3 of `(ox * PERIOD_W, oy * PERIOD_H)` offsets
- [x] 2.2 In `tick`, wrap `basePos` with modulo `PERIOD_W` / `PERIOD_H` so the camera stays on the center copy
- [x] 2.3 In `resizeRenderer`, set ortho height to `VIEW_H` and width to `height * aspect`; do not rebuild the period
- [x] 2.4 Delete `fadePlanes` and edge-fade constants; period meshes stay opacity 1

## 3. Motion

- [x] 3.1 In `tick`, do not add rest drift; drag and wheel still pan; inertia coasts then stops
- [x] 3.2 In `onWheel`, pan X/Y from `deltaX`/`deltaY` (`preventDefault`); do not change camera Z
- [x] 3.3 Skip inertia lerp when `prefers-reduced-motion: reduce`

## 4. Pin

- [ ] 4.1 After commit: Collection Footer `js/collection.js` SHA; publish

## 5. Density and rest

- [x] 5.1 Remove `DRIFT` from `tick` and constants
- [x] 5.2 Replace cell lattice in `buildPeriod` with dart-throw (`TILE_COUNT` 14, `PLACE_TRIES` 40, AABB)
- [x] 5.3 Size classes `0.10 / 0.16 / 0.24 / 0.36`, weights `2, 3, 3, 2`; no one-cell cap
- [x] 5.4 `pickMediaIndex` bans nearby tiles by distance, not 8-grid neighbors

## 6. Depth, period, easing

- [x] 6.1 `VIEW_H` 90, `PERIOD_W/H` 320×180; frustum from `VIEW_H`
- [x] 6.2 `LAYERS` far/mid/fore with parallax 0.70/0.85/1.0, counts 18/14/12, groups at z -2/-1/0
- [x] 6.3 `tick` / `syncLayerOffsets`: group offset `-wrap(basePos * parallax, PERIOD)`
- [x] 6.4 Grab ease-in 220ms, 1:1 drag, friction 0.92 coast, rest drift fade-in; reduced motion skips ramp/coast/drift
