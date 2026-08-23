## Context

See proposal.md for motivation. Shipped code is [`js/product.js`](../../../js/product.js) and [`css/global.css`](../../../css/global.css). Split is `max-width: 767px`. In-page collection uses combo `is-default`. `.gallery-full-screen` is a preceding sibling of `.layer`. Desktop keeps `.layer` visible, so it sits on top of the gallery unless pointer-events are punched through.

`fullscreen-keep-layer` described hide-default-collection only, with no breakpoint split or hit-testing. This snapshot replaces that as the contract.

## Goals / Non-Goals

**Goals:**

- One function `setFullScreenGallery` sets every class for the current viewport so modes cannot leave leftovers.
- Combo `.is-none` / `.is-blend` / `body.is-full-screen`; no generic `.is-none`.

**Non-Goals:**

- Repositioning `.gallery-full-screen` in Webflow.
- Merch template.
- Showing [close] on desktop in Webflow (z-index is in CSS; visibility is Designer).

## Decisions

### Viewport at click and on `change`

`mobileQuery = matchMedia("(max-width: 767px)")`. `galleryOpen` is set in `setFullScreenGallery`. On `change`, if `galleryOpen`, call `setFullScreenGallery(true)` again.

### Desktop vs mobile class sets

Open, mobile: gallery visible; `.layer.is-none`; remove `is-blend`; default collection not `is-none`.

Open, desktop: gallery visible; remove `.layer.is-none`; `.layer.is-blend`; default collection `is-none`.

Closed: gallery `is-none`; layer neither `is-none` nor `is-blend`; default collection not `is-none`; remove `body.is-full-screen`.

Open (either breakpoint): `body.is-full-screen`. CSS: `body.is-full-screen { color: #fff }`. Closed color stays Webflow `var(--_theme---text--primary)` — do not hardcode it. Not `:has()`.

### Blend named chrome, not `.layer`

`mix-blend-mode: difference` on a parent composites the whole subtree, so `isolation` / `normal` on `.cta-wrapper` cannot un-blend `#add-to-cart` / `#quantity`. Do not set `mix-blend-mode` on `.layer.is-blend`. Set `difference` only on `.product-info-col`, `.price-tag`, `.product-details-wrapper`, and `.footer`. `.cta-wrapper` is a sibling of `.price-tag` and `.product-details-wrapper` under `.product-details-col`, so it stays out. Navbar already uses `difference` on its own.

### Hit-testing on `.layer.is-blend`

`pointer-events: none` on `.layer.is-blend`; `auto` on `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#download-spec`, `#add-to-cart`, and `#quantity`. Close control: `.gallery-full-screen:not(.is-none) .gallery-full-screen_close { z-index: 6; pointer-events: auto }`. `#full-screen-close` closes at every breakpoint.

## Risks / Trade-offs

- [`is-default` missing] → default collection never hides on desktop. Webflow combo required.
- [Webflow hides [close] on desktop] → close is still click-through on the image list; [close] works when visible.
- [Token-bound `color` on children] → `body.is-full-screen` does not override elements that set their own color.
- [Gallery col / other chrome] → not in the blend list, so they stay uninverted while the gallery is open.

## Migration Plan

Already shipped. New thread: treat this change as the spec; archive after review. Do not implement `fullscreen-keep-layer` on top of this.
