## 1. Shell and from-state

- [x] 1.1 In `css/global.css`, change `.drawer-wrapper` opacity transition from `0.3s ease` to `0.45s ease`
- [x] 1.2 Set `[menu-reveal$="-up"]` to `translateY(1.25rem)` and `[menu-reveal$="-down"]` to `translateY(-1.25rem)`, excluding values that contain `-stagger-`
- [x] 1.3 `.menu-drawer.is-revealed [menu-reveal]` sets `transform: none`. `[menu-reveal].is-fade` sets `opacity: 0` until `.menu-drawer.is-revealed`
- [x] 1.4 Transition `transform`, `opacity`, `background-color`, `color`, and `border-color` on `[menu-reveal]` with `ease-out`

## 2. Sequence

- [x] 2.1 In `js/global.js`, parse `[menu-reveal]` as an integer order plus optional `stagger` plus `up` or `down`. Add `.is-fade` when the order is greater than 2
- [x] 2.2 On open, group delay is `(order - 1) * 0.06s` and duration is `0.45s - (maxOrder - 1) * 0.06s`. On reverse, delay is `(maxOrder - order) * 0.06s` with the same duration. Write both on the nodes
- [x] 2.3 `openDrawer("menu")` applies the from-state, then `display: flex`, then a reflow, then `.is-revealed`
- [x] 2.4 `closeDrawer` removes `.is-revealed` in the same turn as `.is-visible` when the menu is the active drawer

## 3. Line split

- [x] 3.1 After the menu panel has width, wrap each line of a `stagger` node in an `overflow: hidden` mask and an inner. Do not translate the host
- [x] 3.2 Move each inner from `100%` to `0` for `up`, and from `-100%` to `0` for `down`. Line delay is the group delay plus `index * 0.03s`, shrunk so the last line still ends at `0.45s`. Reverse leaves the last line first
- [x] 3.3 Split once per drawer width. Rebuild when that width changes. Do not split while the panel is `display: none`

## 4. Menu link

- [x] 4.1 In `interceptPageClicks`, when the anchor is inside `.menu-drawer` and `activeDrawer` is `"menu"`, remove `.is-revealed` and then call `radLeaveTo`. Do not remove `.is-visible`
- [x] 4.2 `radLeaveTo` itself does not reverse the menu

## 5. Reduced motion

- [x] 5.1 Under `prefers-reduced-motion: reduce`, set `[menu-reveal]` to `transform: none` and `transition-duration: 0s`, and skip the line split
