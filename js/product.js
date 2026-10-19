/**
 * product.js — Product and merch detail (/product/{slug}, /merch/{slug}).
 * isMobileViewport — true at max-width 767px
 * isMobileSafari — true on Safari at max-width 767px; false for Chrome, CriOS, Firefox iOS, and Edge iOS
 * measureLargeViewport — taller of a 100lvh probe and the document client height
 * pinGalleryLargeViewport — lock the fullscreen gallery to that height on mobile Safari, or clear it
 * prefersReducedMotion — true when the visitor prefers reduced motion
 * syncGalleryChrome — settled is-none, blend, and is-full-screen for the current breakpoint
 * setFullScreenGallery — open or close in one turn; cancels an in-flight chrome fade
 * fadeChromeThenSync — desktop click fades chrome and the fullscreen gallery out, then syncs, then fades them in
 * openGalleryFromClick — fade on desktop; instant on mobile and reduced motion
 * closeMobileGalleryOnTap — pointerdown stores fullscreen list scrollLeft; click at ≤767 closes if it did not change
 * persistGalleryFlag — .next-product click writes rad-fs-gallery; boot restores then removes
 * setPaginationTicks — clone .pagination-item to match default-collection images; is-none if < 2
 * setChosenTick — is-choosen on the tick at Math.round(scrollLeft / clientWidth)
 * setSpecTarget — #download-spec opens the CMS file in a new tab
 */

/** isMobileViewport — true at max-width 767px */
const mobileQuery = window.matchMedia("(max-width: 767px)");
function isMobileViewport() {
  return mobileQuery.matches;
}

/** isMobileSafari — true on Safari at max-width 767px; false for Chrome, CriOS, Firefox iOS, and Edge iOS */
function isMobileSafari() {
  const ua = navigator.userAgent;
  if (/Chrome|Chromium|CriOS|FxiOS|EdgiOS/i.test(ua)) return false;
  if (!/Safari/i.test(ua)) return false;
  return isMobileViewport();
}

/** measureLargeViewport — taller of a 100lvh probe and the document client height */
function measureLargeViewport() {
  const probe = document.createElement("div");
  probe.style.cssText =
    "position:fixed;height:100lvh;visibility:hidden;pointer-events:none;";
  document.documentElement.appendChild(probe);
  const probed = probe.offsetHeight;
  probe.remove();
  return Math.max(probed, document.documentElement.clientHeight);
}

