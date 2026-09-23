## Why

`/` holds the hero until every current-mode image has decoded, then fades the whole gallery at once. A slow file blocks every tile. Each image should fade in as soon as its own file is ready.

## What Changes

- On `/`, each unique hero image fades from invisible to opaque when that file has decoded, after a random delay of up to 0.5s. The three period copies of that image fade together.
- The hero canvas is visible while tiles are still arriving. `.collection-hero-logo` stays visible and does not fade with the tiles.
- The page no longer waits for the full set before showing the hero. A file that never decodes does not block the tiles that did.
- Under `prefers-reduced-motion: reduce`, a decoded tile appears immediately.
- Shop, merch, and product keep the `1.25rem` rise and sink.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: each hero image fades in on its own when decoded, in a random order.
- `page-load-transition`: the collection hero is no longer one fade that waits for every texture. The page rise still does not wait on Shopify.

## Impact

- `js/collection.js` — plane opacity, per-URL delay, `applyHoverDim` no longer forces opacity `1`, drop the all-textures `revealGallery` wait.
- `css/global.css` — `.collection-hero-gallery` is not hidden until `html.is-ready`. Leave still fades it out.
- No new dependencies. Webflow markup unchanged.
