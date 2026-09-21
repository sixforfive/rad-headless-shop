## 1. Period and sizes

- [x] 1.1 In `js/collection.js`, add `VIEW_H` 90, `PERIOD_W/H` 320×180, `SIZE_BASE` 160, `TILE_COUNT` 28; gutter from `SIZE_BASE`; `resizeRenderer` uses `VIEW_H`
- [x] 1.2 Set `SIZE_CLASSES` to `0.08 / 0.14 / 0.22 / 0.32` of `SIZE_BASE`, weights `2, 3, 3, 2`; `buildPeriod` multiplies frac by `SIZE_BASE` not `PERIOD_W`

## 2. Easing

- [x] 2.1 Grab ease-in 220ms (`t²`), then 1:1 via `VIEW_H / hostHeight`; on release last-delta; `tick` `velocity *= 0.92`; no auto-drift
- [x] 2.2 Reduced motion: 1:1, no ramp, no coast

## 3. Pin

- [ ] 3.1 After commit: Collection Footer `js/collection.js` SHA; publish
