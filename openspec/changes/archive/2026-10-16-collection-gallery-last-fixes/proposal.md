## Why

The collection mosaic keeps panning and drifting under the open drawer, and the blur shows that motion. Copies of one thumb also fade in together, so the reveal reads as a repeated stamp instead of separate arrivals.

## What Changes

- While the menu or cart overlay is on screen, including the close blur, the collection mosaic holds its last frame. Pan, coast, size lag, cursor drift, and the thumb reveal do not advance. When the overlay is gone, pan stays where it froze and the reveal continues from that progress.
- Each placed plane draws its own wait, including the period copies of one image. Those copies no longer share a wave or a fade.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: the mosaic freezes for the whole drawer overlay, and each plane reveal is an independent random wait.

## Impact

- `js/collection.js` — `tick` holds motion while `.drawer-wrapper` is shown, and `advanceReveal` clocks each plane on its own.
- No CSS, no new dependencies, Webflow markup unchanged.
