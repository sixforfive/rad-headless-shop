## Context

See proposal.md for motivation. `preloadTextures` in `js/collection.js` calls `getTexture` on every light URL and every dark URL at boot. `applyModeTextures` already swaps maps from `body.dark-mode`, and `bindLightsObserver` already calls it when that class changes. `readGallerySrcs` stores `img.currentSrc || img.src`. The hero lists have `is-none`, so `currentSrc` is not a laid-out pick, and the published hero images have a full `src` and no `srcset`. Guessing a `-p-800` sibling URL 403s.

`eagerThumbImages` in `js/shop.js` sets `loading="eager"` on every original shop thumb, then `cloneGalleryList` copies that attribute. The HTML already ships `loading="lazy"`.

## Goals / Non-Goals

**Goals:**

- Boot the canvas with one mode's files.
- Use an 800w `srcset` candidate when the attribute is there.
- A shop loop height that is final at load, with the clone not repeating eager work.

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

### Eager originals, lazy clone

`eagerThumbImages` keeps `loading="eager"` on every original thumb image, and `cloneGalleryList` sets the clone's images back to `lazy` after the copy. The originals are what `loopHeight` measures, so their height has to be final before the visitor can reach the seam. The clone's URLs are the originals' URLs, so nothing is saved by fetching them early.

Attempted and reverted: eager on the first laid-out row only. Rows below the fold then gained height during the scroll, the measured loop height grew behind the visitor, and the wrap threw the page backward at the end of the set.

Merch stays out because `shopList` already excludes `.is-merch`.

### Thumb height cannot answer for the image

`originalsSized` gated the wrap on `height > 1`, which a `.product-thumb` satisfies from its SKU and price text even with no image. That guard was effectively always true. It now also requires every `img` in the thumb to be `complete`, so the wrap waits for real geometry.

`complete` is used rather than `naturalHeight`, because it is also true for an image that failed, which keeps a broken CMS thumbnail from disabling the loop forever. It is read on the elements present rather than a specific class, so the gate does not depend on `.thumb-light` existing.

## Risks / Trade-offs

- [Hero images have no `srcset` today] → The mode split still drops half the files. The 800w pick stays dormant until those images are responsive in the Designer.
- [Eager originals are the same request count as before this change] → The shop saving is the clone, not the originals. Cutting the originals breaks the loop, which is worse than the bytes.
- [A slow original image delays the first wrap] → The gate is per image `complete`, so the loop starts working as soon as the set has arrived, and the page never shifts backward in the meantime.
