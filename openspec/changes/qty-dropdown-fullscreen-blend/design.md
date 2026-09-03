## Context

See proposal.md for motivation. Webflow puts the desktop CTA in `.layer-cta.is-desktop`: `position: fixed; inset: 0 0 auto`, `pointer-events: none`, `display: none` at 991px and down, holding a second copy of the product grid with only `.cta-wrapper > #add-to-cart` and `#quantity.qty-dropdown` filled. It is a sibling of `.layer`, so `.layer.is-blend` and `body.is-full-screen .layer *` in `css/global.css` never reach it. At 991px and down the desktop layer is hidden and `.cta-wrapper.is-landscape` inside `.layer` takes over. `.qty-dropdown` has no background, a `1px solid var(--_theme---border--primary)` border, and `pointer-events: auto`.

## Goals / Non-Goals

**Goals:**

- Desktop `.qty-dropdown` inverts against the open gallery like the rest of the blended chrome.

**Non-Goals:**

- Blending `.layer-cta` itself.
- `#add-to-cart`, which Webflow paints with its own background and `mix-blend-mode: normal`.
- Merch, which has no `.layer-cta`.
- JS or Webflow structure.

## Decisions

### Blend the element, not the layer

`body.is-full-screen .layer-cta .qty-dropdown { mix-blend-mode: difference }`.

Alternative considered: `mix-blend-mode: difference` on `.layer-cta`, matching `.layer.is-blend`. Rejected: the layer would then blend `#add-to-cart` as a solid `.button`, and the request is the dropdown only.

### Scope the selector to `.layer-cta`, not every `.qty-dropdown`

A bare `body.is-full-screen .qty-dropdown` would also hit the landscape dropdown inside `.layer.is-blend`. A blend inside a blending ancestor composites against that ancestor's group, not the photos behind it, so the landscape dropdown would stop inverting at 768-991px. Prefixing `.layer-cta` keeps exactly one blend group per dropdown.

### White text and border come from the existing rule

`difference` against a near-black theme border leaves the backdrop almost unchanged, so the dropdown needs `#fff` to read. Add `.layer-cta .qty-dropdown` and its descendants as extra selectors on the existing `body.is-full-screen .layer *` rule rather than writing a second `#fff` block.

## Risks / Trade-offs

- [Archive order] → `fullscreen-layer-borders` modifies the same "Open gallery forces white body text" requirement and is not archived yet. This delta is written on top of its text; archive it first so neither change loses content.
- [jsDelivr pin] → CSS does not go live until the Head `<link>` SHA moves.

## Migration Plan

1. Edit `css/global.css` as in tasks.md.
2. Point the site-wide Head `<link>` at the new commit SHA and publish Webflow when you want it live.
3. Rollback: delete the new rule and the two added selectors.
