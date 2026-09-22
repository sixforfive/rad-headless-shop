## Why

`/` and `/shop` download more image bytes than the first screen uses. The collection canvas fetches every light and every dark hero file at boot, including files far larger than the tiles. The shop grid marks every thumb `loading="eager"`, so the whole set competes with the first row.

## What Changes

- On `/`, request textures for the active lights mode only. Request the other mode when `#lights-switch-btn` toggles.
- When a hero image has a `srcset`, request the candidate nearest 800w. When it does not, keep the `src`.
- On `/shop`, set `loading="eager"` only on original thumbs in the first laid-out row. Leave the rest `loading="lazy"`. Keep the cloned list.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: boot fetches the active mode only, and a plane's texture is a display-sized candidate of the hero image when `srcset` provides one. The inactive mode still swaps in without resetting the view, and it is fetched at the toggle.
- `shop-gallery-loop`: original thumbs in the first row load immediately. Thumbs below that row stay lazy. The clone list stays.

## Impact

- `js/collection.js` — `preloadTextures`, `urlForIndex` / `readGallerySrcs`.
- `js/shop.js` — `eagerThumbImages`, still before the clone.
- Webflow: hero `.hero-gallery-img` nodes currently publish a full `src` and no `srcset`. The 800w pick does nothing until those images are responsive in the Designer. CDN siblings such as `-p-800` are not requested by guessing the filename.
- No new dependencies. Merch, the loop wrap, and the lights toggle contract stay.
