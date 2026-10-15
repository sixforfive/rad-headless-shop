## Context

See proposal.md. `createNested` in `js/smooth-scroll.js` builds a Lenis on `.product-gallery-col` and sets `data-lenis-prevent` so the window instance does not steal a wheel that starts inside the column. Lenis listens on its wrapper, so a wheel that starts outside the column hits the window instance only. `radNestedGallerySync` creates that instance only when the column exists, the viewport is wider than 767px, and `html` is not `is-full-screen`. Reduced motion never creates it. `radLenisStop` stops both instances while a drawer is open.

## Goals / Non-Goals

**Goals:**

- One nested instance still owns the desktop default gallery, and it hears wheels that start anywhere in the viewport.
- The window instance does not scroll on that same wheel.

**Non-Goals:**

- Fullscreen, 767px and narrower, reduced motion, drawer lists, edge damp, shop wrap, collection pan.

## Decisions

### Listen on the window, and refuse the wheel on the document instance

`createNested` sets `eventsTarget: window`. The scrollport stays `.product-gallery-col`. `createWindowLenis` `virtualScroll` returns `false` while `radNestedLenis` is set, before edge damp. Returning `false` skips the window scroll and its `preventDefault`. The nested listener, registered after the window one, then `preventDefault`s and scrolls the column. Nested `virtualScroll` still calls `dampVirtualScroll`.

`radNestedGallerySync` already destroys the nested instance in fullscreen and at 767px and narrower, so the window instance takes wheels again. Reduced motion never sets `radNestedLenis`.

Lenis still walks `event.target` for `data-lenis-prevent`. An open drawer has that attribute and both instances are stopped, so the list scrolls natively and a wheel outside it does not move the gallery.

Alternative considered: a separate `window` `wheel` listener that writes `scrollTop`. Rejected — it would fight the nested Lenis lerp.

Alternative considered: `data-lenis-prevent` on `body`. Rejected — it would also block drawers and every other page that shares `smooth-scroll.js`.

## Risks / Trade-offs

- [Window `virtualScroll` returns before `preventDefault`] → The nested listener still cancels the native wheel. It is created after the window instance, so it runs second.
- [A wheel over the column moves it twice] → The window callback returns `false` whenever the nested instance exists, including when the pointer is over the column. Only the nested instance scrolls.
- [`eventsTarget` missing on an older Lenis] → The live pin is Lenis 1.x (`animatedScroll` / `targetScroll`). `eventsTarget` is a 1.x option. If it were ignored, the gallery would keep today's hover-only behavior.

## Migration Plan

1. Edit `createNested` and the window `virtualScroll` in `js/smooth-scroll.js`.
2. Rollback: drop `eventsTarget` and the early `false` return.
