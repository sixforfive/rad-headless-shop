## Context

See proposal.md for motivation. `.product-gallery-collection.is-none` and Webflow `.is-none` are `display: none`, which cannot fade. `html.is-full-screen .product-gallery-collection.is-default { display: none }` and `html.is-full-screen .gallery-full-screen { display: block !important }` in `css/global.css` exist so a persisted open paints before `product.js`. `.gallery-full-screen` already transitions opacity at `0.45s ease-out` for drawer dim (`.is-dimmed` → `0.2`) and lists background, color, and border at the same timing. `setFullScreenGallery` in `js/product.js` toggles `is-none` in the same turn on product and merch detail. `applyLabel` in `js/global.js` writes `textContent` on one `.custom-cursor-label` and toggles `.is-visible` (`opacity 0.15s ease-out`). `#menu-open` / `#menu-close` fade out with `opacity 0.3s ease` and fade in with `opacity 0.3s ease 0.3s`.

## Goals / Non-Goals

**Goals:**

- Fade the two galleries without a first-paint intro on a persisted open.
- Keep drawer dim and theme color on their current timing.
- Handoff cursor copy with two nodes so the visible string is never replaced in place.

**Non-Goals:**

- Webflow markup or a new dependency.
- Changing enter/leave label timing.
- Fading `.layer` on mobile. Mobile still hides `.layer` immediately.

## Decisions

### Opacity crossfade, then `is-none`

Desktop open and close: both surfaces use opacity `0.8s ease`, starting together. The one fading out gets `pointer-events: none` immediately. Mobile fades only `.gallery-full-screen`; `.product-gallery-collection.is-default` stays shown and never receives `is-none` for this switch.

`setFullScreenGallery` adds `is-gallery-fading` on `html` for a user-driven switch. While that class is set, the first-paint `display: none` on `.product-gallery-collection.is-default` does not apply, and `.gallery-full-screen` stays `display: block` even if `is-full-screen` is already off. On `transitionend` (or reduced motion, in the same turn), remove `is-gallery-fading` and add `is-none` to the surface that faded out.

A persisted open has `html.is-full-screen` and no `is-gallery-fading`, so the existing first-paint rules still hide the default collection and show the full-screen gallery with no fade.

Alternative considered: leave both nodes displayed forever and only use opacity. Rejected — a full-screen list left in flow at `visibility: hidden` still takes height.

### Switch opacity is not the dim opacity

`.gallery-full-screen.is-switching` and `.product-gallery-collection.is-default.is-switching` set opacity to `0.8s ease` and still list background, color, and border at `0.45s ease-out`. Outside a switch, `.gallery-full-screen` keeps opacity `0.45s ease-out` so drawer dim does not slow down. `prefers-reduced-motion` sets those durations to `0s`.

Alternative considered: change the base `.gallery-full-screen` opacity duration to `0.8s`. Rejected — that would slow `.is-dimmed`.

### Two cursor labels, menu timing only on a copy change

`initCursorLabel` appends two `.custom-cursor-label.text-meta` nodes. Both get the same `translate3d`. Enter and leave keep `.is-visible` at `opacity 0.15s ease-out`.

A change from one non-empty value to another puts `.is-out` on the node that is showing the old string (`opacity 0.3s ease`, text unchanged) and `.is-in` plus the new string on the other (`opacity 0.3s ease 0.3s`). A later change before the handoff finishes treats the incoming node as the one to fade out. Reduced motion writes the new string immediately and skips both classes.

Alternative considered: one node, fade out, swap `textContent`, fade in. Rejected — the string changes on the node that is still the visible label, and the delay has to be a timer instead of the menu transition pair.

## Risks / Trade-offs

- [Dim and switch in the same moment] → Opacity follows the `0.8s` switching transition until `is-switching` drops. Dim alone stays `0.45s`.
- [Missed `transitionend`] → Reduced motion and a zero computed duration settle in the same turn. A fallback timer at `800ms` settles if the event never fires.
- [Rapid open/close] → A new `setFullScreenGallery` call cancels the in-flight settle and starts from the current opacities.
- [Label handoff under a moving pointer] → Each apply reads the current attribute. The node still showing the old string keeps that string until it has faded out.

## Migration Plan

1. Ship `css/global.css`, `js/product.js`, and `js/global.js` together.
2. Rollback: revert those files. No markup or data change.

## Open Questions

None.
