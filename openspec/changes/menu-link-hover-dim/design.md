## Context

See proposal.md for motivation. `.menu-link` is already published on navbar and other chrome (`#cart-title`, `#currency-btn`). `css/global.css` already uses `:has()` and already dims sibling product thumbs inside `@media screen and (min-width: 768px) and (hover: hover) and (pointer: fine)`.

## Goals / Non-Goals

**Goals:**

- One CSS rule set covering every `.menu-link` on the page.
- Same 768px / fine-pointer gate as product-link hover.

**Non-Goals:**

- JS, GSAP, or a new file.
- Markup or attribute changes in Webflow.
- Changing `.navbar` mix-blend-mode.

## Decisions

### `body:has(.menu-link:hover) .menu-link:not(:hover)`, not a parent scope

```css
body:has(.menu-link:hover) .menu-link:not(:hover) {
  opacity: 0.3;
}
```

The spec is page-wide, including navbar. A navbar-only `:has()` would miss drawer and cart chrome.

Alternative considered: `mouseenter` / `mouseleave` in `js/global.js`. Rejected — CSS already expresses this the same way product-link hover does.

### Same media query as product-link hover

Put the rules in `@media screen and (min-width: 768px) and (hover: hover) and (pointer: fine)`. Touch must not stick a dim after a tap. Below 768px the spec forbids dim.

### `0.3s ease` on `.menu-link`

Put `transition: opacity 0.3s ease` on `.menu-link` so enter and leave both animate. Under `prefers-reduced-motion: reduce`, duration `0s`.

`body *` already transitions color/background/border, not opacity, so this rule is required.

### Stay in `css/global.css`

Site-wide sheet already loaded. `.menu-link` is the published class.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` for `css/global.css`; do not rely on `@main`.
- [Hidden `.menu-link.is-none` still matches] → `display: none` nodes cannot be hovered; their opacity is not visible.
- [Navbar `mix-blend-mode: difference`] → Opacity still recedes the blended text; intended.

## Migration Plan

1. Add the hover rules in `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish.
3. Rollback: revert the SHA.
