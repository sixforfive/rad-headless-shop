## Context

See proposal.md. Specs in `specs/collection-infinite-gallery/spec.md`. Binding frame: `references/Sep-18-2026 6-16-27 PM.gif`.

`js/collection.js` already boots Three.js, swaps light/dark maps, raycasts shop click and cursor, and pans with inertia. Layout is still Codrops scatter: `generateChunkPlanes` drops two random sizes (9–31) in a 50-unit cell with no AABB and `mediaIndex` from `rand`. `VIEW_HEIGHT` 72 plus aspect makes the crop feel fluid. `fadePlanes` hides the wrap.

Keep the host, CMS lists, logo overlay, and `three@0.182.0`. Replace the generator, camera fit, and rest motion.

## Goals / Non-Goals

**Goals:**

- One seeded period larger than the viewport, three parallax depths, mixed sizes, wrap.
- Crop on resize, not reflow.
- Grab ease-in, 1:1 drag, friction coast, rest auto-drift. No zoom.

**Non-Goals:**

- DOM tiles, mix-blend on the logo, vw size classes.
- New dependencies or a second bundle.
- Webflow markup, `js/global.js`, logo asset.
- Per-image product URLs.

## Decisions

### Keep Three.js; replace `generateChunkPlanes`

The look is 2D. Meshes, texture cache, lights observer, and raycast stay. Scatter is the bug. Alternative considered: DOM + `translate3d` as in the explore prompt. Rejected — rewrite of hit-testing and lights for no visual gain. Alternative considered: retune `CHUNK_SIZE` / `ITEMS_PER_CHUNK`. Rejected — random points in a cell cannot guarantee gutter or neighbor uniqueness.

### One period, 3×3 copies, camera at origin

Build each layer once. Instance on a 3×3 of offsets `(ox * PERIOD_W, oy * PERIOD_H)`. Camera stays at origin. Each layer group offset is `-wrap(basePos * parallax, PERIOD)`.

```
VIEW_H = 90
PERIOD_W = 320
PERIOD_H = 180
```

Frustum height is `VIEW_H`, so one screen shows a crop of the period.

### Three layers

| id   | parallax | z  | count | size frac        |
| ---- | -------- | -- | ----- | ---------------- |
| far  | 0.70     | -2 | 18    | 0.08–0.42        |
| mid  | 0.85     | -1 | 14    | 0.10–0.36        |
| fore | 1.00     | 0  | 12    | 0.14–0.32        |

Seed: `hashString(srcs + "|" + layer.id)`. AABB only inside a layer. Cross-layer overlap is the depth.

### Camera crops; delete edge fade

`resizeRenderer` sets ortho to `VIEW_H` × aspect. Do not change period or tile world sizes.

### Grab ease, 1:1 drag, friction 0.92, rest drift

On grab, scale pointer delta by `t²` over `GRAB_EASE_MS` 220. After the ramp, map CSS pixels to world with `VIEW_H / hostHeight` (1:1). On release, last frame delta is `velocity`; each tick `velocity *= 0.92`. When speed < `REST_EPS`, fade in `DRIFT` 0.04 over 900ms (`t²`). Reduced motion: 1:1, no ramp, no coast, no drift. Wheel writes `basePos` and `velocity`.

### Logo stays CSS

`.collection-hero-logo` is already `pointer-events: none` over the canvas. Do not parent it to the period. Do not draw SHOWCASE 03.

## Risks / Trade-offs

- [Few CMS images, N = 1 or 2] → Spec uniqueness only when N ≥ 3; still AABB and skip.
- [Landscape XL] → Cap width to `PERIOD_W - GUTTER` and height to `PERIOD_H - GUTTER`; AABB still wins.
- [3×3 meshes × three layers] → 9 × (18+14+12) ≈ 396 planes.
- [Desktop GIF vs phone crop] → Accepted. Composition stays; phone pans more.
- [Hard texture cut on lights] → Unchanged; out of scope.

## Migration Plan

1. Replace layout + camera + motion in `js/collection.js`.
2. Pin Collection Footer `js/collection.js` to the new SHA. Publish.
3. Rollback: previous SHA. Host and logo stay.
