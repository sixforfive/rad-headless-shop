## Context

See proposal.md. Shipped in `js/collection.js` at `6f500fd`. Earlier 1:1 `basePos` writes killed coast. Unbounded size offset sheared copies together. Pairing dark maps by filename is out; DOM index stays.

## Goals / Non-Goals

**Goals:**

- Dense diverse field, lerp inertia with grab ease-in, bounded size lag, cursor NDC drift.

**Non-Goals:**

- Three parallax groups.
- Rest auto-drift of `basePos`.
- Unbounded `(1-p)*basePos` shear.
- Pairing light/dark by filename.
- Dropping to a 14-tile viewport period.
- Tiles that grow with the period.

## Decisions

### Period stays 320×180; sizes stay on `SIZE_BASE` 180

```
VIEW_H = 90
PERIOD_W = 320
PERIOD_H = 180
SIZE_BASE = 180
TILE_COUNT = 32
PLACE_TRIES = 40
```

`resizeRenderer` uses `VIEW_H`. Size `frac * SIZE_BASE`, not `frac * PERIOD_W`. Gutter stays `SIZE_BASE * (24 / 1440)`.

### Size classes

| class | frac × 180 | weight |
| ----- | ---------- | ------ |
| S     | 0.11       | 2      |
| M     | 0.16       | 4      |
| L     | 0.21       | 3      |
| XL    | 0.26       | 1      |

Depth is size, not extra groups.

### Grab ramp, lerp inertia, rest still of drag

On grab, multiply pointer gain by smootherstep `t*t*(3-2*t)` over 280ms. Mouse gain 0.025, touch 0.02. Pointer writes `targetVel` only (`+=`). Tick: `velocity = lerp(velocity, targetVel, 0.16)`, add `velocity` to `basePos`, `targetVel *= 0.94`. Clamp `targetVel` to `MAX_VELOCITY` 3.2. No rest auto-drift of `basePos`. Reduced motion: apply `targetVel` 1:1 then zero, no ramp, no coast, no lag, no cursor drift. Wheel writes `targetVel`.

### Bounded size parallax

`followPos` lerps toward `basePos` at `PARALLAX_FOLLOW` 0.03. Mesh offset is `(basePos - followPos) * (1-p)` with `p` from `PARALLAX_MIN` 0.82 (small) to 1 (large). Small tiles trail. At rest, slip is 0 so packing stays unique. Rejected: constant `(1-p)*basePos` (shears copies) and velocity-lag (reads as small tiles faster).

### Camera is `basePos` plus cursor drift

Fine pointer inside the host: `drift` lerps toward mouse NDC × `DRIFT_AMOUNT` 8 at `DRIFT_LERP` 0.12. Touch and pointer-outside lerp drift to 0. Camera `basePos + drift`. Wrap on the period. 3×3 copies stay.

### Light/dark by DOM index

`urlForIndex` uses the dark list at the same index as light. Filename pairing (`nazwa-light` / `nazwa-dark`) stays out.

## Risks / Trade-offs

- [32 tiles × 9 copies] → ~288 planes, under the old cache scale.
- [Few CMS images] → copies repeat until the catalog grows; layout stays diverse.
- [followPos] → lag is bounded; not true independent layer speeds.

## Migration Plan

1. `js/collection.js` is at `6f500fd` on `gallery-2d` and merged to `main`.
2. Collection Footer pin: `@6f500fd`. Publish.
3. Rollback: previous SHA.
