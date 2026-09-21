## Context

See proposal.md. Base is the dart-throw gallery in `js/collection.js` (`PERIOD` 320×180, 28 tiles, `SIZE_BASE` 160, `VIEW_H` 90). 1:1 drag wrote `basePos` and zeroed coast when the last `dx` was 0. Size classes `0.08–0.32` read too extreme.

## Goals / Non-Goals

**Goals:**

- Same dense diverse field, tighter size contrast, lerp inertia with grab ease-in.

**Non-Goals:**

- Three parallax groups.
- Rest auto-drift.
- Dropping to a 14-tile viewport period.
- Tiles that grow with the period.

## Decisions

### Period stays 320×180; sizes stay on `SIZE_BASE` 160

```
VIEW_H = 90
PERIOD_W = 320
PERIOD_H = 180
SIZE_BASE = 160
TILE_COUNT = 28
```

`resizeRenderer` uses `VIEW_H`. Size `frac * SIZE_BASE`, not `frac * PERIOD_W`. Gutter stays `SIZE_BASE * (24 / 1440)`.

### Size classes

| class | frac × 160 | weight |
| ----- | ---------- | ------ |
| S     | 0.12       | 2      |
| M     | 0.16       | 4      |
| L     | 0.20       | 3      |
| XL    | 0.24       | 1      |

XL 38.4 world units. Depth is size, not extra groups.

### Grab ramp, lerp inertia, rest still

On grab, multiply pointer gain by `t²` over 220ms. Mouse gain 0.055, touch 0.045. Pointer writes `targetVel` only. Tick: `velocity = lerp(velocity, targetVel, 0.16)`, add `velocity` to `basePos`, `targetVel *= 0.92`. Clamp `targetVel` to `MAX_VELOCITY` 3.2. No auto-drift. Reduced motion: apply `targetVel` 1:1 then zero, no ramp, no coast. Wheel writes `targetVel`.

Camera still follows `basePos`; wrap on the period. 3×3 copies stay.

## Risks / Trade-offs

- [28 tiles × 9 copies] → ~252 planes, under the old cache scale.
- [Few CMS images] → copies repeat until the catalog grows; layout stays diverse.

## Migration Plan

1. Land `js/collection.js`.
2. Pin Collection Footer SHA. Publish.
3. Rollback: previous SHA.
