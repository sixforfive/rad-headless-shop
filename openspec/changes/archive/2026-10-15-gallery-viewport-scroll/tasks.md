## 1. Viewport wheel

- [x] 1.1 In `createNested` in `js/smooth-scroll.js`, set the nested Lenis `eventsTarget` to `window`. Leave the scrollport on `.product-gallery-col` and keep `dampVirtualScroll` on that instance
- [x] 1.2 In `createWindowLenis`, return `false` from `virtualScroll` while `radNestedLenis` is set, before edge damp

## 2. Check

- [x] 2.1 On `/product/{slug}` and `/merch/{slug}` wider than 767px, with the fullscreen gallery closed, a wheel outside `.product-gallery-col` scrolls the default gallery, and a wheel over it still does
- [x] 2.2 Fullscreen, a 767px viewport, an open menu or cart list, and shop or collection scroll stay as they are
