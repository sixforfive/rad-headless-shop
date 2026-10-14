## Why

`#back-to-top` already runs for 1.4s, but Lenis’s default expo ease-out spends most of that distance at the start, so the trip feels like a slam. It should settle into the top on a spring.

## What Changes

- A click on `#back-to-top` scrolls to position 0 with `motion.standard.enter`: 700ms settling time, spring(stiffness 210, damping 29, mass 1). The same curve applies to the window and to the nested product gallery when that gallery is the scroller.
- `prefers-reduced-motion: reduce` still jumps there with no animation.
- Wheel, touch, edge damp, shop wrap, and the collection pan are unchanged.
- `motion.standard.exit` (500ms, spring stiffness 452, damping 42.52, mass 1) is not used. This action arrives at the top, so it takes the enter spring.

## Capabilities

### New Capabilities

- `back-to-top`: Programmatic scroll to the top from `#back-to-top`, including duration, spring, and reduced motion.

### Modified Capabilities

- None.

## Impact

- `js/smooth-scroll.js` — `radScrollToTop` owns the enter spring and the 700ms settle. The unused `BACK_TO_TOP_DURATION` of 1.4 goes away.
- `js/global.js` — `scrollToTop` no longer passes `duration: 1.4`. It still requests an immediate jump under reduced motion.
- No new dependencies. Webflow markup unchanged.
