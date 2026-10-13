## Why

On `/`, `.collection-hero-logo` is sharp on first paint and still sharp when the page leaves. The hero tiles fade in at full size. The logo should blur in and out, and each tile should start slightly small so the existing fade reads as a pop.

## What Changes

The current `/` sequence stays. `bootInfiniteGallery` still mounts the canvas and calls `radPageReady()` without waiting for textures. `html.is-ready` still does not rise the hero. Each unique image still starts invisible, waits out its existing random delay after decode, then fades over the existing reveal. The three period copies still share that fade. A stuck file still does not block the rest. On leave, the gallery sibling still fades out. Other pages keep their rise and sink.

- `.collection-hero-logo` starts blurred, sharpens when the page is ready, and blurs again on leave. It still does not fade or move.
- Each hero tile scales from `0.98` of its fitted size to full size over the same reveal as its fade. Reduced motion still snaps a decoded tile in at full size, and the logo stays sharp.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `page-load-transition`: the collection logo blurs in on ready and blurs out on leave. It still does not fade or move, and the gallery still does not rise.
- `collection-infinite-gallery`: each hero image scales from `0.98` to `1` with its existing fade.

## Impact

- `css/global.css` — `filter` on `.collection-hero-logo` for ready and leaving. Reduced motion skips it.
- `js/collection.js` — plane scale follows the existing reveal. Reveal timing stays.
- No new dependencies. Webflow markup unchanged.
