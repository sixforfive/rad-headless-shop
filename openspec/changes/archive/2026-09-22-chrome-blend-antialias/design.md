## Context

See proposal.md for motivation. `css/global.css` already sets `mix-blend-mode: difference` plus grayscale smoothing on `.navbar`, `.second-men`, and `.layer.is-blend`. The live class is `.second-menu`. `.footer` can sit inside `.layer` on product and merch; `product-fullscreen-gallery` forbids mix-blend on nodes inside `.layer.is-blend`.

## Goals / Non-Goals

**Goals:**

- One smoothing list covering `.navbar`, `.second-menu`, `.second-menu .text-meta`, `.footer`, `.footer-link`, and `.layer.is-blend`.
- Keep difference blend on `.navbar`, `.second-menu`, and `.layer.is-blend` only.

**Non-Goals:**

- JS, a new file, or Webflow markup.
- Setting `mix-blend-mode` on `.footer`.

## Decisions

### Split smoothing from blend

Smoothing on `.navbar`, `.second-menu`, `.second-menu .text-meta`, `.footer`, `.footer-link`, `.layer.is-blend`. Blend on `.navbar`, `.second-menu`, `.layer.is-blend`. Rename `.second-men` to `.second-menu`.

`mix-blend-mode` on `.second-menu` isolates glyph paint, so smoothing on the bar does not reach `.text-meta`. `.footer-link` paints its own color, so it needs the same declaration. Put grayscale AA on those type nodes, not only the chrome roots.

Alternative considered: add `.footer` to the existing combined rule. Rejected — that would set mix-blend on `.footer` inside `.layer.is-blend`.

Alternative considered: leave `.footer` off smoothing because Webflow already blends it. Rejected — published `.footer` has no blend rule, and smoothing is inherited only when it sits inside `.layer.is-blend`.

### Stay in `css/global.css`

Site-wide sheet already loaded. Same chrome block.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow Head `<link>` for `css/global.css` after commit; do not rely on `@main`.
- [Footer inside `.layer.is-blend`] → Smoothing on `.footer` and `.footer-link`; mix-blend stays off `.footer`.

## Migration Plan

1. Edit the chrome rule in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
