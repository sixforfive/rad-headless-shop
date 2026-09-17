## Context

See proposal.md for motivation. `/shop` already has one `.product-list:not(.is-merch)` toggled with `.is-gallery` from `js/shop.js`. Thumbs carry CMS column attrs; `hydrateThumbs` copies them to CSS variables. `#gallery-scroll-counter` is already in the footer.

## Goals / Non-Goals

**Goals:**

- Seamless down wrap from cloned thumbs, not a second Webflow collection.
- Loop height from the first original thumb to the first clone, so a partial last row still wraps on the clone’s first row.
- Counter tracks that same original-block height.

**Non-Goals:**

- Upward wrap.
- Duplicating the Products collection in Webflow.
- Merch listing.
- GSAP or a new script file.

## Decisions

### Clone in `shop.js` after `hydrateThumbs`

`cloneNode(true)` each `.product-thumb:not(.is-clone)` on the shop list, add `.is-clone`, `aria-hidden="true"`, `tabindex="-1"` on inner links, append. Inline CSS vars copy with the node. Guard so clone runs once.

Alternative considered: a second Webflow Collection List. Rejected — duplicate CMS items, duplicate ids, extra work to hide in list view.

### Wrap with instant `scrollTo`, down only

Loop height `h` = first `.is-clone` `offsetTop` minus first original `offsetTop`. When `.product-list` has `.is-gallery` and `window.scrollY >= h`, `window.scrollTo(0, window.scrollY - h)` with `behavior: "auto"`. Set `overflow-anchor: none` on `html` around the jump (same trick as `setView`). No prepended clone, so the top stays a hard stop.

Skip wrap when the list is not gallery, when `h <= 0`, or when merch.

Alternative considered: CSS marquee / transform on the grid. Rejected — native window scroll and product links stay as they are.

### Hide clones and counter in CSS

```css
.product-list:not(.is-gallery) .product-thumb.is-clone {
  display: none;
}

body:has(.product-list:not(.is-gallery):not(.is-merch)) #gallery-scroll-counter {
  display: none;
}
```

Clones stay in the DOM so gallery wrap does not rebuild on every view switch. List placement in `shop-grid` is unchanged: hidden clones do not occupy list cells.

### Counter is `scrollY / h`, integer 0–100

Write `String(Math.min(100, Math.max(0, Math.round((window.scrollY / h) * 100))))` into `#gallery-scroll-counter`. After wrap, `scrollY` is below `h`, so the value returns to 0. No `%` suffix (add it in Webflow if needed).

### Remeasure `h` on resize and after `setView`

Grid collapse at 479px and view switch change row heights. Recalc `h` on `resize` and at the end of `setView`. `setView` already jumps to top.

## Risks / Trade-offs

- [Gallery shorter than the viewport] → `max` scroll never reaches `h`; wrap does not fire. Accepted.
- [Footer is in document flow, not chrome] → wrap jumps before the footer; counter must already be on-screen. `#gallery-scroll-counter` is in the footer the visitor added.
- [Duplicate ids on clones] → `aria-hidden` on the clone; links not in tab order.
- [jsDelivr pin] → new SHA for `shop.js` and `global.css`.

## Migration Plan

1. Ship `js/shop.js` and `css/global.css`.
2. Point the Shop footer `shop.js` pin and the site-wide `global.css` pin at the new SHA; publish.
3. Rollback: revert both pins. One collection list stays; clones disappear with the script.

## Open Questions

None.
