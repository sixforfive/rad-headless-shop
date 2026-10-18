## Context

See proposal.md. Grayscale smoothing and difference blend already live at the top of `css/global.css`. `.navbar.is-normal` drops blend and sets theme text. `html.is-full-screen .layer *` forces `#fff`. Work starts from `main` at `9501ebc` on branch `fix/1x-text-stroke`.

## Goals / Non-Goals

**Goals:**

- One `@media (max-resolution: 1.5dppx)` block immediately after `.navbar.is-normal .menu-link`.
- `0.25px currentColor` on content. `0.35px #000` on blended white chrome.
- The open-drawer navbar follows whichever of those two it is actually painting.

**Non-Goals:**

- `text-rendering: geometricPrecision`. It was tried for this bug and main is already without it.
- Retina (`> 1.5dppx`).
- JS, a new file, or Webflow markup.

## Decisions

**Stroke, not a render hint.** A centred stroke paints half its width inward. `0.35px` removes 25% of the 1.39px stem. `0.25px` in `currentColor` adds weight where type is not blending. Alternative considered: `text-rendering: geometricPrecision`. Rejected — it did not fix the bloom.

**Black only where difference is on.** `#000` under difference contributes nothing, so the inward half of the stroke eats the stem instead of adding to it. `currentColor` on a blending node would be white and would bold it. `.navbar.is-normal` has dropped difference, so it takes `currentColor`. `.layer.is-blend .navbar.is-normal` is still inside a blending layer that forces `#fff`, so it stays on `#000`.

**The block:**

```css
/* 1x and 125% scaling only. Unica 77 Medium has a 126/1000 UPM stem, so at 11.008px
   it lands on 1.39 device px and blooms under difference. Stroke is centred, so half
   paints inward: 0.35px removes 25% of the stem. Retina stays untouched. */
@media (max-resolution: 1.5dppx) {
  /* Content reads thinner on Windows than on Retina. Stroke in the text's own colour
     thickens it and stays correct in both themes. */
  body {
    -webkit-text-stroke: 0.25px currentColor;
  }

  /* Blended white chrome. Black is a no-op under difference, so it erases stem edge. */
  .navbar,
  .second-menu,
  .layer.is-blend,
  .product-info-col,
  .gallery-full-screen_close,
  .link-sec-brack.is-zoom,
  html.is-full-screen .product-nav-tab,
  .custom-cursor-label {
    -webkit-text-stroke: 0.35px #000;
  }

  /* Drawer open: navbar drops difference and uses theme text, so treat it as content. */
  .navbar.is-normal {
    -webkit-text-stroke: 0.25px currentColor;
  }

  /* Drawer open over an open fullscreen gallery: the layer still blends and forces
     #fff, so currentColor would be white and would bold. Keep black here. */
  .layer.is-blend .navbar.is-normal {
    -webkit-text-stroke: 0.35px #000;
  }
}
```

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow Head `<link>` for `css/global.css` after commit; do not rely on `@main`.
- [`currentColor` inside `.layer.is-blend`] → The more specific `.layer.is-blend .navbar.is-normal` rule keeps `#000`.
- [Stroke on every `body` descendant at ≤1.5dppx] → Chrome rules override it. Retina is outside the query.

## Migration Plan

1. Branch `fix/1x-text-stroke` from `main` at `9501ebc`.
2. Insert the block in `css/global.css`.
3. Point the site-wide Head `<link>` at the new commit SHA and publish.
4. Rollback: revert the SHA.
