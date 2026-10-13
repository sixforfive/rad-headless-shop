## Context

See proposal.md. `bindLightsObserver` in `js/collection.js` watches the `class` attribute of `html` and `body` and calls `applyModeTextures(false)` on every mutation. `applyLabel` in `js/global.js` runs each frame, removes `is-dot-cursor` from `html`, reads `getComputedStyle(el).cursor` under the point, then toggles the class back. The remove and re-add is deliberate: `html.is-dot-cursor *` sets `cursor: none`, so the class has to be off to read the real cursor. A `MutationObserver` queues a record for each remove and add even when the net value is unchanged, so the callback fires each frame the dot is showing.

`startCrossfade` sets `modeFade.start` to `performance.now()` on each call. The callback runs in a microtask after the global.js frame callback, so `start` is later than the frame timestamp `advanceModeFade` receives, `t` clamps to 0, and the mix stays at its starting value. The lights switch is a pointer-cursor element, so the pointer is on it exactly when the visitor toggles.

## Goals / Non-Goals

**Goals:**

- The swap starts once per lights change and runs to the end with the pointer anywhere.

**Non-Goals:**

- Changing the dot cursor or `applyLabel`.
- Changing `startCrossfade`, `advanceModeFade`, fade timing, or texture loading.
- Product and shop pages. Their thumbs swap in CSS on `.dark-mode` and do not use this observer.

## Decisions

### Compare dark state inside the observer callback

`bindLightsObserver` keeps `lastDark`, initialised from `isDarkMode()`. The callback reads `isDarkMode()`, returns when it equals `lastDark`, otherwise stores it and runs the existing `modeToggle = true; applyModeTextures(false)`. The observers and their `attributeFilter` stay.

Alternative considered: stop `applyLabel` from touching `html` classes. Rejected — the remove is what lets it read the underlying cursor, and any other class writer on `html` or `body` (`is-leaving`, `is-ready`, `is-scroll-locked`, `is-full-screen`) would hit the same bug.

Alternative considered: observe only `body`. Rejected — `body` also gets `is-scroll-locked` when the drawer opens, so the callback still fires on unrelated changes.

## Risks / Trade-offs

- [`html` and `body` carry `dark-mode` in step, but only `body` is read] → `isDarkMode()` already reads `body`, which is the contract in the lights-switch spec.
