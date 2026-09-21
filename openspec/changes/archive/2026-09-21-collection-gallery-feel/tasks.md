## 1. Period and sizes

- [x] 1.1 In `js/collection.js`, add `VIEW_H` 90, `PERIOD_W/H` 320×180, `SIZE_BASE` 180, `TILE_COUNT` 32; gutter from `SIZE_BASE`; `resizeRenderer` uses `VIEW_H`
- [x] 1.2 Set `SIZE_CLASSES` to `0.11 / 0.16 / 0.21 / 0.26` of `SIZE_BASE`, weights `2, 4, 3, 1`; `buildPeriod` multiplies frac by `SIZE_BASE` not `PERIOD_W`

## 2. Easing and camera

- [x] 2.1 Grab ease-in 280ms (smootherstep) on pointer gain only; mouse/touch 0.025 / 0.02; `targetVel` `VELOCITY_LERP` 0.16 `VELOCITY_DECAY` 0.94; tick always integrates; no 1:1 `basePos`; no rest auto-drift
- [x] 2.2 Reduced motion: apply `targetVel` then zero; no ramp, no coast, no follow lag, no cursor drift
- [x] 2.3 `followPos` lerp `PARALLAX_FOLLOW` 0.03; `PARALLAX_MIN` 0.82; offset `(basePos - followPos) * (1-p)`
- [x] 2.4 Camera `basePos + drift`; fine-pointer NDC × `DRIFT_AMOUNT` 8, `DRIFT_LERP` 0.12; light/dark by DOM index

## 3. Pin

- [x] 3.1 Collection Footer `js/collection.js` at `@6f500fd`; publish
