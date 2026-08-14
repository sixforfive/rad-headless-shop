## 1. Thumb and color CSS

- [x] 1.1 In `css/global.css`, stack `.thumb-dark` on `.thumb-img-holder`, crossfade opacity with `body.dark-mode`, hide `.thumb-dark.w-dyn-bind-empty`, keep `.thumb-light` when dark is empty (`:has()`)
- [x] 1.2 Add `0.3s ease` transitions on `background-color`, `color`, `border-color`, and thumb `opacity`; set duration `0s` under `prefers-reduced-motion`

## 2. Lights JS

- [x] 2.1 In `js/global.js`, add `applyLights`: toggle `.dark-mode` on `body` and `html`, write `rad-lights` (`light` | `dark`), set `.is-none` on `#lights-switch-btn` `.text-meta.is-plus` / `.is-minus`
- [x] 2.2 On load, `applyLights` from `rad-lights` (`dark` only when the value is exactly `dark`; otherwise light). On `#lights-switch-btn` click, `preventDefault` and flip

## 3. First paint

- [ ] 3.1 Paste the Head snippet from `design.md` into Webflow Site Settings → Custom Code → Head
