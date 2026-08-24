## Context

See proposal.md for motivation. Shipped product page is [`js/product.js`](../../../js/product.js) and [`css/global.css`](../../../css/global.css). Split is `max-width: 767px`, already used by `isMobileViewport`.

Webflow at ≤767: `.product-gallery-collection.is-default .product-gallery-list` is `flex-flow: row; overflow: scroll`; each `.product-gallery-item` is `flex: none; width: 100%`. `.pagination-bar` sits in `.product-gallery-col` as a sibling of that collection, with one `.pagination-item.is-choosen` template. `.product-gallery-list.is-full` is `flex-flow: column` and is out of scope.

## Goals / Non-Goals

**Goals:**

- Snap only on `.product-gallery-collection.is-default .product-gallery-list` at ≤767px.
- Clone ticks from the one Designer node; `is-choosen` spelling stays as published.
- Hide with combo `is-none` on `.pagination-bar`, same pattern as other chrome.

**Non-Goals:**

- Full-screen gallery snap or ticks.
- Merch template.
- Click-to-scroll on ticks.
- GSAP or a slider library.
- Renaming `is-choosen`.
- Changing Webflow overflow / flex on the list.

## Decisions

### CSS `scroll-snap` on the default list, not JS drag

At `max-width: 767px`, set `scroll-snap-type: x mandatory` and `scroll-snap-stop: always` on `.product-gallery-collection.is-default .product-gallery-list`, and `scroll-snap-align: start` on its `.product-gallery-item` children. The list already scrolls; snap is the missing piece. iOS rubber-band stays native.

Do not put snap on `.product-gallery-list` unscoped — that would hit `.is-full`.

Alternative considered: GSAP Draggable — new dependency, fights native overflow. `proximity` snap — can rest between images. No `scroll-snap-stop` — a fast flick can skip slides; `always` matches “next image into position.”

### Clone the template item, then sync `is-choosen` from scroll

Count `.product-gallery-item` inside `.product-gallery-collection.is-default`. If count < 2, add `is-none` on `.pagination-bar` and stop. If count ≥ 2, remove `is-none`, clone the existing `.pagination-item` until the bar has `count` ticks (or remove extras if any remain), then keep exactly one `is-choosen`.

Active index: `Math.round(list.scrollLeft / list.clientWidth)` on `scroll` (and once on load). Apply `is-choosen` to `ticks[index]` only. First image is index 0 on load (`scrollLeft` is 0).

Rebuild on load only. Image count is CMS-static for the page.

Alternative considered: IntersectionObserver per slide — more code for the same 100%-width slides. Generating ticks from scratch instead of clone — would drop Webflow combos on the node. Leaving three static ticks — fails variable `image-gallery` length.

### `is-none` on the bar, added to the existing hide list

Add `.pagination-bar.is-none` next to `.product-gallery-collection.is-none` in `css/global.css`. Do not invent a second hide class. Webflow already `display: none`s the bar above 767px; `is-none` is for 0–1 images at every viewport.

## Risks / Trade-offs

- [`.product-gallery-col` also `overflow: scroll`] → Snap must live on the list, which is the bounded row scroller. If gestures attach to the column instead, constrain width on the list in `global.css` rather than changing Webflow.
- [Gap on the list from desktop `grid-column-gap`] → `width: 100%` items still snap to start; a sliver of gap is acceptable. Do not zero the gap unless snap misses.
- [jsDelivr CSS/JS cache] → New SHA in the product-page tags after commit; do not rely on `@main`.
- [Ticks not clickable] → Accepted; scroll is the only input.

## Migration Plan

1. Add snap CSS in `css/global.css` and `.pagination-bar.is-none` to the hide list.
2. Add tick clone + `is-choosen` sync in `js/product.js`.
3. Pin the product-page `<link>` / `<script>` to the new commit SHA and publish Webflow.
4. Rollback: revert CSS and JS; the list free-scrolls again and the bar shows the single template tick. Markup stays.
