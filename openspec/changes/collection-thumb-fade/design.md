## Context

See proposal.md. `revealGallery` in `js/collection.js` calls `radPageReady` only after `targetsReady()`, and `css/global.css` keeps `:has(> .collection-hero-logo) > :not(.collection-hero-logo)` at `opacity: 0` until `html.is-ready`. `applyHoverDim` sets `material.opacity = 1` every frame. Each tile is drawn three times, once per period copy, and those copies share `mediaIndex`.

## Goals / Non-Goals

**Goals:**

- Fade each unique image when its file has decoded.
- Random delay up to 0.5s, then a 0.45s fade. Copies share that fade.
- Leave the canvas up so later images can appear.

**Non-Goals:**

- Waiting for the full set.
- Changing the shop, merch, or product rise and sink.
- Fading `.collection-hero-logo`.

## Decisions

### Canvas stays visible

Drop the collection sibling from the initial `opacity: 0` rule and from the `html.is-ready` show rule. Keep `html.is-leaving` fading that sibling out.

`bootInfiniteGallery` calls `radPageReady()` as soon as the canvas is mounted, including when there are no images. Delete the wait inside `revealGallery`.

### Opacity lives on the plane

`makePlaneMesh` starts at `opacity: 0` with `userData.reveal = 0`. The `getTexture` load callback stores `performance.now() + Math.random() * 500` on that URL. `tick` eases `reveal` from 0 to 1 over 0.45s once the texture has decoded and the delay has passed, and writes `material.opacity`.

`applyHoverDim` writes `userData.reveal` instead of `1`. Under `prefers-reduced-motion`, a decoded plane snaps to `1`.

The three copies share a URL, so they share one timestamp and fade together.

## Risks / Trade-offs

- [A file never decodes] → That tile stays invisible. The others still fade. The 2s page fallback in `global.js` is unchanged and does not reveal a missing tile.
- [Hover dim and reveal share opacity] → Dim stays in `userData.dim`. Opacity is only the reveal.

## Migration Plan

1. Ship `js/collection.js` and `css/global.css`.
2. Rollback: revert both files.
