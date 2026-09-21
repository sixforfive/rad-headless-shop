## 1. Period and sizes

- [x] 1.1 In `js/collection.js`, add `VIEW_H` 90, `PERIOD_W/H` 320×180, `SIZE_BASE` 160, `TILE_COUNT` 28; gutter from `SIZE_BASE`; `resizeRenderer` uses `VIEW_H`
- [x] 1.2 Set `SIZE_CLASSES` to `0.12 / 0.16 / 0.20 / 0.24` of `SIZE_BASE`, weights `2, 4, 3, 1`; `buildPeriod` multiplies frac by `SIZE_BASE` not `PERIOD_W`

## 2. Easing

- [x] 2.1 Grab ease-in 220ms (`t²`) on pointer gain only; `targetVel` `VELOCITY_LERP` 0.16 `VELOCITY_DECAY` 0.92; tick always integrates; no 1:1 `basePos`; no auto-drift
- [x] 2.2 Reduced motion: apply `targetVel` then zero; no ramp, no coast

## 3. Pin

- [ ] 3.1 After commit: Collection Footer `js/collection.js` SHA; publish
