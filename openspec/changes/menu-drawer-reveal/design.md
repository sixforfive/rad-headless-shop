## Context

See proposal.md. Published `[menu-reveal]` values on `.menu-drawer`:

```
.menu-list           3-down
.heading-style-h1    2-stagger-up
.text-meta           1-up
.menu-bottom-links   3-up
```

`.drawer-wrapper` opacity is `0.3s ease`. `openDrawer` / `closeDrawer` in `js/global.js` toggle `.is-visible` and wait for that opacity `transitionend` before `hideDrawerOverlay`. `radLeaveTo` keeps an open drawer on screen and sinks page content over `PAGE_LEAVE_MS` (450). `body *` already transitions theme colors. `.menu-link` opacity is a separate hover dim.

## Goals / Non-Goals

**Goals:**

- One class on `.menu-drawer` drives the sequence. CSS owns the motion. JS owns order, delay, and the line split.
- Menu close and the page leave both finish the reverse at `0.45s`.
- Both drawers share the longer shell fade.

**Non-Goals:**

- A new dependency.
- Reversing the menu when the cart replaces it. The menu panel hides immediately, as it does now.
- Changing `.menu-link` hover dim.
- Splitting any node that does not say `stagger`.

## Decisions

### Class toggle, not a timeline library

`.menu-drawer.is-revealed` is the rest state. The default style is the from-state. Adding the class moves and fades. Removing it reverses from the current position, so a close during the open does not restart from the end. Alternative considered: GSAP timeline. Rejected — the page leave is already CSS, and a timeline library is a new dependency for a class toggle.

### JS writes the delays

Parse `{order}` as an integer, not a string prefix (`10-up` must not match order `1`). Group start on open is `(order - 1) * 0.06s`. Every group's duration is `0.45s - (maxOrder - 1) * 0.06s`, so the highest order ends at `0.45s`. On reverse, start is `(maxOrder - order) * 0.06s` with the same duration. Write `transition-delay` and `transition-duration` on the nodes when the class changes. Alternative considered: one CSS rule per order. Rejected — a new order in Webflow would not move.

### Direction and fade in CSS

`[menu-reveal$="-up"]` starts at `translateY(1.25rem)`. `[menu-reveal$="-down"]` starts at `translateY(-1.25rem)`. `.is-revealed` sets `transform: none`. A value containing `-stagger-` does not translate the host. JS adds `.is-fade` before the first paint when order is greater than `2`. `.is-fade` is `opacity: 0` until `.is-revealed`. Alternative considered: fading every node that does not start with `1-` or `2-`. Rejected — `10-up` starts with `1`.

The `[menu-reveal]` transition lists `transform`, `opacity`, and the theme `background-color` / `color` / `border-color`. The attribute selector beats `body *`, so omitting the theme properties would freeze those nodes on a lights toggle.

### Line split after the panel has width

On menu open, after `display: flex` and a reflow, wrap each line of a stagger node in a mask (`overflow: hidden`) and an inner. Move the inner from `translateY(100%)` to `0` for `up`, and from `translateY(-100%)` to `0` for `down`. Line start is the group's start plus `index * lineStep`. `lineStep` is `0.03s` unless that would push the last line past `0.45s`, in which case it shrinks so the last line still ends at `0.45s`. Split once per width. Rebuild when the drawer width changes. Do not split while the panel is `display: none`. Alternative considered: hand-wrapped lines in Webflow. Rejected — the copy is one CMS text node and wraps with the viewport.

### Two close paths

`closeDrawer` while the menu is active removes `.is-revealed` in the same turn as `.is-visible`. The shell fade becomes `opacity 0.45s ease` on `.drawer-wrapper`, so menu and cart, open and close, share it. `hideDrawerOverlay` still waits for the opacity `transitionend`. Cart JS does not change.

`interceptPageClicks` removes `.is-revealed` when the anchor is inside `.menu-drawer` and `activeDrawer` is `"menu"`, then calls `radLeaveTo`. `radLeaveTo` itself does not, because `js/collection.js` also calls it. The overlay keeps `.is-visible`. Mailto and `target="_blank"` never reach `radLeaveTo`, so they do not reverse.

### Reduced motion

Under `prefers-reduced-motion: reduce`, `[menu-reveal]` has `transform: none` and `transition-duration: 0s`, and the line split does not run. The existing shell rule already zeroes `.drawer-wrapper`. `closeDrawer` already hides immediately in that mode.

## Risks / Trade-offs

- [A lights toggle mid-reveal restarts color on the same transition] → Accepted. The theme properties share the reveal duration.
- [Line breaks change after the font finishes loading] → Resplit when drawer width changes. A late font swap at the same width can leave stale breaks until the next width change.
- [Order gap, such as orders 1 and 4 with no 2 or 3] → The step is still `(order - 1) * 0.06s`, so the gap is empty time. Accepted.
- [Cart replaces the menu mid-sequence] → The panel is set to `display: none` immediately. The reverse does not run.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. Rollback: revert those two files. The `menu-reveal` attributes can stay.
