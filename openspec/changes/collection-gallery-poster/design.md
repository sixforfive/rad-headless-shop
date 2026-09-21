## Context

See proposal.md. Specs in `specs/collection-infinite-gallery/spec.md`. Binding frame: `references/Sep-18-2026 6-16-27 PM.gif`.

`js/collection.js` already boots Three.js, swaps light/dark maps, raycasts shop click and cursor, and pans with inertia. Layout is still Codrops scatter: `generateChunkPlanes` drops two random sizes (9–31) in a 50-unit cell with no AABB and `mediaIndex` from `rand`. `VIEW_HEIGHT` 72 plus aspect makes the crop feel fluid. `fadePlanes` hides the wrap.

Keep the host, CMS lists, logo overlay, and `three@0.182.0`. Replace the generator, camera fit, and rest motion.

## Goals / Non-Goals

**Goals:**

- One seeded period that looks like the GIF: dense irregular mosaic, mixed sizes, no overlap, wrap.
- Crop on resize, not reflow.
- Still at rest; no zoom. No auto-drift.

**Non-Goals:**

- DOM tiles, mix-blend on the logo, parallax, vw size classes.
- New dependencies or a second bundle.
- Webflow markup, `js/global.js`, logo asset.
- Per-image product URLs.

## Decisions

### Keep Three.js; replace `generateChunkPlanes`

The look is 2D. Meshes, texture cache, lights observer, and raycast stay. Scatter is the bug. Alternative considered: DOM + `translate3d` as in the explore prompt. Rejected — rewrite of hit-testing and lights for no visual gain. Alternative considered: retune `CHUNK_SIZE` / `ITEMS_PER_CHUNK`. Rejected — random points in a cell cannot guarantee gutter or neighbor uniqueness.

### One period, 3×3 copies, camera modulo

Build the period once. Instance it on a 3×3 of offsets `(ox * PERIOD_W, oy * PERIOD_H)`, `ox,oy ∈ {-1,0,1}`. Each frame wrap `basePos` with `modulo` so the camera never leaves the center copy. Same infinity as chunk streaming, but the field is one designed tile.

```
PERIOD_W = 160
PERIOD_H = 90
TILE_COUNT = 14
```

At 16:9 the frustum matches one period (`height = PERIOD_H`, `width = height * aspect`). Other aspects crop. Fourteen dart-thrown tiles fill the view.

Alternative considered: infinite unique chunks with torus only at wrap. Rejected — neighbor constraint dies at chunk seams; GIF is one repeating poster.

### Size classes as fractions of `PERIOD_W`, not vw

Dart-throw into the period. No cell lattice. Classes larger than the first pass so tiles eat the field:

| class | width / PERIOD_W | weight |
| ----- | ---------------- | ------ |
| S     | 0.10             | 2      |
| M     | 0.16             | 3      |
| L     | 0.24             | 3      |
| XL    | 0.36             | 2      |

Height from image aspect, contain-fit in the reserved `w×h` (square cap `PERIOD_H - GUTTER`). Gutter = `PERIOD_W * (24 / 1440)`. AABB on torus. Retry `PLACE_TRIES` then skip. `TILE_COUNT` 14.

Seed: `hashString` of sorted light srcs. Greedy `mediaIndex` excluding nearby tiles (half-size + gutter, wrap). If N < 3, skip the uniqueness rule.

### Camera crops; delete edge fade

`resizeRenderer` sets ortho to `PERIOD_H` × aspect. Do not change period or tile world sizes. Remove `fadePlanes` / `EDGE_FADE_*` — wrap must stay fully opaque or the torus reads as a void.

### Wheel pan, inertia, no rest drift

Keep drag → `targetVel`, lerp, decay. Do not add rest drift. Wheel: `deltaX`/`deltaY` into `targetVel`, `preventDefault`; no Z. Reduced motion: no lerp coast.

Inertia numbers stay in the current band (`VELOCITY_LERP` 0.16, `VELOCITY_DECAY` 0.9).

### Logo stays CSS

`.collection-hero-logo` is already `pointer-events: none` over the canvas. Do not parent it to the period. Do not draw SHOWCASE 03.

## Risks / Trade-offs

- [Few CMS images, N = 1 or 2] → Spec uniqueness only when N ≥ 3; still AABB and skip.
- [Landscape XL] → Cap width to `PERIOD_W - GUTTER` and height to `PERIOD_H - GUTTER`; AABB still wins.
- [3×3 meshes × period tiles] → 9×14 ≈ 126 planes.
- [Desktop GIF vs phone crop] → Accepted. Composition stays; phone pans more.
- [Hard texture cut on lights] → Unchanged; out of scope.

## Migration Plan

1. Replace layout + camera + motion in `js/collection.js`.
2. Pin Collection Footer `js/collection.js` to the new SHA. Publish.
3. Rollback: previous SHA. Host and logo stay.
