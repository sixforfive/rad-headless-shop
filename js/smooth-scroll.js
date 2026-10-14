/**
 * smooth-scroll.js — Lenis window instance, nested default-gallery instance, edge damp.
 * radLenis — window Lenis, or null if the library is missing or reduced-motion
 * radNestedLenis — nested Lenis on .product-gallery-col, or null
 * radScrollTo — scroll the window instance (or native window)
 * buildEnterEase() -> 0..1 easing for the 700ms enter spring
 * radScrollToTop — nested col if live, otherwise window; 700ms enter spring, or immediate
 * radScrollShift — move the window position by a delta, keeping Lenis momentum
 * radOnScroll — run a callback on the Lenis frame, or on a passive window scroll
 * radLenisStop / radLenisStart — drawer lock; both instances
 * radNestedGallerySync — nested on desktop default gallery only; off in fullscreen and ≤767
 * dampVirtualScroll — scale wheel delta in the edge zone; top-only on shop
 * catchListEnd — list view only; arrive at the document limit instead of easing into it
 */

const EDGE_ZONE = 160;
const EDGE_MIN = 0.15;
const ENTER_SETTLE = 0.7;

let radLenis = null;
let radNestedLenis = null;

/** reduceMotion — true when prefers-reduced-motion: reduce */
function reduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** isShopGallery — shop list is on the page (gallery or list); bottom damp stays off */
function isShopGallery() {
  return !!document.querySelector(".product-list:not(.is-merch)");
}

/** isShopListView — shop list is showing; gallery wrap is the other path */
function isShopListView() {
  const list = document.querySelector(".product-list:not(.is-merch)");
  return !!list && !list.classList.contains("is-gallery");
}

/** dampVirtualScroll — shrink deltaY in the edge zone; top-only on shop */
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

/** catchListEnd — list view: a wheel that would park on the limit arrives there now */
function catchListEnd(lenis, data) {
  if (lenis !== radLenis || !isShopListView() || !(data.deltaY > 0)) return false;
  const y = lenis.animatedScroll;
  const limit = lenis.limit;
  if (y >= limit - 0.5) return false;
  if (lenis.targetScroll + data.deltaY < limit) return false;
  if (data.event?.cancelable) data.event.preventDefault();
  lenis.scrollTo(limit, { immediate: true, force: true });
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
      dampVirtualScroll(radLenis, data, isShopGallery());
      return !catchListEnd(radLenis, data);
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

/** buildEnterEase() -> 0..1 easing for the 700ms enter spring */
function buildEnterEase() {
  const steps = 700;
  const dt = ENTER_SETTLE / steps;
  const samples = [0];
  let x = 0;
  let v = 0;
  for (let i = 0; i < steps; i++) {
    const a = -210 * (x - 1) - 29 * v;
    v += a * dt;
    x += v * dt;
    samples.push(x);
  }
  const end = samples[steps];
  return (t) => {
    const u = t <= 0 ? 0 : t >= 1 ? 1 : t;
    const f = u * steps;
    const i = Math.floor(f);
    const frac = f - i;
    const y =
      (samples[i] + (samples[Math.min(steps, i + 1)] - samples[i]) * frac) /
      end;
    return y < 0 ? 0 : y > 1 ? 1 : y;
  };
}

const enterEase = buildEnterEase();

/** radScrollToTop — nested gallery if live, else window; enter spring unless immediate */
function radScrollToTop(options) {
  const motion = options?.immediate
    ? { immediate: true }
    : { duration: ENTER_SETTLE, easing: enterEase };
  if (radNestedLenis) {
    radNestedLenis.scrollTo(0, motion);
    return;
  }
  radScrollTo(0, motion);
}

/** radScrollShift — move both Lenis scroll values by delta so velocity survives */
function radScrollShift(delta) {
  if (radLenis) {
    radLenis.animatedScroll -= delta;
    radLenis.targetScroll -= delta;
    window.scrollTo(0, radLenis.animatedScroll);
    return;
  }
  window.scrollTo(0, window.scrollY - delta);
}

/** radOnScroll — Lenis frame callback when live, else passive window scroll */
function radOnScroll(fn) {
  if (radLenis) {
    radLenis.on("scroll", fn);
    return;
  }
  window.addEventListener("scroll", fn, { passive: true });
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
