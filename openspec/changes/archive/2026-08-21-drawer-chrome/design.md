## Context

See proposal.md for motivation. Drawer open/close already lives in `js/global.js`: `openDrawer` / `closeDrawer` call `setDrawerButtons(kind)` with `"menu"`, `"cart"`, or `null`. Overlay swap stays in `openDrawer` but the navbar will no longer expose it.

Published chrome (closed): `#menu-open` visible, `#menu-close.is-none`, `#cart-title.menu-link.is-none` (`div`, text "cart"), `#lights-switch-btn.link-secondary`, `#currency-btn.menu-link.is-none`, `#cart-open.link-cart`, `#cart-close.is-none`.

Webflow has no generic `.is-none`. Hiding works only via combo classes: `.menu-link.is-none` (Webflow), `.link-cart.is-none` (this repo). `#lights-switch-btn` is `.link-secondary` and has no combo yet.

## Goals / Non-Goals

**Goals:**

- One chrome function for open, close, and unused overlay swap.
- Hide lights with a CSS combo, not inline `display`.

**Non-Goals:**

- Changing overlay fade, scroll lock, or notification-bar drawer hide.
- Currency conversion behavior on `#currency-btn`.
- New Webflow markup or IDs.
- Removing the overlay-swap branch in `openDrawer`.

## Decisions

### Extend `setDrawerButtons`, do not add a sibling

`setDrawerButtons` already owns `.is-none` on the open/close pair and runs from `openDrawer` and `closeDrawer`. Add the extra IDs there:

- `#menu-open` / `#cart-open`: `is-none` when `kind !== null` (any drawer open).
- `#lights-switch-btn`: `is-none` when `kind !== null`.
- `#cart-title` / `#currency-btn`: `is-none` when `kind !== "cart"`.
- `#menu-close` / `#cart-close`: unchanged (`kind === "menu"` / `kind === "cart"`).

Alternative considered: a new `setDrawerChrome` called next to `setDrawerButtons` — two sources for the same class.

### CSS combo for lights, existing combos for the rest

Add `.link-secondary.is-none` to the existing `display: none` list in `css/global.css`. Do not introduce a generic `.is-none` rule (would fight Webflow combos we do not own).

`#cart-title` and `#currency-btn` already match `.menu-link.is-none`. `#cart-open` already matches `.link-cart.is-none`.

### Closed state comes from markup, not a load call

Published nodes already have the closed `.is-none` set. Do not call `setDrawerButtons(null)` on load. Optional chaining on missing nodes.

### Keep overlay swap code

`openDrawer` still swaps panels if called while the other drawer is open. Navbar will not trigger that path. Leave the branch; do not delete it in this change.

## Risks / Trade-offs

- [`.link-secondary.is-none` omitted] → Lights stay visible. Mitigation: the CSS task is required, not optional.
- [`applyLights` vs button `.is-none`] → `applyLights` only toggles plus/minus children. Parent `.is-none` does not collide.
- [jsDelivr cache] → New SHA in the Webflow `<link>` / `<script>` (see `rad-workflow-scripts.md`); do not rely on `@main`.

## Migration Plan

1. Add the CSS combo and extend `setDrawerButtons`.
2. Point the site-wide Head `<link>` and Footer `<script>` at the new commit SHA and publish Webflow.
3. Rollback: revert the SHA; markup closed-state `.is-none` still matches the old JS.
