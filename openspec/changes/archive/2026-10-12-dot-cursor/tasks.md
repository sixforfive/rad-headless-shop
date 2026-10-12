## 1. Dot

- [x] 1.1 In `css/global.css`, add `.custom-cursor-dot`: `position: fixed`, `top: 0`, `left: 0`, `z-index` above `.custom-cursor-label`, 12×12px, `border-radius: 50%`, `background: #fff`, `mix-blend-mode: difference`, `pointer-events: none`, hidden until shown
- [x] 1.2 `html.is-dot-cursor` and `html.is-dot-cursor *` set `cursor: none !important`

## 2. Hit test

- [x] 2.1 In `js/global.js` `initCursorLabel`, create one `.custom-cursor-dot` on `document.body` only when `(hover: hover) and (pointer: fine)` matches. A coarse pointer creates no dot
- [x] 2.2 On the existing label apply path, after the first `pointermove`, drop `is-dot-cursor`, read `getComputedStyle` on the `elementFromPoint` hit, then restore the class in the same turn. Show the dot only when that cursor is `pointer`
- [x] 2.3 Place the dot with `translate3d(clientX - 6px, clientY - 6px, 0)`. No lerp and no fade. Scroll and a still pointer use the same apply path as the label
