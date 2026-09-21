## Context

See proposal.md. Base is the reverted dart-throw gallery in `js/collection.js` (`PERIOD` 160×90, 14 tiles, sizes `0.10–0.36` of period, lerp/decay pan, no drift). `520ebdd` failed because size was a fraction of a doubled period and rest auto-drift ran.

## Goals / Non-Goals

**Goals:**

- Same visual tile scale, more size contrast, slower wrap, grab-to-coast easing.

**Non-Goals:**

- Three parallax groups.
- Rest auto-drift.
- Tiles that grow with the period.

## Decisions

### Period grows; sizes stay on `SIZE_BASE` 160

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
| S     | 0.08       | 2      |
| M     | 0.14       | 3      |
| L     | 0.22       | 3      |
| XL    | 0.32       | 2      |

XL 51 world units vs previous 58. More S. Depth is size, not extra groups.

### Grab ease, 1:1, friction 0.92, rest still

On grab, scale pointer delta by `t²` over 220ms. Then `VIEW_H / hostHeight` 1:1 onto `basePos`. On release, last frame delta is `velocity`; tick `velocity *= 0.92` until `|v| < REST_EPS`, then stop. No drift. Reduced motion: 1:1, no ramp, no coast. Wheel writes `basePos` and `velocity`.

Camera still follows `basePos`; wrap on the period. 3×3 copies stay.

## Risks / Trade-offs

- [28 tiles × 9 copies] → ~252 planes, under the old cache scale.
- [Empty larger period] → 28 tiles keeps density near the 14-in-160 field.

## Migration Plan

1. Land `js/collection.js`.
2. Pin Collection Footer SHA. Publish.
3. Rollback: previous SHA.
