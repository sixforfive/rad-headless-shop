## Context

See proposal.md for motivation. `preloadTextures` in `js/collection.js` called `getTexture` on every light URL and every dark URL at boot. `applyModeTextures` already swaps maps from `body.dark-mode`, and `bindLightsObserver` already calls it when that class changes. `readGallerySrcs` stored `img.currentSrc || img.src`. The hero lists have `is-none`, so `currentSrc` is not a laid-out pick, and the published hero images have a full `src` and no `srcset`. Guessing a `-p-800` sibling URL 403s.

## Goals / Non-Goals

**Goals:**

- Boot the canvas with one mode's files.
- Use an 800w `srcset` candidate when the attribute is there.

**Non-Goals:**

- Resizing masters in the browser. The full file would already have been downloaded.
- Inventing CDN variant filenames.
- Anything on `/shop`. Thumb loading and the gallery loop are untouched.
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

### `/shop` thumb loading is left alone

Cutting the shop grid down to a first eager row was tried and reverted. Rows below the fold gained height as the visitor scrolled, so the loop height measured by `loopHeight` grew behind them and the wrap threw the page backward at the end of the set. Guarding the wrap on decoded image height did not settle it either. `js/shop.js` is back to the `a8dc990` state: every original thumb image eager, and the clone copying that.

## Risks / Trade-offs

- [Hero images have no `srcset` today] → The mode split still drops half the files. The 800w pick stays dormant until those images are responsive in the Designer.
- [A lights toggle now costs a fetch] → First toggle pulls that mode's files, then they are cached for the rest of the visit.
