/**
 * product.js — Product and merch detail (/product/{slug}, /merch/{slug}).
 * isMobileViewport — true at max-width 767px
 * syncGalleryChrome — settled is-none, blend, and is-full-screen for the current breakpoint
 * clearFadeClasses — drop in-flight opacity classes
 * cancelGalleryFade — invalidate an in-flight settle
 * opacityMs — first transition-duration, in ms
 * commitGalleryFade — settled classes after the fade
 * armGalleryFade — transitionend, or 800ms
 * setFullScreenGallery — desktop crossfade default + fullscreen; mobile fade fullscreen only; nested Lenis sync
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
const GALLERY_FADE_MS = 800;
const galleryMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let fadeToken = 0;
let settleTimer = 0;
let fadeTarget = null;
let fadeListener = null;

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

/** clearFadeClasses — drop the in-flight opacity classes */
function clearFadeClasses() {
  document.documentElement.classList.remove("is-gallery-fading");
  galleryFullScreen.classList.remove("is-switching", "is-fade-out");
  defaultGalleryCollection?.classList.remove("is-switching", "is-fade-out");
}

/** cancelGalleryFade — invalidate an in-flight settle */
function cancelGalleryFade() {
  fadeToken += 1;
  window.clearTimeout(settleTimer);
  if (fadeTarget && fadeListener) {
    fadeTarget.removeEventListener("transitionend", fadeListener);
  }
  fadeTarget = null;
  fadeListener = null;
}

/** opacityMs — first transition-duration on el, in ms */
function opacityMs(el) {
  if (!el) return 0;
  const raw = getComputedStyle(el).transitionDuration.split(",")[0].trim();
  if (raw.endsWith("ms")) return parseFloat(raw) || 0;
  return (parseFloat(raw) || 0) * 1000;
}

/** commitGalleryFade — settled classes after the opacity fade */
function commitGalleryFade(token) {
  if (token !== fadeToken) return;
  fadeToken += 1;
  window.clearTimeout(settleTimer);
  if (fadeTarget && fadeListener) {
    fadeTarget.removeEventListener("transitionend", fadeListener);
  }
  fadeTarget = null;
  fadeListener = null;
  clearFadeClasses();
  syncGalleryChrome(galleryOpen);
  if (typeof radNestedGallerySync === "function") radNestedGallerySync();
}

/** armGalleryFade — transitionend, or 800ms if it never fires */
function armGalleryFade(outgoing, token) {
  fadeListener = (event) => {
    if (event && (event.target !== outgoing || event.propertyName !== "opacity")) {
      return;
    }
    commitGalleryFade(token);
  };
  fadeTarget = outgoing;
  outgoing.addEventListener("transitionend", fadeListener);
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => commitGalleryFade(token), GALLERY_FADE_MS);
}

/** setFullScreenGallery — desktop crossfade; mobile fades fullscreen only */
function setFullScreenGallery(open) {
  if (!galleryFullScreen) return;
  const root = document.documentElement;
  const changed = open !== galleryOpen;
  const persisted =
    open &&
    changed &&
    root.classList.contains("is-full-screen") &&
    !root.classList.contains("is-gallery-fading");
  galleryOpen = open;
  cancelGalleryFade();

  if (!changed || persisted || galleryMotion.matches) {
    clearFadeClasses();
    syncGalleryChrome(open);
    if (typeof radNestedGallerySync === "function") radNestedGallerySync();
    return;
  }

  const mobile = isMobileViewport();
  const incoming = open ? galleryFullScreen : mobile ? null : defaultGalleryCollection;
  const outgoing = open ? (mobile ? null : defaultGalleryCollection) : galleryFullScreen;

  root.classList.add("is-gallery-fading");
  root.classList.toggle("is-full-screen", open);
  document.body.classList.toggle("is-full-screen", open);
  if (mobile) {
    layer?.classList.toggle("is-none", open);
    layer?.classList.remove("is-blend");
    defaultGalleryCollection?.classList.remove("is-none", "is-fade-out", "is-switching");
  } else {
    layer?.classList.remove("is-none");
    layer?.classList.toggle("is-blend", open);
  }

  if (incoming) {
    incoming.classList.add("is-fade-out");
    incoming.classList.remove("is-none", "is-switching");
  }
  if (outgoing && outgoing !== incoming) {
    outgoing.classList.remove("is-none", "is-fade-out", "is-switching");
  }

  const token = fadeToken;
  (incoming || outgoing).offsetWidth;
  incoming?.classList.add("is-switching");
  incoming?.classList.remove("is-fade-out");
  if (outgoing) outgoing.classList.add("is-switching", "is-fade-out");
  const watch = outgoing || incoming;
  if (!watch || opacityMs(watch) === 0) {
    commitGalleryFade(token);
    return;
  }
  armGalleryFade(watch, token);
  if (typeof radNestedGallerySync === "function") radNestedGallerySync();
}

mobileQuery.addEventListener("change", () => {
  if (galleryOpen) setFullScreenGallery(true);
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

document.getElementById("full-screen-open")?.addEventListener("click", (event) => {
  if (!isMobileViewport()) return;
  event.preventDefault();
  setFullScreenGallery(true);
});

document.getElementById("full-screen-close")?.addEventListener("click", (event) => {
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
    setFullScreenGallery(true);
  }
  sessionStorage.removeItem(GALLERY_FLAG);
} catch (e) {}

/** setChosenTick — is-choosen on the tick at Math.round(scrollLeft / clientWidth) */
function setChosenTick() {
  if (!paginationBar) return;
  const ticks = paginationBar.querySelectorAll(".pagination-item");
  if (ticks.length === 0) return;
  const width = defaultGalleryList?.clientWidth || 0;
  const index = width
    ? Math.round(defaultGalleryList.scrollLeft / width)
    : 0;
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
