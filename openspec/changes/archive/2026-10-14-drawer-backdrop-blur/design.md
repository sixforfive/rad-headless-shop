## Context

See proposal.md. `.drawer-wrapper` only transitions `opacity` over `0.45s ease`. `fadeDrawerOut` hides the overlay on that opacity `transitionend`. Menu and cart share the wrapper. `prefers-reduced-motion: reduce` already sets `.drawer-wrapper` to `transition-duration: 0s` and `fadeDrawerOut` hides immediately in that case.

## Goals / Non-Goals

**Goals:**

- Own `backdrop-filter: blur(48px)` in this repo.
- Ramp the radius over `0.9s` while opacity stays `0.45s`.
- Hide on close only after the blur transition ends.

**Non-Goals:**

- Changing the menu line reveal or the page dim opacity.
- A new dependency.
- A different blur for menu and cart.

## Decisions

### Radius, not opacity

Rest state is `blur(0px)`. `.is-visible` is `blur(48px)`. Both `backdrop-filter` and `-webkit-backdrop-filter` transition over `0.9s ease`. Start at `blur(0px)`, not `none`, so the radius interpolates. Opacity stays `0.45s ease`. Alternative considered: one `0.9s` transition for opacity and blur together. Rejected — the shell fade stays `0.45s`.

### Hide on the blur event

`fadeDrawerOut` hides when `transitionend` is `backdrop-filter` or `-webkit-backdrop-filter` on `.drawer-wrapper`. The opacity event no longer hides the drawer. The first of those two blur events hides, so a prefixed and unprefixed pair does not hide twice. Reduced motion still skips the listener. Alternative considered: a timeout of `900ms`. Rejected — the existing close path waits on `transitionend`.

## Risks / Trade-offs

- [A browser does not fire a blur `transitionend`] → The drawer stays up. Both property names are accepted so WebKit's prefixed event still closes it.
- [Animating a 48px backdrop blur is expensive] → Accepted. The radius is the one the overlay already used.
- [Menu link leave does not remove `.is-visible`] → The blur stays at `48px` for that leave. Unchanged.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. Rollback: revert those two files. Webflow no longer supplies this blur, so a rollback removes it.
