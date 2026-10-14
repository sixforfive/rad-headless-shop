## Context

See proposal.md. On `/`, `.collection-hero-logo` is outside the page rise. `html.is-leaving` fades the gallery sibling and the logo to opacity `0` over `0.3s`. The logo does not translate. `radLeaveTo` waits `PAGE_LEAVE_MS` (450) plus `PAGE_HOLD_MS` (350) before navigation, and skips that wait when reduced motion is set.

`advanceReveal` starts each decoded plane after `REVEAL_MIN_MS` (0) plus a random `0..REVEAL_DELAY_MS` (1200), then eases `userData.reveal` with `themeEaseOut` over `REVEAL_FADE_MS` (300). `fitPlaneScale` writes the fitted size. Scale is that size times `0.98 + 0.02 * reveal`.

## Goals / Non-Goals

**Goals:**

- Fade `.collection-hero-logo` out with the gallery on `html.is-leaving`. Do not move it, and do not fade it on enter.
- Scale each plane from `0.98` of the fitted size to the fitted size on the same `userData.reveal` as the fade.

**Non-Goals:**

- Blurring the logo.
- Rising the hero gallery.
- Scaling shop or merch thumbs.
- Re-running the pop on a lights crossfade.

## Decisions

### Logo fades with the gallery

`.collection-hero-logo` is on the same `opacity 0.3s ease-out` transition as the gallery sibling. `html.is-leaving .collection-hero-logo` sets `opacity: 0`. No `transform`. Enter rules do not hide the logo.

Inside the existing `prefers-reduced-motion` block, `.collection-hero-logo` gets `transition-duration: 0s`, because that class outranks `body *`.

### Scale is a multiplier after the fit

`fitPlaneScale` still sets the fitted `x` and `y`. `advanceReveal` then multiplies those two by `0.98 + 0.02 * reveal`. `themeEaseOut` eases `reveal` over `300ms`. While `reveal` is `0` the plane is invisible and already at `0.98`. At `reveal` `1` the multiplier is `1`.

Under `prefers-reduced-motion: reduce`, the multiplier is `1`.

## Risks / Trade-offs

- [`fitPlaneScale` runs every reveal frame] → The multiplier is applied after that call, or the pop is wiped.
- [Leave and the reveal use different durations] → Gallery and logo opacity are `0.3s`. The tile fade is `300ms`. Both finish inside the `800ms` before navigation.

## Migration Plan

1. Ship `css/global.css` and `js/collection.js`.
2. Rollback: revert both files.
