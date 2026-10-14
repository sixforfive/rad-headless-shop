## Context

See proposal.md for motivation. `revealPage` in `js/global.js` adds `html.is-ready` on one `requestAnimationFrame`. The non-home from-state and the ready state both use `.main-wrapper:not(:has(.collection-hero-logo))`. The ready state sets `transform: none`. `.products-collection` has no resting transform, so leaving `.is-leaving` returns it to `none`. `/` is excluded because `.collection-hero-logo` is in the page. Back/forward restore already sets `is-ready` in the `pageshow` handler and stays that way.

## Goals / Non-Goals

**Goals:**

- The hidden, lowered state paints, then `is-ready` starts the rise.
- The rules whose opacity and transform change do not use `:has()`.
- The rise and the shop view switch end at `translateY(0)`.

**Non-Goals:**

- A new distance, duration, or easing.
- Changing the collection logo fade, the leave, or the drawer dim.
- Replaying the rise when a page is restored from the back/forward cache.
- Webflow markup or a new dependency.

## Decisions

### Paint, then reveal on the next frame

`revealPage` reads `documentElement.offsetWidth`, then adds `html.is-ready` inside a second `requestAnimationFrame`. The first frame can paint opacity `0` and `translateY(0.75rem)`. The class change is the frame after that.

Alternative considered: `@starting-style` on `.main-wrapper`. Rejected — the rise still has to wait until layout scripts call `radPageReady`. A class added after that wait is the gate we already have.

### `:has()` only locks `/`

`.main-wrapper` starts invisible and lowered, and its transition does not use `:has()`. `html:has(.collection-hero-logo) .main-wrapper` sets opacity `1` and `transform: none` so `/` never enters that from-state. `html.is-ready .main-wrapper` and `html.is-leaving .main-wrapper` run the rise and the sink. `html.is-ready:has(.collection-hero-logo) .main-wrapper` and the matching leave rule win on `/` and keep opacity `1` and `transform: none`.

Alternative considered: an `is-home` class in the Webflow markup. Rejected — the logo is already in the DOM, and the markup stays unchanged.

### End at `translateY(0)`

`html.is-ready .main-wrapper` sets `transform: translateY(0)`. `.products-collection` sets the same at rest, and `.products-collection.is-leaving` keeps `translateY(0.75rem)`. Removing `is-leaving` interpolates back to `0`.

Alternative considered: keep `transform: none`. Rejected — WebKit does not interpolate `none`.

## Risks / Trade-offs

- [Home cascade loses to the generic ready rule] → the `/` lock rules include both `is-ready` or `is-leaving` and `:has(.collection-hero-logo)`, so they outrank `html.is-ready .main-wrapper`.
- [One extra frame of hidden content] → that frame is the from-state the rise needs. Reduced motion still sets the transition duration to `0s`.
- [Back/forward restore skips the rise] → the existing `pageshow` path still adds `is-ready` immediately. That stays.
