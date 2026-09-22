## Context

See proposal.md for motivation. `preloadTextures` in `js/collection.js` calls `getTexture` on every light URL and every dark URL at boot. `applyModeTextures` already swaps maps from `body.dark-mode`, and `bindLightsObserver` already calls it when that class changes. `readGallerySrcs` stores `img.currentSrc || img.src`. The hero lists have `is-none`, so `currentSrc` is not a laid-out pick, and the published hero images have a full `src` and no `srcset`. Guessing a `-p-800` sibling URL 403s.

`eagerThumbImages` in `js/shop.js` sets `loading="eager"` on every original shop thumb, then `cloneGalleryList` copies that attribute. The HTML already ships `loading="lazy"`.

## Goals / Non-Goals

**Goals:**

- Boot the canvas with one mode's files.
- Use an 800w `srcset` candidate when the attribute is there.
- Eager-load only the first shop row, and keep the clone.

**Non-Goals:**

- Resizing masters in the browser. The full file would already have been downloaded.
- Inventing CDN variant filenames.
- Removing the cloned list, or changing wrap, seam gap, or counter behavior.
- Changing merch image loading.
- Prefetch, `defer`, or Webflow's injected scripts.

## Decisions

### Preload the active mode only

`preloadTextures` loads `urlForIndex` for each light index, which already returns the dark URL when `body` has `dark-mode` and the light URL otherwise. It does not walk `darkSrcs` on its own. The other mode loads when the observer runs `applyModeTextures`, because `getTexture` fetches on first use and caches.

The head inline script and `applyLights` both run before the collection module, so `body.dark-mode` is already correct at boot.

Alternative considered: prefetch the inactive mode after first paint. Rejected — the toggle is rare, and `getTexture` already fetches it at the click.

### Resolve the display URL from `srcset`, not from the filename

In `readGallerySrcs`, if the image has a `srcset`, parse the width descriptors and keep the candidate nearest 800. Otherwise keep `src`. Ignore `currentSrc`. Do not rewrite `file.avif` into `file-p-800.avif`.

Alternative considered: always request the `-p-800` sibling. Rejected — those URLs 403 for the current hero files.

Until the Designer gives those images a `srcset`, this branch keeps today's `src`. That is the whole size cut, and it is a Designer change, not a code change.

### Eager the first measured row, then clone

After `hydrateThumbs` and before `cloneGalleryList`, read each original thumb's top. Set `loading="eager"` on thumbs whose top is within 0.5px of the minimum top. Leave every other thumb at the HTML `loading="lazy"`. Cloning still copies the attribute, so the seam's first clone row is the same URLs as the first original row.

Gallery and list both go through this, because both are the same list with or without `is-gallery`. Merch stays out because `shopList` already excludes `.is-merch`.

Alternative considered: eager the first N thumbs. Rejected — gallery column spans mean N is not a row.

Alternative considered: eager anything in the viewport. Rejected — the first screen can be more than one row, which is the download this change is cutting.

## Risks / Trade-offs

- [Hero images have no `srcset` today] → The mode split still drops half the files. The 800w pick stays dormant until those images are responsive in the Designer.
- [Thumbs have no height at boot] → If no original thumb has height, skip the eager pass and leave them lazy, instead of marking every thumb eager.
- [Fast scroll reaches a lazy row before it decodes] → The seam itself is the first row's URLs, which are eager. Later rows load as they approach the viewport.
