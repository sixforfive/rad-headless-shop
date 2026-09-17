## Context

See proposal.md for motivation. Shop `/shop` and merch `/merch` already publish `.product-list` with `.product-thumb` children wrapping `.product-link`. `css/global.css` already uses `:has()`. Inner `.thumb-light` / `.thumb-dark` already animate `opacity` for the theme swap.

## Goals / Non-Goals

**Goals:**

- One CSS rule set covering shop gallery, shop list, and merch.
- Dim only while a `.product-link` is hovered, including leave-through-gap.

**Non-Goals:**

- JS, GSAP, or a new file.
- Markup or attribute changes in Webflow.
- Changing inner image opacity used by the theme swap.

## Decisions

### CSS `:has(.product-link:hover) .product-link:not(:hover)`, not thumb or list `:hover`

```css
.product-list:has(.product-link:hover) .product-link:not(:hover) {
  opacity: 0.3;
}
```

Hover source and dim target are both `.product-link`. List `:hover` would dim when the pointer is in the gaps. The spec forbids that.

Alternative considered: `mouseenter` / `mouseleave` in `shop.js` and `merch.js`. Rejected — two files for a hover that CSS already expresses, and the shop script is not on merch.

### Opacity on `.product-link`, not `.product-thumb` or inner images

Those inner images already own opacity for light/dark. Dim the link so the theme swap stays independent and the selector matches the hover source.

### `0.3s ease`, same as other site fades

Put `transition: opacity 0.3s ease` on `.product-list .product-link` so enter and leave both animate. Under `prefers-reduced-motion: reduce`, duration `0s`.

`body *` already transitions color/background/border, not opacity, so this rule is required.

### Fine pointer only

Wrap the dim in `@media (hover: hover) and (pointer: fine)`. Touch must not stick a dim after a tap. Same gate as the cursor label.

### Stay in `css/global.css`

Site-wide sheet already loaded. Shop and merch both match `.product-list .product-link`. No extra merch selector.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [Nested interactive child steals `:hover`] → `:has(.product-link:hover)` still matches while the pointer is inside the link.
- [Chrome outside the link does not dim] → Intended; only `.product-link` recedes.

## Migration Plan

1. Add the hover rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
