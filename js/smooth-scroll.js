/**
 * smooth-scroll.js — Lenis window instance, nested default-gallery instance, edge damp.
 * radLenis — window Lenis, or null if the library is missing or reduced-motion
 * radNestedLenis — nested Lenis on .product-gallery-col, or null
 * radScrollTo — scroll the window instance (or native window)
 * radScrollToTop — nested col if live, otherwise window; slower duration
 * radLenisStop / radLenisStart — drawer lock; both instances
 * radNestedGallerySync — nested on desktop default gallery only; off in fullscreen and ≤767
 * dampVirtualScroll — scale wheel delta in the last 160px of a real bound
 * radGalleryPan — shop gallery; consume wheel, do not move the window
 */

const EDGE_ZONE = 160;
const EDGE_MIN = 0.15;
const BACK_TO_TOP_DURATION = 1.4;

let radLenis = null;
let radNestedLenis = null;

/** reduceMotion — true when prefers-reduced-motion: reduce */
function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** isShopGallery — shop grid is in looping gallery view */
function isShopGallery() {
  return !!document.querySelector(".product-list.is-gallery:not(.is-merch)");
}

/** dampVirtualScroll — shrink deltaY in the edge zone; top-only on shop gallery */
function dampVirtualScroll(lenis, data, topOnly) {
  if (!lenis || reduceMotion() || !data.deltaY) return true;
  const y = lenis.animatedScroll;
  const limit = lenis.limit;
  if (data.deltaY < 0 && y < EDGE_ZONE) {
    data.deltaY *= Math.max(EDGE_MIN, y / EDGE_ZONE);
  } else if (!topOnly && data.deltaY > 0 && limit - y < EDGE_ZONE) {
    data.deltaY *= Math.max(EDGE_MIN, (limit - y) / EDGE_ZONE);
  }
  return true;
}

/** createWindowLenis — one document Lenis; skip without Lenis or when reduced-motion */
function createWindowLenis() {
  if (typeof Lenis !== "function" || reduceMotion()) return null;
  return new Lenis({
    autoRaf: true,
    syncTouch: false,
    overscroll: false,
    virtualScroll: (data) => {
      if (isShopGallery() && typeof radGalleryPan === "function") {
        radGalleryPan(data.deltaY);
        return false;
      }
      return dampVirtualScroll(radLenis, data, false);
    },
  });
}

radLenis = createWindowLenis();

/** radScrollTo — window Lenis if live, else native scrollTo */
function radScrollTo(target, options) {
  if (radLenis) {
    radLenis.scrollTo(target, options);
    return;
  }
  const y = typeof target === "number" ? target : 0;
  window.scrollTo({
    top: y,
    behavior: options?.immediate ? "auto" : "smooth",
  });
}

/** radScrollToTop — nested default gallery if live, else window */
function radScrollToTop(options) {
  if (radNestedLenis) {
    radNestedLenis.scrollTo(0, options);
    return;
  }
  radScrollTo(0, options);
}

/** radLenisStop — freeze window and nested while a drawer is open */
function radLenisStop() {
  radLenis?.stop();
  radNestedLenis?.stop();
}

/** radLenisStart — resume after the drawer overlay is gone */
function radLenisStart() {
  radLenis?.start();
  radNestedLenis?.start();
}

/** destroyNested — drop nested Lenis and data-lenis-prevent */
function destroyNested() {
  if (!radNestedLenis) return;
  const wrapper = radNestedLenis.options.wrapper;
  radNestedLenis.destroy();
  radNestedLenis = null;
  if (wrapper instanceof HTMLElement) {
    wrapper.removeAttribute("data-lenis-prevent");
  }
}

/** createNested — Lenis on .product-gallery-col; prevent window steal */
function createNested(col) {
  if (radNestedLenis || typeof Lenis !== "function" || reduceMotion()) return;
  col.setAttribute("data-lenis-prevent", "");
  let nested;
  nested = new Lenis({
    wrapper: col,
    content: col,
    autoRaf: true,
    syncTouch: false,
    overscroll: false,
    virtualScroll: (data) => dampVirtualScroll(nested, data, false),
  });
  radNestedLenis = nested;
  if (document.body.classList.contains("is-scroll-locked")) nested.stop();
}

/** radNestedGallerySync — nested only for desktop default gallery, not fullscreen, not ≤767 */
function radNestedGallerySync() {
  const col = document.querySelector(".product-gallery-col");
  const fullScreen = document.documentElement.classList.contains("is-full-screen");
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  if (!col || fullScreen || mobile) {
    destroyNested();
    return;
  }
  createNested(col);
}
