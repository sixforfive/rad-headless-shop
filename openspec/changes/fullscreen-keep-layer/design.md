## Context

See proposal.md for motivation. `js/product.js` already opens `.gallery-full-screen` and hides `.layer` via `.is-none`. Triggers (desktop lists vs mobile IDs, viewport at click) stay. In-page collection is a sibling of the full-screen copy; published markup does not yet have `is-default` on it. `.cta-wrapper` lives under `.layer .main-wrapper .product-details-col` and already paints an opaque primary background. `.navbar` already uses `mix-blend-mode: difference` on its own.

## Goals / Non-Goals

**Goals:**

- One function still owns open/close class swaps.
- Hide via `.is-none` combo CSS, same as other chrome.
- Blend class on `.layer` only while open.

**Non-Goals:**

- Changing triggers, scroll lock, or GSAP.
- Repositioning `.gallery-full-screen` (fixed overlay) unless Webflow already stacks it under chrome.
- Generic `.is-none` { display: none }.
- Merch template.

## Decisions

### Hide `.product-gallery-collection.is-default`, not `.layer`

`setFullScreenGallery(open)` toggles `.is-none` on `.gallery-full-screen` (closed when `!open`) and on `.product-gallery-collection.is-default` (hidden when open). Do not toggle `.is-none` on `.layer`. Keep `.layer.is-none` CSS; it becomes unused.

Selector is the combo on the in-page collection, not a descendant `.is-default`. Full-screen collection must not have `is-default`.

Alternative considered: hide `.product-gallery-col` — would also hide `#full-screen-open`; out of scope.

### Blend class `is-blend` on `.layer`

Open adds `is-blend`, close removes it.

```css
.layer.is-blend {
  mix-blend-mode: difference;
}
.layer.is-blend .cta-wrapper {
  isolation: isolate;
  mix-blend-mode: normal;
}
```

Matches `.navbar` / `.navbar.is-normal`. `isolation` plus the CTA’s existing opaque background is the exclusion. Applying `difference` only to `.layer > *` still blends `.main-wrapper` as a group and would invert the CTA anyway.

Alternative considered: `difference` on every descendant except `.cta-wrapper` — fights navbar’s own difference and is broader than asked.

### Combo CSS for the default collection

Add `.product-gallery-collection.is-none` to the existing `display: none` list in `css/global.css`. Webflow must add combo `is-default` on the in-page collection before hide works.

## Risks / Trade-offs

- [`is-default` missing on publish] → querySelector is null; open still shows full-screen gallery but in-page images stay. Mitigation: Webflow combo is required, same as the CSS task.
- [Ancestor `mix-blend-mode` still composites the CTA] → isolation + `normal` + opaque CTA background is the mitigation; if CTA still inverts, follow-up is blending siblings of `.cta-wrapper`, not `.layer`.
- [Navbar already `difference`] → layer-level difference can double-invert navbar. Accept for this change; do not add `.navbar.is-normal` unless it looks wrong.
- [`.gallery-full-screen` is a preceding sibling, not `position: fixed`] → chrome may sit below the gallery in document flow instead of over it. Stacking is Webflow; this change only swaps classes.

## Migration Plan

1. Add `is-default` on the in-page `.product-gallery-collection` in Webflow; publish.
2. Ship `js/product.js` and `css/global.css`; point product script at the new SHA (or `@main` while testing).
3. Rollback: revert the SHA; restore `setFullScreenGallery` hiding `.layer`. Markup `is-default` can stay.
