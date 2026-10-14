/**
 * product.js — Product and merch detail (/product/{slug}, /merch/{slug}).
 * isMobileViewport — true at max-width 767px
 * prefersReducedMotion — true when the visitor asks for no motion
 * setChromeOut — is-chrome-out on .layer, .layer-cta, and .product-nav-tab
 * settleGallery — write galleryOpen and the settled classes, then sync nested scroll
 * clearChromeFade — drop a running fade and show the chrome with no opacity ease
 * finishChromeFade — swap classes at opacity 0, then fade the chrome back in
 * syncGalleryChrome — settled is-none, blend, and is-full-screen for the current breakpoint
 * setFullScreenGallery — desktop fades chrome around the swap; immediate skips the fade
 * persistGalleryFlag — .next-product click writes rad-fs-gallery; boot restores then removes
 * setPaginationTicks — clone .pagination-item to match default-collection images; is-none if < 2
 * setChosenTick — is-choosen on the tick at Math.round(scrollLeft / clientWidth)
 */

/** isMobileViewport — true at max-width 767px */
const mobileQuery = window.matchMedia("(max-width: 767px)");
function isMobileViewport() {
  return mobileQuery.matches;
}

const galleryFullScreen = document.querySelector(".gallery-full-screen");
const layer = document.querySelector(".layer");
const defaultGalleryCollection = document.querySelector(
  ".product-gallery-collection.is-default",
);
const defaultGalleryList = defaultGalleryCollection?.querySelector(
  ".product-gallery-list",
);
const paginationBar = document.querySelector(".pagination-bar");

let galleryOpen = false;
const GALLERY_FLAG = "rad-fs-gallery";
const CHROME_FADE_MS = 300;
const chromeNodes = [
  layer,
  document.querySelector(".layer-cta"),
  document.querySelector(".product-nav-tab"),
].filter(Boolean);
let chromeFade = null;

/** prefersReducedMotion — true when the visitor asks for no motion */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** setChromeOut — is-chrome-out on .layer, .layer-cta, and .product-nav-tab */
function setChromeOut(out) {
  chromeNodes.forEach((el) => el.classList.toggle("is-chrome-out", out));
}

/** settleGallery — write galleryOpen and the settled classes, then sync nested scroll */
function settleGallery(open) {
  galleryOpen = open;
  syncGalleryChrome(open);
  if (typeof radNestedGallerySync === "function") radNestedGallerySync();
}

/** clearChromeFade — drop a running fade and show the chrome with no opacity ease */
function clearChromeFade() {
  if (!chromeFade) return;
  clearTimeout(chromeFade.timer);
  chromeFade.node.removeEventListener("transitionend", chromeFade.onEnd);
  chromeFade = null;
  chromeNodes.forEach((el) => {
    el.style.transition = "none";
    el.classList.remove("is-chrome-out");
  });
  chromeNodes[0]?.offsetHeight;
  chromeNodes.forEach((el) => {
    el.style.transition = "";
  });
}

/** finishChromeFade — swap classes at opacity 0, then fade the chrome back in */
function finishChromeFade() {
  if (!chromeFade) return;
  const open = chromeFade.pending;
  clearTimeout(chromeFade.timer);
  chromeFade.node.removeEventListener("transitionend", chromeFade.onEnd);
  chromeFade = null;
  settleGallery(open);
  requestAnimationFrame(() => setChromeOut(false));
}

/** syncGalleryChrome — settled is-none, blend, and is-full-screen for the current breakpoint */
function syncGalleryChrome(open) {
  const root = document.documentElement;
  galleryFullScreen.classList.toggle("is-none", !open);
  root.classList.toggle("is-full-screen", open);
  document.body.classList.toggle("is-full-screen", open);
  if (isMobileViewport()) {
    layer?.classList.toggle("is-none", open);
    layer?.classList.remove("is-blend");
    defaultGalleryCollection?.classList.remove("is-none");
  } else {
    layer?.classList.remove("is-none");
    layer?.classList.toggle("is-blend", open);
    defaultGalleryCollection?.classList.toggle("is-none", open);
  }
}

