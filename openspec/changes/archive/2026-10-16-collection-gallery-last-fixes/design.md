## Context

See proposal.md. On `/`, `tick` in `js/collection.js` integrates pan, coast, size lag, and cursor drift every frame, then `advanceReveal` fades planes. `revealAt` and `revealElapsed` are keyed by image URL, and `revealStepped` advances that clock once per frame, so every period copy of an image (`PERIOD_OFFSETS`, nine meshes per tile) shares one wave.

`openDrawer` in `js/global.js` sets `.drawer-wrapper` inline `display` to `grid`. `fadeDrawerOut` drops `is-visible` at the start of the close, and `hideDrawerOverlay` sets `display` back to `none` only after the `0.9s` blur ends. The lights control is `is-none` for that whole overlay.

## Goals / Non-Goals

**Goals:**

- Hold the mosaic for as long as `.drawer-wrapper` is `display: grid`.
- Give each plane its own reveal wait, counted in frame time.

**Non-Goals:**

- Shop or merch galleries.
- Drawer blur, chrome, or close timing.
- The `300ms` fade, the `0.98` scale, or the logo fade.
- Keeping a wrap seam at one opacity during the reveal.

## Decisions

### Overlay shown means inline `display: grid`

`galleryFrozen()` is true when `.drawer-wrapper.style.display === "grid"`. That covers the menu, the cart, the reverse, and the close blur. `is-visible` is the wrong signal: it drops when the blur-out starts, while the overlay is still on screen.

Watching the wrapper from `collection.js` leaves `global.js` alone. A custom event would couple the two files for a flag the inline style already is.

### `tick` skips motion and keeps the loop

While frozen, `tick` still runs so the next frame can see `display` go back to `none`. It does not integrate `basePos`, velocity, drift, reveal, hover dim, or the theme mix, and it does not render. The canvas keeps the last frame. `lastTick` still updates, so the resume frame is one frame, not the whole time the drawer was open.

On the way into the freeze, `velocity` and `targetVel` are set to `0` and stay `0` on each frozen frame. Wheel and pointer handlers can still write `targetVel` if an event reaches the canvas; zeroing it each frozen frame drops that. Drift is left where it is, so the frame does not jump. After the overlay hides, drift may ease toward the pointer again. Coast does not resume.

Skipping `advanceModeFade` holds a lights mix that was already running. On the first unfrozen frame, add the frozen gap onto `modeFade.start` so that `450ms` fade does not finish in one step. The lights control cannot start a new swap while the overlay is up.

### Each mesh counts its own wait

`advanceReveal` stores `revealWait` and `revealElapsed` on `mesh.userData`. The wait is set once, when that plane's texture is on the GPU: `Math.random() * REVEAL_DELAY_MS`. It counts down by at most `16ms` of frame time. The URL maps and the four-wave bucket go away. A freeze that skips `advanceReveal` leaves the remaining wait untouched, so a wall-clock deadline cannot expire under the drawer.

The nine offset meshes of one tile are separate planes, so they draw separate waits. Two tiles that share an image do too.

## Risks / Trade-offs

- [A tile on the period edge can show two opacities while its copies fade] → Accepted. The copies are what should arrive apart. After every plane reaches opacity `1`, the wrap matches again.
- [Freeze depends on the inline `display` `openDrawer` and `hideDrawerOverlay` already set] → Do not add a second open flag. If that display contract changes, this hold changes with it.

## Migration Plan

1. Ship `js/collection.js`.
2. Rollback: revert that file.
