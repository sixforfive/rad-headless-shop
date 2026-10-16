## 1. Per-plane reveal

- [x] 1.1 In `advanceReveal` in `js/collection.js`, drop `revealAt`, `revealElapsed`, `revealStepped`, and the four-wave wait
- [x] 1.2 When a plane's texture is on the GPU and `userData.revealWait` is unset, set it to `Math.random() * REVEAL_DELAY_MS`. Count that wait and `userData.revealElapsed` on that mesh only, capped at `16ms` per frame, eased with `themeEaseOut` over `REVEAL_FADE_MS`, scale `0.98 + 0.02 * reveal`
- [x] 1.3 When `prefers-reduced-motion: reduce` is set, snap that plane to reveal `1` at its fitted size with no wait

## 2. Hold while the drawer is shown

- [x] 2.1 In `js/collection.js`, add `galleryFrozen()`: true when `.drawer-wrapper.style.display === "grid"`
- [x] 2.2 While frozen, `tick` updates `lastTick`, sets `velocity` and `targetVel` to `0`, and does not integrate pan, drift, reveal, hover dim, or the theme mix, and does not render
- [x] 2.3 On the first unfrozen frame, add the frozen gap onto `modeFade.start` when a mix is in progress