/** setFullScreenGallery — desktop fades chrome around the swap; immediate skips the fade */
function setFullScreenGallery(open, immediate) {
  if (!galleryFullScreen) return;
  const fade =
    !immediate &&
    !isMobileViewport() &&
    !prefersReducedMotion() &&
    chromeNodes.length > 0;
  if (!fade) {
    clearChromeFade();
    settleGallery(open);
    return;
  }
  galleryOpen = open;
  if (chromeFade) {
    chromeFade.pending = open;
    return;
  }
  const node = chromeNodes[0];
  const onEnd = (event) => {
    if (event.propertyName !== "opacity") return;
    finishChromeFade();
  };
  chromeFade = { pending: open, node, onEnd, timer: 0 };
  node.addEventListener("transitionend", onEnd);
  chromeFade.timer = setTimeout(finishChromeFade, CHROME_FADE_MS);
  setChromeOut(true);
}

mobileQuery.addEventListener("change", () => {
  if (galleryOpen) setFullScreenGallery(true, true);
  else if (typeof radNestedGallerySync === "function") radNestedGallerySync();
});

layer
  ?.querySelector(".product-gallery-list")
  ?.addEventListener("click", (event) => {
    if (isMobileViewport()) return;
    event.preventDefault();
    setFullScreenGallery(true);
  });

galleryFullScreen
  ?.querySelector(".product-gallery-list")
  ?.addEventListener("click", (event) => {
    if (isMobileViewport()) return;
    event.preventDefault();
    setFullScreenGallery(false);
  });

document
  .getElementById("full-screen-open")
  ?.addEventListener("click", (event) => {
    if (!isMobileViewport()) return;
    event.preventDefault();
    setFullScreenGallery(true);
  });

document
  .getElementById("full-screen-close")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    setFullScreenGallery(false);
  });

/** persistGalleryFlag — write on .next-product; restore once on boot */
document.querySelectorAll(".next-product").forEach((el) => {
  el.addEventListener("click", () => {
    try {
      if (galleryOpen) sessionStorage.setItem(GALLERY_FLAG, "1");
      else sessionStorage.removeItem(GALLERY_FLAG);
    } catch (e) {}
  });
});

try {
  if (sessionStorage.getItem(GALLERY_FLAG) === "1") {
    setFullScreenGallery(true, true);
  }
  sessionStorage.removeItem(GALLERY_FLAG);
} catch (e) {}

/** setChosenTick — is-choosen on the tick at Math.round(scrollLeft / clientWidth) */
function setChosenTick() {
  if (!paginationBar) return;
  const ticks = paginationBar.querySelectorAll(".pagination-item");
  if (ticks.length === 0) return;
  const width = defaultGalleryList?.clientWidth || 0;
  const index = width ? Math.round(defaultGalleryList.scrollLeft / width) : 0;
  const chosen = Math.min(Math.max(index, 0), ticks.length - 1);
  ticks.forEach((tick, i) => {
    tick.classList.toggle("is-choosen", i === chosen);
  });
}

/** setPaginationTicks — clone .pagination-item to match default-collection images; is-none if < 2 */
function setPaginationTicks() {
  if (!paginationBar || !defaultGalleryCollection) return;
  const count = defaultGalleryCollection.querySelectorAll(
    ".product-gallery-item",
  ).length;
  if (count < 2) {
    paginationBar.classList.add("is-none");
    return;
  }
  paginationBar.classList.remove("is-none");
  const template = paginationBar.querySelector(".pagination-item");
  if (!template) return;
  while (paginationBar.querySelectorAll(".pagination-item").length < count) {
    paginationBar.appendChild(template.cloneNode(true));
  }
  let ticks = paginationBar.querySelectorAll(".pagination-item");
  while (ticks.length > count) {
    ticks[ticks.length - 1].remove();
    ticks = paginationBar.querySelectorAll(".pagination-item");
  }
  setChosenTick();
  defaultGalleryList?.addEventListener("scroll", setChosenTick);
}

setPaginationTicks();
if (typeof radNestedGallerySync === "function") radNestedGallerySync();
window.radPageReadyFired = true;
if (typeof radPageReady === "function") radPageReady();
