## 1. Label CSS

- [x] 1.1 In `css/global.css`, add `.custom-cursor-label`: `position: fixed`, `top: 0`, `left: 0`, high z-index, `pointer-events: none`, `white-space: nowrap`, `opacity: 0`, `transition: opacity 0.3s ease`
- [x] 1.2 Add `.custom-cursor-label.is-visible { opacity: 1 }` and set that transition duration to `0s` under `prefers-reduced-motion`

## 2. Label JS

- [x] 2.1 In `js/global.js`, init only when `(hover: hover) and (pointer: fine)`: append one `div.custom-cursor-label.text-meta` to `document.body`
- [x] 2.2 On `pointermove`, `closest("[custom-cursor]")`; empty value is a miss; set `textContent` from the attribute; toggle `.is-visible`; snap current to target when fading in from hidden
- [x] 2.3 rAF lerp current toward pointer plus a small right/down offset (`translate3d`); factor ~0.15, or `1` when `prefers-reduced-motion: reduce`; never set `cursor: none`

## 3. Docs and publish

- [x] 3.1 In `README.md`, note the cursor label on the `js/global.js` row
- [ ] 3.2 Point site-wide Head `<link>` and Footer `js/global.js` at the new commit SHA and publish
- [ ] 3.3 In Webflow, set `custom-cursor` on the existing hover targets that should show a label
