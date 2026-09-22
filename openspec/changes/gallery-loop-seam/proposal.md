## Why

The `/shop` gallery loop already wraps, but the wrap is visible: the first row rearranges and the scroll stalls, which reads as a page reload. `shop-gallery-loop` already requires "no visible jump", so the loop does not meet its own spec.

Two defects cause it. Clones are appended into the same grid, so CSS grid sparse auto-placement backfills the first clone into the last partially-filled original row — the clone block is not a translated copy of the original block, and no single wrap distance can line it up. Separately, `radScrollTo(y, { immediate: true })` makes Lenis zero `velocity` and collapse `targetScroll` onto `animatedScroll`, so the visitor's momentum is destroyed on every lap.

## What Changes

- Clone the whole `.product-list` container once instead of cloning each `.product-thumb`, so the clone block lays out in its own grid and is a pure translation of the original block at every breakpoint.
- Offset the clone list so the gap at the seam equals the grid's own row gap, measured and corrected rather than assumed.
- Wrap by shifting Lenis `animatedScroll` and `targetScroll` by the same delta instead of commanding an immediate `scrollTo`, so velocity and queued travel survive the seam.
- Run the wrap check from the Lenis scroll callback when Lenis is live, so the correction lands before paint instead of one frame late.
- Strip `id` attributes from the cloned subtree and mark the clone list `aria-hidden`.
- Cache the "originals have layout height" check instead of measuring every thumb on every scroll tick.
- Widen the sibling hover dim so it spans the original list and its clone. They are one visual set, and at the seam both are on screen at once.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shop-gallery-loop`: adds a requirement that the cloned block is a pure translation of the original block, and a requirement that scroll momentum is preserved across the wrap. Clone identity moves from per-thumb to per-list.
- `product-thumb-hover`: the dim scope grows from one `.product-list` to a shop list plus its clone. Merch stays list-scoped.

## Impact

- `js/shop.js` — `cloneGalleryThumbs`, `eagerThumbImages`, `originalsSized`, `loopHeight`, `measureLoopHeight`, `jumpScrollY`, `onGalleryScroll`, boot order and listeners.
- `js/smooth-scroll.js` — new `radScrollShift` and `radOnScroll`.
- `css/global.css` — clone hide selector moves from `.product-thumb.is-clone` to `.product-list.is-clone`; the sibling hover dim splits into a merch rule and a shop rule.
- Webflow: unchanged. Still one Products collection list in the Designer.
- No new dependencies. Merch, list view, and the footer counter contract are unchanged.
