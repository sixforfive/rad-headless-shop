## Context

See proposal.md for motivation. `initCursorLabel` in `js/global.js` hit-tests only on `pointermove` via `event.target.closest("[custom-cursor]")`. The label is `pointer-events: none`. Lenis and nested galleries scroll without moving the pointer. `#full-screen-open` / `#full-screen-close` swap under a still pointer in `product.js`.

## Goals / Non-Goals

**Goals:**

- One apply path for move, scroll, and DOM/attribute swap under a still pointer.
- Hit-test the document at the last pointer hotspot, not `event.target`.

**Non-Goals:**

- Changing fade, lerp, or coarse-pointer skip.
- Touching `js/product.js` or Webflow markup.
- MutationObserver.

## Decisions

### `elementFromPoint` at last clientX/Y, not `event.target`

Store the last pointer `clientX`/`clientY`. Apply via `document.elementFromPoint` then `closest("[custom-cursor]")`. Empty attribute is still a miss. The label does not capture hits. Do not hit-test until the first `pointermove` (avoid `(0, 0)`).

Alternative considered: keep `event.target`. Rejected — after scroll or a swapped control, `event.target` is the last move's node.

### Same apply on `pointermove`, capture `scroll`, and the existing rAF `tick`

`pointermove` updates position + apply. Capture-phase `scroll` on `document` covers window, Lenis, and nested overflow. Each `tick` applies again so Open/Close after click updates on the next frame without `product.js`.

Alternative considered: MutationObserver on `custom-cursor`. Rejected — misses class/`is-none` swaps; rAF already runs.

Alternative considered: a hook from `setFullScreenGallery`. Rejected — gallery is one of many still-pointer swaps; the label owns the refresh.

## Risks / Trade-offs

- [Hit-test before first move] → Guard with a has-pointer flag.
- [`elementFromPoint` every frame] → Cheap; one node, fine pointers only.
- [jsDelivr cache] → New SHA in the Footer `js/global.js` tag after commit; do not rely on `@main`.

## Migration Plan

1. Change `initCursorLabel` in `js/global.js`.
2. Point the Footer `js/global.js` tag at the new commit SHA and publish Webflow.
3. Rollback: revert the SHA.
