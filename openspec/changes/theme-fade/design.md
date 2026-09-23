## Context

See proposal.md. Theme color lives on `html` (`background-color`) and on `body, body *` (`background-color` 0.3s ease-out, `color` and `border-color` 0.45s ease). A `transition` shorthand replaces every property not listed. These shorthands omit the color properties: the page-enter rule on `.main-wrapper:not(:has(.collection-hero-logo))`, `:has(> .collection-hero-logo) > :not(.collection-hero-logo)`, and `.products-collection` (opacity and transform 0.6s ease); `.gallery-full-screen` (opacity 0.45s ease-out); `html.is-ready .main-wrapper.is-dimmed` (opacity 0.45s ease-out). The dim rule wins over the page-enter rule while a drawer is open.

The collection mosaic is a transparent canvas. `applyModeTextures()` assigns `material.map` in one frame. Hover dim already mixes in that material's `onBeforeCompile` via `uDim` and `uBg`.

## Goals / Non-Goals

**Goals:**

- One 0.45s ease-out for theme `background-color`, `color`, and `border-color`, including `html`.
- Those three properties survive the page-enter, fullscreen-gallery, and drawer-dim shorthands.
- Canvas planes crossfade on the same curve without moving the view.

**Non-Goals:**

- Changing page-enter (0.6s ease) or drawer-dim opacity timing.
- A dark image stack on product or merch photos.
- Hover-dim shorthands on `.menu-link` and `.product-link`.
- A new dependency.

## Decisions

### List the color properties on each shorthand that would drop them

`html, body, body *` gets `background-color`, `color`, and `border-color` at 0.45s ease-out. `.thumb-dark` and `.hero-photo-dark` opacity use that same timing. The page-enter rule, `.gallery-full-screen`, and `html.is-ready .main-wrapper.is-dimmed` keep their current opacity and transform durations and add the three color properties at 0.45s ease-out. `html` joins the reduced-motion `transition-duration: 0s` list.

Alternative considered: one rule with `transition-property` appended via a custom property. Rejected — each shorthand is the whole `transition` value, so the properties have to be written on that rule.

### Crossfade in the existing plane shader

Add an incoming map and a mix uniform next to `uDim`. The texture mix runs before the hover-dim mix. The existing frame loop drives the mix from 0 to 1 over 450ms with CSS `ease-out` (`cubic-bezier(0, 0, 0.58, 1)`). A toggle starts only once the incoming image is decoded; a cached image starts on that frame. A second toggle mid-fade restarts from the current mix toward the new target. Reduced motion assigns the map and sets the mix to 1. Plane scale, pan, and copies stay as they are; `fitPlaneScale` does not run on a mode toggle.

Alternative considered: fade `material.opacity` to 0, swap, fade back. Rejected — that dips through the page background instead of blending the two photos. Alternative considered: a second plane per tile. Rejected — it doubles the draw and splits hover dim and hit testing.

## Risks / Trade-offs

- [Light and dark photos differ in aspect] → Scale stays on the mounted size, so the new photo may letterbox inside the old plane. Layout does not jump.
- [Incoming photo is still downloading] → The outgoing photo holds until decode, then the 0.45s mix starts. The fade is never a blank frame.
- [Menu and product-link hover rules still replace `transition`] → Those labels can snap. Out of scope.

## Migration Plan

1. Ship `css/global.css` and `js/collection.js`.
2. Rollback: revert those two files.
