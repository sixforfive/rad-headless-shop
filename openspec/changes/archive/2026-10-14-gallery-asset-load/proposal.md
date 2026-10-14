## Why

`/` downloads more image bytes than the first screen uses. The collection canvas fetches every light and every dark hero file at boot, including files far larger than the tiles it draws them on.

## What Changes

- On `/`, request textures for the active lights mode only. Request the other mode when `#lights-switch-btn` toggles.
- When a hero image has a `srcset`, request the candidate nearest 800w. When it does not, keep the `src`.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: boot fetches the active mode only, and a plane's texture is a display-sized candidate of the hero image when `srcset` provides one. The inactive mode still swaps in without resetting the view, and it is fetched at the toggle.

## Impact

- `js/collection.js` — `preloadTextures`, `readGallerySrcs`.
- Webflow: hero `.hero-gallery-img` nodes currently publish a full `src` and no `srcset`. The 800w pick does nothing until those images are responsive in the Designer. CDN siblings such as `-p-800` are not requested by guessing the filename.
- `/shop` is out of scope. Thumb loading and the gallery loop stay as they are.
- No new dependencies. The lights toggle contract stays.
