## Context

See proposal.md for motivation. `/shop` already publishes one Collection List (`.product-list.is-gallery`) whose `.product-thumb` items carry `gallery-column-start`, `gallery-column-end`, and `list-column`. Switch buttons are `.switch-btn` with `data-view="gallery"` / `data-view="list"`; the gallery button has `is-active`. Webflow CSS already defines the 12-column gallery and 6-column list templates, including collapse at 479px (gallery → 1 col) and 767px (list → 3 then 2 cols). `gallery-column-end` is an inclusive column number; CSS `grid-column-end` is a grid line, so the mapped line is value + 1.

## Goals / Non-Goals

**Goals:**

- Map published attributes onto CSS grid placement through variables, so a class on `.product-list` can switch views.
- Toggle `.is-gallery` from `data-view` buttons without a page navigation.

**Non-Goals:**

- Animated morph (FLIP / View Transitions).
- `?view=` URLs.
- Merch grid.
- Deleting or updating the leftover `/shop-list` Webflow page.

## Decisions

### CSS variables, not inline grid-column

Copy attributes onto `--gallery-column-start`, `--gallery-column-end` (already + 1), and `--list-column`. Stylesheet rules apply them. Inline `element.style.gridColumn*` would beat the collapse media queries.

Alternative considered: typed CSS `attr()` — no JS, but Safari support is still uneven. Attribute selector tables for 1–12 — zero JS, verbose, and still need + 1 for gallery end.

### Inclusive end is applied in JS

`--gallery-column-end` is set to `Number(end) + 1`. CSS stays a straight `var()` mapping.

### View is the `is-gallery` class

Gallery CSS is `.product-list.is-gallery .product-thumb`. List CSS is `.product-list:not(.is-gallery):not(.is-merch) .product-thumb` so Merch is untouched. One script (`js/shop.js`) on the Shop page. Stubs `shop-gallery.js` / `shop-list.js` are removed.

Alternative considered: two page scripts — fights the one-list merge. Keying the switch off button text — breaks if copy changes.

### Collapse resets match Webflow breakpoints

Gallery `grid-column: auto` at `max-width: 479px`. List `grid-column: auto` at `max-width: 767px`.

## Risks / Trade-offs

- [Shop page Footer does not load `shop.js`] → Placement and switch stay inert. Document the embed in `rad-workflow-scripts.md`; user adds the tag.
- [jsDelivr CSS cache] → Purge `@main` after the CSS push.
- [Sparse auto-placement leaves holes in list view] → Accepted. `grid-auto-flow: dense` is out of scope.

## Migration Plan

1. Ship `js/shop.js` and `css/global.css`.
2. Point Shop page Footer `<script src>` at `shop.js` (raw GitHub `@main` while testing).
3. Purge jsDelivr for `global.css`.
4. Rollback: remove the Shop page script tag and revert CSS; grid returns to auto-place.

## Open Questions

None.
