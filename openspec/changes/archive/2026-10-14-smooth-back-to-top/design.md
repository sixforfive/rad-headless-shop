## Context

See proposal.md. `scrollToTop` in `js/global.js` calls `radScrollToTop({ duration: 1.4 })`. `radScrollToTop` in `js/smooth-scroll.js` forwards that to the nested gallery Lenis when it is live, otherwise to the window Lenis. Lenis `scrollTo` then uses its default easing, an expo ease-out. `BACK_TO_TOP_DURATION` is `1.4` and nothing reads it. With reduced motion, or with no Lenis, the jump is immediate or native `smooth`.

## Goals / Non-Goals

**Goals:**

- One enter spring on `radScrollToTop`, shared by the window and the nested gallery.
- Reduced motion stays an immediate jump.

**Non-Goals:**

- `motion.standard.exit`.
- Wheel lerp, edge damp, shop wrap, collection pan.
- A spring library.

## Decisions

### Sample the enter spring as a Lenis easing

Precompute spring(stiffness 210, damping 29, mass 1) from rest at 0 toward 1. Step `x'' = (-210 * (x - 1) - 29 * v) / 1` across 700ms. Divide each sample by the value at 700ms and clamp to `0..1`, so the curve ends at 1. Pass it as Lenis `easing` with `duration: 0.7`.

`radScrollToTop` sets that duration and easing unless `options.immediate` is set. A caller duration cannot replace them.

Without Lenis, `radScrollTo` keeps native `smooth`. The nested gallery exists only when Lenis does.

Alternative considered: a motion library for the spring. Rejected — the three constants are a fixed curve, and Lenis already takes an easing function.

### The click stops passing a duration

`scrollToTop` calls `radScrollToTop({ immediate: true })` under reduced motion, and `radScrollToTop()` otherwise. Delete `BACK_TO_TOP_DURATION`.

## Risks / Trade-offs

- [700ms is shorter than the old 1.4s] → The expo curve spent that extra time crawling. The spring is the requested settle.
- [A coarse spring step drifts off 1] → Normalize by the last sample and clamp.
- [No Lenis means native `smooth`] → That path is the missing-library fallback. Reduced motion stays immediate.

## Migration Plan

1. Edit `js/smooth-scroll.js` and `js/global.js` as in tasks.md.
2. Rollback: restore `duration: 1.4` on the click and drop the easing.
