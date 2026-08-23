## Context

See proposal.md for motivation. Shipped code is [`js/product.js`](../../../js/product.js) and [`css/global.css`](../../../css/global.css). Split is `max-width: 767px`. In-page collection uses combo `is-default`.

Two structural facts from Webflow shape every decision below. `.gallery-full-screen` is a preceding sibling of `.layer`, not a child. And `.layer` is `position: fixed; inset: 0 0 auto` above 767px, `position: static` at or below it. Desktop therefore keeps `.layer` on top of the gallery, which is why hit-testing has to be punched through it.

## Goals / Non-Goals

**Goals:**

- One function `setFullScreenGallery` sets every class for the current viewport so modes cannot leave leftovers.
- Combo `.is-none` / `.is-blend` / `body.is-full-screen`; no generic `.is-none`.

**Non-Goals:**

- Repositioning `.gallery-full-screen` in Webflow.
- Merch template.
- Showing [close] on desktop in Webflow (z-index is in CSS; visibility is Designer).
- Unblending the CTA while the gallery is open.

## Decisions

### Viewport at click and on `change`

`mobileQuery = matchMedia("(max-width: 767px)")`. `galleryOpen` is set in `setFullScreenGallery`. On `change`, if `galleryOpen`, call `setFullScreenGallery(true)` again.

### Desktop vs mobile class sets

Open, mobile: gallery visible; `.layer.is-none`; remove `is-blend`; default collection not `is-none`.

Open, desktop: gallery visible; remove `.layer.is-none`; `.layer.is-blend`; default collection `is-none`.

Closed: gallery `is-none`; layer neither `is-none` nor `is-blend`; default collection not `is-none`; remove `body.is-full-screen`.

Open (either breakpoint): `body.is-full-screen`. CSS: `body.is-full-screen { color: #fff }`. Closed color stays Webflow `var(--_theme---text--primary)` — do not hardcode it. Not `:has()`.

### Blend `.layer`, not its children

`position: fixed` always creates a stacking context, and `mix-blend-mode` on a descendant blends only within the nearest ancestor stacking context. Since the gallery sits outside `.layer`, a descendant blend finds a transparent backdrop, the source color passes through unchanged, and it reads as no blend at all. The fixed element is the deepest node that can blend against the gallery, so `difference` goes on `.layer.is-blend` and nothing inside sets `mix-blend-mode`. `.navbar` and `.gallery-full-screen_close` are outside `.layer` and blend on their own.

`.layer` cannot stop being fixed to escape this — the gallery scrolls behind it, so a static or absolute layer would scroll away with the page.

The consequence is that `.cta-wrapper` inverts along with everything else; a descendant cannot opt out of an ancestor's blend group, so `isolation: isolate` / `mix-blend-mode: normal` on it does nothing. Alternatives considered and not adopted: an opaque black box outside `.layer` behind the CTA, since `difference(Cs, black) = Cs` and `.button` is opaque enough to hide it; a duplicate CTA outside `.layer` toggled with `is-none`, matching the pattern already used for `.product-gallery-collection.is-default` vs `.gallery-full-screen`; and `backdrop-filter: invert(1)`, which escapes the stacking context but inverts the whole element box rather than per glyph.

### Hit-testing on `.layer.is-blend`

`pointer-events: none` on `.layer.is-blend`; `auto` on `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#download-spec`, `#add-to-cart`, and `#quantity`. Close control: `.gallery-full-screen:not(.is-none) .gallery-full-screen_close { z-index: 6; pointer-events: auto }`. `#full-screen-close` closes at every breakpoint.

## Risks / Trade-offs

- [`is-default` missing] → default collection never hides on desktop. Webflow combo required.
- [Webflow hides [close] on desktop] → close is still click-through on the image list; [close] works when visible.
- [Token-bound `color` on children] → `body.is-full-screen` does not override elements that set their own color.
- [CTA inverts over the photos] → accepted; unblending needs one of the alternatives above and is out of scope here.

## Migration Plan

Restoring the blend on `.layer.is-blend` is the only unshipped item; the rest of this change is already in `css/global.css` and `js/product.js`. Webflow loads the stylesheet pinned to a commit hash (`cdn.jsdelivr.net/gh/sixforfive/rad-headless-shop@<hash>/css/global.css`), so nothing changes live until that hash is bumped after the commit lands. Rollback is re-pinning the previous hash.
