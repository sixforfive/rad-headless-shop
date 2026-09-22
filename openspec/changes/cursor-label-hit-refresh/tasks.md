## 1. Hit refresh in initCursorLabel

- [x] 1.1 In `js/global.js` `initCursorLabel`, extract one apply that `elementFromPoint`s last pointer `clientX`/`clientY`, `closest("[custom-cursor]")`, empty value is a miss; skip until the first `pointermove`
- [x] 1.2 `pointermove` stores coords then apply; capture-phase `scroll` on `document` apply; existing rAF `tick` apply after lerp
