## Context

See proposal.md — Why. `readQuantity` in `js/cart.js` already finds `[data-quantity]` then `#quantity`. The product Embed puts `data-quantity` on a native `<select>`, so that lookup returns the select. The function then walks children for a digit-only node; `<option>` children match, and the last one wins.

## Goals / Non-Goals

**Goals:**

- Native `select.value` is the quantity sent to `cartLinesAdd`.

**Non-Goals:**

- Webflow markup, drawer, badge, syncing two selects, `cartLinesUpdate`.

## Decisions

**`select` before text fallbacks.** If the matched node is a `SELECT`, or `querySelector("select")` finds one inside it, parse `.value`. Then `.w-dropdown-toggle`, then last digit-only child, then `1`. Alternative considered: only `el.value` when `tagName === "SELECT"`. Kept the inner `querySelector("select")` so a wrapper with `id="quantity"` still works if the select is a child.

**No README change.** Behavior fix in one function; the `js/cart.js` row already covers add to cart.

## Risks / Trade-offs

- [Empty or non-numeric `value`] → Same as today: `1`.
- [Two selects in one wrapper] → First `[data-quantity]`, else first `select` under `#quantity`. One control per product is the Webflow contract.

## Migration Plan

1. Change `readQuantity` in `js/cart.js`.
2. Point Footer `js/cart.js` at the new SHA. Publish.
3. On `/product/{slug}`, set qty to `3`, Add to cart; confirm `lines[0].quantity` is `3`.
4. Rollback: previous SHA.
