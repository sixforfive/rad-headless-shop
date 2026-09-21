## Context

See proposal.md. Specs in `specs/collection-infinite-gallery/spec.md`. Binding frame: `references/Sep-18-2026 6-16-27 PM.gif`.

`js/collection.js` already boots Three.js, swaps light/dark maps, raycasts shop click and cursor, and pans with inertia. Layout is still Codrops scatter: `generateChunkPlanes` drops two random sizes (9–31) in a 50-unit cell with no AABB and `mediaIndex` from `rand`. `VIEW_HEIGHT` 72 plus aspect makes the crop feel fluid. `fadePlanes` hides the wrap.

Keep the host, CMS lists, logo overlay, and `three@0.182.0`. Replace the generator, camera fit, and rest motion.

## Goals / Non-Goals

**Goals:**

- One seeded period that looks like the GIF: sparse, mixed sizes, no overlap, wrap.
- Crop on resize, not reflow.
- Auto-drift at rest; no zoom.

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
GRID_COLS = 6
GRID_ROWS = 4
FILL = 0.35
```

At 16:9 the frustum matches one period (`height = PERIOD_H`, `width = height * aspect`). Other aspects crop. Occupancy ≈ 8–9 tiles in view, matching the GIF.

Alternative considered: infinite unique chunks with torus only at wrap. Rejected — neighbor constraint dies at chunk seams; GIF is one repeating poster.

### Size classes as fractions of `PERIOD_W`, not vw

GIF weights, not the prompt’s 8/14/22/30 vw (those overflow a 6-col cell and reflow with the window):

| class | width / PERIOD_W | weight |
| ----- | ---------------- | ------ |
| S     | 0.07             | 3      |
| M     | 0.11             | 4      |
| L     | 0.16             | 2      |
| XL    | 0.20             | 1      |

Height from image aspect. Gutter = `PERIOD_W * (24 / 1440)`. Jitter inside the leftover cell slack, less than half gutter. AABB on torus (test wrapped replicas). If a pick collides, retry; if still colliding, skip the cell.

Seed: `hashString` of sorted light srcs so CMS order is stable. Shuffle occupancy, then greedy `mediaIndex` excluding 8-neighbors including wrap. If N < 3, skip the uniqueness rule (spec already gates at three).

### Camera crops; delete edge fade

`resizeRenderer` sets ortho to `PERIOD_H` × aspect. Do not change period or tile world sizes. Remove `fadePlanes` / `EDGE_FADE_*` — wrap must stay fully opaque or the torus reads as a void.

### Rest drift, wheel pan, no zoom

Keep drag → `targetVel`, lerp, decay. When not dragging and not reduced-motion, add a constant `DRIFT` (diagonal, ~0.04 world/frame) onto `targetVel`. Wheel: `deltaX`/`deltaY` into `targetVel`, `preventDefault`; no Z. Drop pinch-depth if any remains. Reduced motion: no lerp coast, no drift.

Inertia numbers stay in the current band (`VELOCITY_LERP` 0.16, `VELOCITY_DECAY` 0.9, cap lowered so rest drift stays quieter than a flick). Alternative considered: prompt `friction 0.92` and `cubic-bezier`. Rejected — the loop already is exponential decay; swapping the curve does not change the GIF read.

### Logo stays CSS

`.collection-hero-logo` is already `pointer-events: none` over the canvas. Do not parent it to the period. Do not draw SHOWCASE 03.

## Risks / Trade-offs

- [Few CMS images, N = 1 or 2] → Spec uniqueness only when N ≥ 3; still AABB and skip.
- [Landscape XL in a cell] → Cap width to cell minus gutter; class is a target, not a license to collide.
- [3×3 meshes × period tiles] → ~9×9 ≈ 80 planes; still under the old cache cap. Recycle groups as today if needed.
- [Desktop GIF vs phone crop] → Accepted. Composition stays; phone pans more.
- [Hard texture cut on lights] → Unchanged; out of scope.

## Migration Plan

1. Replace layout + camera + motion in `js/collection.js`.
2. Pin Collection Footer `js/collection.js` to the new SHA. Publish.
3. Rollback: previous SHA. Host and logo stay.
