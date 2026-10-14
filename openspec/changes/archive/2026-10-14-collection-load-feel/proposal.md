## Why

Hero tiles faded in at full size, and `.collection-hero-logo` stayed sharp when `/` left. The tiles should pop in, and the logo should fade out with the gallery.

## What Changes

`bootInfiniteGallery` still mounts the canvas and calls `radPageReady()` without waiting for textures. `html.is-ready` still does not rise the hero. Each unique image still starts invisible. After its file decodes it waits a random time of at most `1200ms`, with no extra wait before that, then fades and scales over `300ms` with ease-out. The three period copies still share that reveal. A stuck file still does not block the rest. Other pages keep their rise and sink.

- Each hero tile scales from `0.98` of its fitted size to full size over that same reveal. Reduced motion still snaps a decoded tile in at full size.
- `.collection-hero-logo` stays visible and still on enter. On leave it fades out with the hero gallery and does not move.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `page-load-transition`: the collection logo fades out with the gallery on leave. It does not fade or move on enter, and the gallery still does not rise.
- `collection-infinite-gallery`: each hero image scales from `0.98` to `1` with its fade. The fade is a random delay of at most `1200ms`, then `300ms` ease-out.

## Impact

- `css/global.css` — `.collection-hero-logo` is on the leave opacity fade. No blur. Reduced motion sets its transition duration to `0s`.
- `js/collection.js` — plane scale follows the reveal. `themeEaseOut` eases that reveal. `REVEAL_MIN_MS` is `0`, `REVEAL_DELAY_MS` is `1200`, `REVEAL_FADE_MS` is `300`.
- No new dependencies. Webflow markup unchanged.
