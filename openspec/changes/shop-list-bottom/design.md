## Context

See proposal.md. `dampVirtualScroll` in `js/smooth-scroll.js` scales `deltaY` in the last 160px of a bound (`EDGE_ZONE`, floor `EDGE_MIN` 0.15). `isShopGallery()` is the `topOnly` flag, so gallery already skips the bottom zone. List view does not, which is the stuck end.

`#gallery-scroll-counter` is hidden in list view by `body:has(.product-list:not(.is-gallery):not(.is-merch))` in `css/global.css`. Hide combos live in the `display: none` list; there is no generic `.is-none`.

## Goals / Non-Goals

**Goals:**

- List view reaches the document end without a slowed last 160px.
- Counter hide is `.is-none` on `#gallery-scroll-counter`, toggled with the view.

**Non-Goals:**

- Changing top-edge damp.
- Changing bottom-edge damp on merch or on pages that are not `/shop`.
- Changing gallery wrap or the 00–99 counter text.
- A Webflow class rename on the counter.

## Decisions

### Widen `isShopGallery` to any Shop list

Match `.product-list:not(.is-merch)`. That node exists in both Shop views, so `topOnly` stays true for gallery and becomes true for list. Merch lists have `.is-merch`, so they still damp the bottom.

Alternative considered: a second predicate only for list view. Rejected — gallery already passes `topOnly`, and one selector covers both Shop views.

### Toggle `.is-none` from the view, not `:has()`

`syncScrollCounter` sets `is-none` when the shop list lacks `is-gallery`. Call it from `applyView` after the class swap, and on boot next to `syncActive`. Add `#gallery-scroll-counter.is-none` to the existing `display: none` combo list and delete the `:has()` rule.

Alternative considered: keep the `:has()` rule and also add the class. Rejected — two hides for one state.

## Risks / Trade-offs

- [List end feels abrupt] → Same stop gallery already uses; top damp stays.
- [Counter visible in list if `shop.js` does not run] → The `:has()` rule is gone. Shop page loads `shop.js`.
- [Boot in gallery leaves `is-none` on] → Boot calls `syncScrollCounter` from the live `is-gallery` class.

## Migration Plan

1. Edit `js/smooth-scroll.js`, `js/shop.js`, and `css/global.css` as in tasks.md.
2. Rollback: restore `isShopGallery` to `.product-list.is-gallery:not(.is-merch)`, drop the counter toggle, and restore the `:has()` hide.
