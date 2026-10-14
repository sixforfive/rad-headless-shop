## Context

See proposal.md. `.second-menu` starts at opacity `0`, uses `transition: opacity 0.3s ease-out`, and reaches opacity `1` on `html.is-ready`. It does not translate. `html.is-leaving` sets it back to opacity `0`.

`.collection-hero-logo` is outside the page rise. It already shares `opacity 0.3s ease-out` with the gallery sibling, and `html.is-leaving .collection-hero-logo` sets opacity `0`. Nothing sets it to opacity `0` before ready, so it is visible on first paint. That same rule also transitions `transform`, `background-color`, `color`, and `border-color`.

The reduced-motion block already sets `transition-duration: 0s` on `.collection-hero-logo`. `.second-menu` is not in that list. Its class rule outranks `body *`, so the menu can still fade when reduced motion is on. The page-load spec says ready content appears immediately.

## Goals / Non-Goals

**Goals:**

- Start `.collection-hero-logo` at opacity `0` and fade it to `1` on `html.is-ready` over `0.3s` ease-out. Do not move it.

**Non-Goals:**

- Changing the `.second-menu` rule or its reduced-motion gap.
- Rising the hero gallery.
- Fading the logo again when a hero tile arrives.

## Decisions

### Keep the logo's existing transition

Set `.collection-hero-logo` to `opacity: 0`, and set `html.is-ready .collection-hero-logo` to `opacity: 1`. Put that ready rule before `html.is-leaving .collection-hero-logo`. Leave keeps `is-ready` on `html`, and both selectors have the same specificity, so the later leave rule must stay last. Leave the logo on its current transition, which already includes `opacity 0.3s ease-out`. Do not set `transform`. Leave the logo in the reduced-motion `transition-duration: 0s` list so it snaps.

Adding the logo to the `.second-menu, .footer` block would replace that transition with an opacity-only shorthand and drop the theme color transitions already on the logo. The visible enter fade is the same either way: opacity only, `0.3s`, ease-out, no movement.

On `/`, `.main-wrapper` is not the element hidden until ready. The hide rule is `.main-wrapper:not(:has(.collection-hero-logo))`. Ancestors of the logo stay visible, so the logo's own opacity is what fades.

Update the comment above the page-fade rules so it no longer says the logo does not fade on enter.

## Risks / Trade-offs

- [A later opacity rule on an ancestor] → The logo fade only reads if ancestors stay at opacity `1`. Do not add the logo's parent to the rise.
- [Reduced motion still snaps the logo] → That matches the page-load requirement. It does not match the menu's leftover fade. Do not remove the logo from the `0s` list to copy that gap.

## Migration Plan

1. Ship `css/global.css`.
2. Rollback: revert that file.
