## Context

See proposal.md for motivation. Shop `/shop` and merch `/merch` already publish `.product-list` with `.product-thumb` children. `css/global.css` already styles those thumbs for grid placement and already uses `:has()`. Inner `.thumb-light` / `.thumb-dark` already animate `opacity` for the theme swap.

## Goals / Non-Goals

**Goals:**

- One CSS rule set covering shop gallery, shop list, and merch.
- Dim only while a thumb is hovered, including leave-through-gap.

**Non-Goals:**

- JS, GSAP, or a new file.
- Markup or attribute changes in Webflow.
- Changing inner image opacity used by the theme swap.

## Decisions

### CSS `:has(.product-thumb:hover)`, not list `:hover`

```css
.product-list:has(.product-thumb:hover) .product-thumb {
  opacity: 0.3;
}
.product-list:has(.product-thumb:hover) .product-thumb:hover {
  opacity: 1;
}
```

`:has` is already in this stylesheet. List `:hover` would dim thumbs when the pointer is in the gaps; the spec forbids that.

Alternative considered: `mouseenter` / `mouseleave` in `shop.js` and `merch.js`. Rejected — two files for a hover that CSS already expresses, and the shop script is not on merch.

### Opacity on `.product-thumb`, not `.thumb-light` / `.thumb-dark`

Those inner images already own opacity for light/dark. Dim the parent so the theme swap stays independent.

### `0.3s ease`, same as other site fades

Put `transition: opacity 0.3s ease` on `.product-list .product-thumb` so enter and leave both animate. Under `prefers-reduced-motion: reduce`, duration `0s`.

`body *` already transitions color/background/border, not opacity, so this rule is required.

### Fine pointer only

Wrap the dim in `@media (hover: hover) and (pointer: fine)`. Touch must not stick a dim after a tap. Same gate as the cursor label.

### Stay in `css/global.css`

Site-wide sheet already loaded. Shop and merch both match `.product-list .product-thumb`. No extra merch selector.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [Nested interactive child steals `:hover`] → `:has(.product-thumb:hover)` still matches while the pointer is inside the thumb.
- [Opacity on the link dims captions too] → Intended; the whole thumb recedes, not only the image.

## Migration Plan

1. Add the hover rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
