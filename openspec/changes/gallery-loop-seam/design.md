## Context

See proposal.md for motivation. Today `cloneGalleryThumbs` appends per-thumb clones into the same `.product-list` grid, `loopHeight` measures first clone top minus first original top, and `onGalleryScroll` jumps with `radScrollTo(y, { immediate: true })` from a native `scroll` listener.

Two constraints shape the fix. First, thumbs carry explicit `grid-column-start` / `grid-column-end` but no explicit row, and CSS grid sparse auto-placement never rewinds its row cursor — it only advances until the item fits — so a clone whose columns are free on the last original row lands there. Second, Lenis's `scrollTo` `immediate` branch calls `reset()`, which sets `targetScroll = animatedScroll` and `velocity = 0`.

`css/global.css` already drops gallery column placement at ≤479px and list placement at ≤767px, so any row-level scheme has to survive the grid falling back to auto placement.

## Goals / Non-Goals

**Goals:**

- Clone geometry that is a pure translation by construction, not by measurement luck.
- A wrap that leaves Lenis state intact so momentum carries through the seam.
- Wrap correction applied before paint.

**Non-Goals:**

- Upward wrap. The top stays a hard stop.
- A second Webflow Collection List in the Designer.
- Changing the counter contract, merch, or list view behavior.
- Lenis `infinite: true`. It wraps at the document limit, and the document is two loops plus navbar and footer.

## Decisions

### Clone the list container, not each thumb

Replace per-thumb cloning with one `cloneNode(true)` of `.product-list:not(.is-merch)`, class `.is-clone`, inserted as the next sibling. Two sibling grids lay out independently, so the clone block is identical to the original block at every breakpoint including the ≤479px auto-placement fallback. No item can straddle the seam because the seam is a container boundary.

Alternative considered: keep one grid and assign explicit `grid-row-start` to every thumb (originals from measured row bands, clones offset by the row count). Rejected — it has to be recomputed whenever row assignment changes and it has to be torn down at ≤479px where columns go auto, which is exactly where the row bands stop being predictable.

Alternative considered: a zero-height `grid-column: 1 / -1` spacer item before the first clone. Rejected — it forces a fresh row but also consumes an extra `row-gap`, which then has to be cancelled with a negative margin read from computed style. Same fragility, worse seam.

Clone hygiene: `aria-hidden="true"` on the clone list, `tabindex="-1"` on every link inside it, and `removeAttribute("id")` on the clone and all its descendants so the duplicated Webflow collection markup does not collide with the originals.

`eagerThumbImages` moves ahead of cloning so `loading="eager"` copies with the nodes and covers both lists in one pass.

### Correct the seam gap by measurement, not assumption

Two sibling lists are separated by whatever Webflow margin sits between them, which is not necessarily the grid's `row-gap`. Rather than guess, `measureLoopHeight` reads the current visual gap (`cloneList` top minus original list bottom) and the grid's computed `row-gap`, then adjusts the clone list's inline `margin-top` by the difference. Self-correcting, so it holds regardless of what Webflow puts between them, and it re-runs on the existing `resize` and `ResizeObserver` paths.

Loop height then becomes `cloneList.getBoundingClientRect().top - list.getBoundingClientRect().top`, measured after that correction.

### Shift Lenis instead of commanding it

New `radScrollShift(delta)` in `js/smooth-scroll.js`: when `radLenis` is live, subtract `delta` from both `animatedScroll` and `targetScroll` and write the new position with `window.scrollTo`; otherwise `window.scrollTo(0, window.scrollY - delta)`. Moving both values by the same amount leaves `targetScroll - animatedScroll` — the lead that drives the lerp — untouched, so velocity and queued travel survive. `jumpScrollY` stays for `setView`, which genuinely wants a dead stop at the top.

Alternative considered: `radScrollTo(y, { immediate: true })` with extra options. Rejected — every path through `immediate` calls `reset()`; there is no option that preserves velocity.

Alternative considered: Lenis `infinite: true`. Rejected for the reason in Non-Goals.

### Run the wrap check from Lenis's scroll callback

New `radOnScroll(fn)` in `js/smooth-scroll.js`: registers on `radLenis.on("scroll", fn)` when Lenis is live, otherwise a passive `window` `scroll` listener. Lenis fires its callback inside its own rAF, before the frame is painted, so the wrap lands in the same frame instead of one frame late. `shop.js` registers `onGalleryScroll` through it.

### Cache the sized check

`originalsSized` currently calls `getBoundingClientRect()` on every original thumb on every scroll tick, forcing synchronous layout at the exact moment the seam needs headroom. Fold it into `measureLoopHeight` as a cached boolean and read the cache in `onGalleryScroll`.

### CSS: hide the clone list, not clone thumbs

`.product-list:not(.is-gallery) .product-thumb.is-clone { display: none }` is replaced by `.product-list.is-clone:not(.is-gallery) { display: none }`. `setView` already toggles `is-gallery` on every `.product-list:not(.is-merch)`, so the clone list follows the original. The counter rule is unchanged — `body:has(.product-list:not(.is-gallery):not(.is-merch))` still matches.

### Split the hover dim into a merch rule and a shop rule

`.product-list:has(.product-link:hover) .product-link:not(:hover)` is scoped to one list. Once the clone is its own list, hovering an original leaves the clone block undimmed — visible whenever the seam is on screen, which is exactly when the loop is doing its job.

Merch keeps the list-scoped rule. Shop gets `body:has(.product-list:not(.is-merch) .product-link:hover) .product-list:not(.is-merch) .product-link:not(:hover)`, which spans the original and the clone and nothing else.

Alternative considered: one `body:has(.product-list .product-link:hover)` rule for both. Rejected — on a page carrying both listings it would let a shop hover dim merch, which `product-thumb-hover` guarantees against.

## Risks / Trade-offs

- [`shop-gallery-loop` has no main spec yet — `shop-gallery-infinite-scroll` is unarchived] → archive that change before this one so the `MODIFIED` requirement has a base to apply to.
- [Cloned Webflow collection markup duplicates `w-dyn` classes and data attributes] → harmless; ids are stripped and the container is `aria-hidden`.
- [Writing `animatedScroll` / `targetScroll` touches Lenis instance fields] → they are public instance properties in Lenis 1.x and the standard approach for infinite scroll; a version bump is the thing to retest.
- [Margin correction runs one measure-then-write pass on resize] → only on `resize` and `ResizeObserver`, not per scroll tick.
- [Gallery shorter than the viewport] → scroll never reaches the loop height and the wrap does not fire. Unchanged, accepted.

## Migration Plan

1. Ship `js/shop.js`, `js/smooth-scroll.js`, and `css/global.css`.
2. Rollback: revert the three files. The old per-thumb clone loop returns with its seam.
