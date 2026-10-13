## Context

See proposal.md. On `/`, `.collection-hero-logo` is outside the page rise and sink. `html.is-leaving` fades the gallery sibling to opacity `0` over `0.3s`. `radLeaveTo` waits `PAGE_LEAVE_MS` (450) plus `PAGE_HOLD_MS` (350) before navigation. `html.is-ready` is added one frame after `bootInfiniteGallery` calls `radPageReady()`.

`advanceReveal` fades each decoded plane after `REVEAL_MIN_MS` (250) plus a random `0..REVEAL_DELAY_MS` (1200), over `REVEAL_FADE_MS` (600). `fitPlaneScale` writes the fitted size as soon as the texture has dimensions. `applyHoverDim` writes `material.opacity` from `userData.reveal`. Those reveal constants stay.

## Goals / Non-Goals

**Goals:**

- Blur `.collection-hero-logo` until `html.is-ready`, then clear it. Blur it again on `html.is-leaving`.
- Scale each plane from `0.98` of the fitted size to the fitted size on the same `userData.reveal` as the fade.

**Non-Goals:**

- Changing `REVEAL_MIN_MS`, `REVEAL_DELAY_MS`, or `REVEAL_FADE_MS`.
- Fading or translating the logo.
- Rising the hero gallery.
- Scaling shop or merch thumbs.
- Re-running the pop on a lights crossfade.

## Decisions

### Logo uses `filter`, not opacity

`.collection-hero-logo` starts at `filter: blur(8px)` and transitions `filter` over `0.45s ease-out`. `html.is-ready .collection-hero-logo` sets `blur(0px)`. `html.is-leaving .collection-hero-logo` sets `blur(8px)` and comes after the ready rule, because `is-ready` stays on during the leave. Opacity stays `1`. No `transform`.

`8px` is enough to read as blur on the wordmark. The drawer’s `32px` backdrop blur would smear it. `0.45s` matches `PAGE_LEAVE_MS`, so the blur finishes as the leave timer ends and the hold shows the blurred logo.

Alternative considered: fade the logo with the gallery. The logo would disappear instead of softening in place.

### Scale is a multiplier after the fit

`fitPlaneScale` still sets the fitted `x` and `y`. `advanceReveal` then multiplies those two by `0.98 + 0.02 * reveal` on the same frame, after the fit. While `reveal` is `0` the plane is invisible and already at `0.98`. At `reveal` `1` the multiplier is `1` and stays there, including across a later lights crossfade.

Under `prefers-reduced-motion: reduce`, the multiplier is `1`. The existing snap to opacity `1` is unchanged.

The three copies share `userData.reveal` for one URL, so they scale together.

### Reduced motion kills the logo blur

Inside the existing `prefers-reduced-motion` block, `.collection-hero-logo`, `html.is-ready .collection-hero-logo`, and `html.is-leaving .collection-hero-logo` get `filter: none`. The ready and leaving selectors are required because they outrank a bare `.collection-hero-logo`.

## Risks / Trade-offs

- [First paint is a blurred logo] → It sharpens on `html.is-ready`, which collection sets as soon as the canvas mounts.
- [`fitPlaneScale` runs every reveal frame] → The multiplier is applied after that call, or the pop is wiped.
- [Leave blur and gallery fade differ] → Gallery opacity is `0.3s`. Logo blur is `0.45s`. Both finish inside the `800ms` before navigation.

## Migration Plan

1. Ship `css/global.css` and `js/collection.js`.
2. Rollback: revert both files.
