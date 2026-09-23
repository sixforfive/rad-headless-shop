## Context

See proposal.md. Published `[menu-reveal]` values on `.menu-drawer`:

```
.menu-list           3-down
.heading-style-h1    2-stagger-up
.text-meta           1-up
.menu-bottom-links   3-up
```

The first pass moves every node `1.25rem` inside `0.45s` and splits only a `stagger` value by `offsetTop`. A word that wraps inside its span becomes a tall mask and breaks again. `.drawer-wrapper` opacity is already `0.45s ease`.

## Goals / Non-Goals

**Goals:**

- Three stages: order `1` lines, then order `2` lines, then both order `3` nodes.
- Each line is one measured row and stays one row.
- The shell fade stays `0.45s`.

**Non-Goals:**

- A new dependency.
- Reversing the menu when the cart replaces it.
- Changing `.menu-link` hover dim.
- Splitting order `3`.

## Decisions

### Stages

`1.47s` per move, `0.07s` between lines, ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`.

Order `1` line `i` starts at `i * 0.07s`. Order `2` starts when order `1`'s last line ends, then uses the same stagger. Both order `3` nodes start when order `2`'s last line ends, with no stagger between them. An order with no lines has length `0`. On reverse, order `3` leaves first, then order `2`'s lines last-to-first, then order `1`'s lines last-to-first. Alternative considered: keep the `0.45s` budget and shrink the stagger. Rejected — the line reveal is the `1.47s` move.

### Lines by width

Orders `1` and `2` both split, including `1-up`. Probe words against the node's `clientWidth` with `white-space: nowrap`, then set that on each inner so the row cannot wrap again. The host does not translate. Inners travel `translateY(100%)` to `0`. Split once per width. Rebuild when that width changes. Do not split while the panel is `display: none`. Alternative considered: `offsetTop` of inline word spans. Rejected — that is the broken break.

### Order 3 travels its own height

`down` starts at `translateY(-100%)`. `up` starts at `translateY(100%)`. `.is-fade` stays on order greater than `2`. Theme `background-color`, `color`, and `border-color` stay `0.45s ease-out` and do not take the `1.47s` ease.

### Close still hides at 0.45s

`hideDrawerOverlay` still waits for the overlay opacity `transitionend`. The content reverse is longer, so a button or backdrop close hides the shell while lines are still moving. A menu link does not remove `.is-visible`, so that reverse stays visible until the page assigns, which is still shorter than the full reverse. Alternative considered: hold the shell until the reverse ends. Rejected — the shell duration stays `0.45s`.

### Class toggle

`.menu-drawer.is-revealed` is still the rest state. No timeline library.

### Reduced motion

`[menu-reveal]` and line inners keep `transform: none` and `transition-duration: 0s`. The line split does not run.

## Risks / Trade-offs

- [Button close clips the reverse] → Accepted. The shell fade is `0.45s`.
- [A menu-link reverse is still running when the page assigns] → Accepted. The leave stays `0.45s` plus the `350ms` hold.
- [A late font swap at the same width leaves stale breaks] → Resplit when the width changes.
- [Cart replaces the menu mid-sequence] → The panel is set to `display: none` immediately. The reverse does not run.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. Rollback: revert those two files. The `menu-reveal` attributes can stay.
