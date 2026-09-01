## Context

See proposal.md for motivation. Dim already lives in `js/global.js`: `openDrawer` adds `is-dimmed` on `.main-wrapper`; `closeDrawer` removes it. CSS in `css/global.css` sets opacity `1` → `0.15` with `0.3s ease`, and kills that transition under `prefers-reduced-motion`.

Live DOM on product and merch detail: `.gallery-full-screen` is a sibling of `.layer`, not a child of `main.main-wrapper` (`.main-wrapper` sits inside `.layer`). Fullscreen photos are therefore outside the current dim target. On pages without the gallery node, only `.main-wrapper` exists.

## Goals / Non-Goals

**Goals:**

- Same dim class and opacity on both page surfaces.
- Toggle both nodes on every open/close so gallery open/close while the drawer is up stays correct.

**Non-Goals:**

- Dimming `.layer`, z-index, or blend rules.
- Changing `setDrawerButtons`, overlay fade, or scroll lock.
- Webflow markup or `js/product.js`.

## Decisions

### Group the CSS selectors; do not duplicate the dim rules

Add `.gallery-full-screen` next to `.main-wrapper` on the existing opacity, transition, `.is-dimmed`, and reduced-motion rules. Same `0.15` / `0.3s ease`. Nested opacity is not a risk: they are siblings, not ancestor/descendant.

Alternative considered: a second copy of the dim block — two values to keep in sync.

### Always toggle both nodes in `openDrawer` / `closeDrawer`

Query `.main-wrapper` and `.gallery-full-screen` in `global.js`. Add `is-dimmed` to each on open; remove on close. Optional chaining when the gallery node is missing.

Do not gate the gallery toggle on `is-none` or `body.is-full-screen`. If the visitor opens the gallery after the drawer, or closes the gallery while the drawer is still open, the class is already on the node that becomes visible.

Alternative considered: dim only the visible surface — would need `product.js` to copy `is-dimmed` on gallery open/close.

Leave the overlay-swap early return in `openDrawer` as it is; dim already ran on the first open.

## Risks / Trade-offs

- [Gallery query omitted] → Photos stay bright. Mitigation: the JS task is required.
- [Desktop `.layer.is-blend` over dimmed photos] → CTA/footer still full opacity and still blend. Accepted; dimming `.layer` is out of scope.
- [jsDelivr cache] → New SHA in the Webflow `<link>` / `<script>`; do not rely on `@main`.

## Migration Plan

1. Group the CSS selectors and toggle `is-dimmed` on both nodes.
2. Point the site-wide Head `<link>` and Footer `<script>` at the new commit SHA and publish Webflow.
3. Rollback: revert the SHA (or the two files). Markup is unchanged.