/** pinGalleryLargeViewport — lock the fullscreen gallery to that height on mobile Safari, or clear it */
function pinGalleryLargeViewport() {
  if (!galleryFullScreen) return;
  const images = galleryFullScreen.querySelectorAll(
    ".product-gallery-img.is-full",
  );
  if (!isMobileSafari()) {
    galleryFullScreen.style.height = "";
    galleryFullScreen.style.minHeight = "";
    galleryFullScreen.style.top = "";
    images.forEach((img) => {
      img.style.minHeight = "";
    });
    return;
  }
  const px = `${measureLargeViewport()}px`;
  galleryFullScreen.style.height = px;
  galleryFullScreen.style.minHeight = px;
  galleryFullScreen.style.top = "0";
  images.forEach((img) => {
    img.style.minHeight = px;
  });
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
let chromeFadeToken = 0;
let fullScreenScrollLeft = 0;
const GALLERY_FLAG = "rad-fs-gallery";

/** prefersReducedMotion — true when the visitor prefers reduced motion */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

/** setFullScreenGallery — open or close in one turn; cancels an in-flight chrome fade */
function setFullScreenGallery(open) {
  if (!galleryFullScreen) return;
  chromeFadeToken += 1;
  galleryOpen = open;
  const root = document.documentElement;
  if (
    root.classList.contains("is-chrome-fading") ||
    root.classList.contains("is-chrome-reveal")
  ) {
    root.classList.add("is-chrome-cut");
    root.classList.remove("is-chrome-fading");
    root.classList.remove("is-chrome-reveal");
    void root.offsetWidth;
    root.classList.remove("is-chrome-cut");
  }
  syncGalleryChrome(open);
  if (typeof radNestedGallerySync === "function") radNestedGallerySync();
}

/** fadeChromeThenSync — fade chrome and the fullscreen gallery out, then sync, then fade in */
function fadeChromeThenSync(open) {
  if (!galleryFullScreen) return;
  const token = ++chromeFadeToken;
  galleryOpen = open;
  const root = document.documentElement;
  const node =
    layer ||
    document.querySelector(".layer-cta") ||
    document.querySelector(".product-nav-tab");
  if (!node) {
    syncGalleryChrome(open);
    if (typeof radNestedGallerySync === "function") radNestedGallerySync();
    return;
  }

  let settled = false;
  let timer = 0;
  const finish = () => {
    node.removeEventListener("transitionend", onEnd);
    clearTimeout(timer);
    if (settled || token !== chromeFadeToken) return;
    settled = true;
    syncGalleryChrome(open);
    root.classList.add("is-chrome-reveal");
    void galleryFullScreen.offsetWidth;
    root.classList.remove("is-chrome-fading");
    if (typeof radNestedGallerySync === "function") radNestedGallerySync();
    setTimeout(() => {
      if (token !== chromeFadeToken) return;
      root.classList.remove("is-chrome-reveal");
    }, 300);
  };
  const onEnd = (event) => {
    if (event.target !== node || event.propertyName !== "opacity") return;
    finish();
  };

  node.addEventListener("transitionend", onEnd);
  timer = setTimeout(finish, 300);
  root.classList.add("is-chrome-fading");
}

/** openGalleryFromClick — fade on desktop; instant on mobile and reduced motion */
function openGalleryFromClick(open) {
  if (isMobileViewport() || prefersReducedMotion()) {
    setFullScreenGallery(open);
    return;
  }
  fadeChromeThenSync(open);
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
    openGalleryFromClick(true);
  });

const fullScreenGalleryList = galleryFullScreen?.querySelector(
  ".product-gallery-list",
);

fullScreenGalleryList?.addEventListener("click", (event) => {
  if (isMobileViewport()) return;
  event.preventDefault();
  openGalleryFromClick(false);
});

/** closeMobileGalleryOnTap — pointerdown stores scrollLeft; click at ≤767 closes if the list did not scroll */
galleryFullScreen?.addEventListener("pointerdown", () => {
  fullScreenScrollLeft = fullScreenGalleryList?.scrollLeft ?? 0;
});

galleryFullScreen?.addEventListener("click", (event) => {
  if (!isMobileViewport() || !galleryOpen) return;
  if ((fullScreenGalleryList?.scrollLeft ?? 0) !== fullScreenScrollLeft) return;
  event.preventDefault();
  openGalleryFromClick(false);
});

document
  .getElementById("full-screen-open")
  ?.addEventListener("click", (event) => {
    if (!isMobileViewport()) return;
    event.preventDefault();
    openGalleryFromClick(true);
  });

document
  .getElementById("full-screen-close")
  ?.addEventListener("click", (event) => {
    event.preventDefault();
    openGalleryFromClick(false);
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

pinGalleryLargeViewport();
let galleryPinWidth = window.innerWidth;
window.addEventListener("orientationchange", () => {
  pinGalleryLargeViewport();
  galleryPinWidth = window.innerWidth;
});
window.addEventListener("resize", () => {
  if (window.innerWidth === galleryPinWidth) return;
  galleryPinWidth = window.innerWidth;
  pinGalleryLargeViewport();
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

/** setSpecTarget — #download-spec opens the CMS file in a new tab */
function setSpecTarget() {
  const link = document.getElementById("download-spec");
  if (!(link instanceof HTMLAnchorElement)) return;
  link.target = "_blank";
  link.rel = "noopener";
}

setPaginationTicks();
setSpecTarget();
if (typeof radNestedGallerySync === "function") radNestedGallerySync();
window.radPageReadyFired = true;
if (typeof radPageReady === "function") radPageReady();
