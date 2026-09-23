## 1. Shell and from-state

- [x] 1.1 In `css/global.css`, change `.drawer-wrapper` opacity transition from `0.3s ease` to `0.45s ease`
- [x] 1.2 Order `3` `down` starts at `translateY(-100%)` and `up` at `translateY(100%)`. Line inners start at `translateY(100%)`. Hosts of orders `1` and `2` do not translate
- [x] 1.3 `.menu-drawer.is-revealed [menu-reveal]` sets `transform: none`. `[menu-reveal].is-fade` sets `opacity: 0` until `.menu-drawer.is-revealed`
- [x] 1.4 Move and fade `[menu-reveal]` and `.menu-reveal-line-inner` over `1.47s` with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`. Keep theme `background-color`, `color`, and `border-color` at `0.45s ease-out`

## 2. Sequence

- [x] 2.1 In `js/global.js`, parse `[menu-reveal]` as an integer order plus optional `stagger` plus `up` or `down`. Add `.is-fade` when the order is greater than 2
- [x] 2.2 Order `1` lines stagger `0.07s`. Order `2` starts when order `1`'s last line ends, then staggers `0.07s`. Both order `3` nodes start together when order `2`'s last line ends. Reverse leaves order `3` first, then order `2` lines last-to-first, then order `1` lines last-to-first
- [x] 2.3 `openDrawer("menu")` applies the from-state, then `display: flex`, then a reflow, then `.is-revealed`
- [x] 2.4 `closeDrawer` removes `.is-revealed` in the same turn as `.is-visible` when the menu is the active drawer

## 3. Line split

- [x] 3.1 Split orders `1` and `2` after the panel has width. Measure rows against `clientWidth` with `white-space: nowrap`, and set that on each inner so the row does not wrap again. Do not translate the host
- [x] 3.2 Each inner moves from `translateY(100%)` to `0` over `1.47s`, staggered `0.07s` inside its stage
- [x] 3.3 Split once per width. Rebuild when that width changes. Do not split while the panel is `display: none`

## 4. Menu link

- [x] 4.1 In `interceptPageClicks`, when the anchor is inside `.menu-drawer` and `activeDrawer` is `"menu"`, remove `.is-revealed` and then call `radLeaveTo`. Do not remove `.is-visible`
- [x] 4.2 `radLeaveTo` itself does not reverse the menu

## 5. Reduced motion

- [x] 5.1 Under `prefers-reduced-motion: reduce`, set `[menu-reveal]` to `transform: none` and `transition-duration: 0s`, and skip the line split
