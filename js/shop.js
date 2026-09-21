/**
 * shop.js — Shop page (/shop).
 * shopList — the Shop Collection List (not merch)
 * hydrateThumbs — CMS column attrs → CSS variables on each .product-thumb
 * cloneGalleryThumbs — duplicate original thumbs after hydrate for gallery loop
 * thumbImages — all shop thumb <img> (originals + clones)
 * eagerThumbImages — loading=eager on every thumb img so below-fold originals actually fetch
 * whenImageReady — decode if complete; else load/error, recheck complete to not miss the event
 * whenThumbsReady — resolve once every thumb image is decoded
 * pinThumbSrcs — freeze currentSrc so wrap does not srcset-refetch
 * galleryReady — blocks wrap until first real measure lands
 * wrapGallery — decode originals, then instant-jump back one loop
 * originalThumbImages — shop thumb imgs that are not clones
 * loopHeight — first clone getBoundingClientRect.top minus first original
 * onGalleryScroll — wrap down when scrollY >= loop height; write 00–99 to #gallery-scroll-counter
 * jumpScrollY — instant radScrollTo (Lenis) or window.scrollTo
 * setView — add/remove is-gallery on .product-list from data-view; jump to top when the view changes
 * syncActive — is-active on the switch button that matches the current view
 */

let galleryLoopHeight = 0;
let galleryReady = false;
let wrapPending = false;

/** shopLists — Shop Collection Lists only (not merch) */
function shopLists() {
  return document.querySelectorAll(".product-list:not(.is-merch)");
}

/** shopList — the Shop Collection List (not merch) */
function shopList() {
  return document.querySelector(".product-list:not(.is-merch)");
}

/** hydrateThumbs — gallery-column-start/end and list-column → CSS vars (end is inclusive, so +1) */
function hydrateThumbs() {
  document.querySelectorAll(".product-list .product-thumb").forEach((el) => {
    const start = el.getAttribute("gallery-column-start");
    const end = el.getAttribute("gallery-column-end");
    const listCol = el.getAttribute("list-column");
    if (start) el.style.setProperty("--gallery-column-start", start);
    if (end) {
      el.style.setProperty("--gallery-column-end", String(Number(end) + 1));
    }
    if (listCol) el.style.setProperty("--list-column", listCol);
  });
}

/** cloneGalleryThumbs — one .is-clone copy of each original shop thumb; skip if already cloned */
function cloneGalleryThumbs() {
  const list = shopList();
  if (!list || list.querySelector(".product-thumb.is-clone")) return;
  list.querySelectorAll(".product-thumb:not(.is-clone)").forEach((el) => {
    const clone = el.cloneNode(true);
    clone.classList.add("is-clone");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
    el.parentNode.appendChild(clone);
  });
}

/** thumbImages — all shop thumb <img> (originals + clones) */
function thumbImages() {
  const list = shopList();
  return list ? [...list.querySelectorAll(".product-thumb img")] : [];
}

/** eagerThumbImages — loading=eager on every thumb img so below-fold originals actually fetch */
function eagerThumbImages() {
  thumbImages().forEach((img) => {
    img.loading = "eager";
  });
}

/** whenImageReady — decode if complete; else load/error, recheck complete to not miss the event */
function whenImageReady(img) {
  const decode = () => img.decode().catch(() => {});
  if (img.complete) return decode();
  return new Promise((r) => {
    const done = () => decode().then(r, r);
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", r, { once: true });
    if (img.complete) done();
  });
}

/** whenThumbsReady — resolve once every thumb image is decoded */
function whenThumbsReady() {
  return Promise.all(thumbImages().map(whenImageReady));
}

/** pinThumbSrcs — freeze currentSrc so wrap does not srcset-refetch */
function pinThumbSrcs() {
  thumbImages().forEach((img) => {
    const src = img.currentSrc;
    if (!src) return;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.src = src;
  });
}

/** loopHeight — first clone getBoundingClientRect.top minus first original */
function loopHeight() {
  const list = shopList();
  const first = list?.querySelector(".product-thumb:not(.is-clone)");
  const firstClone = list?.querySelector(".product-thumb.is-clone");
  if (!first || !firstClone) return 0;
  return firstClone.getBoundingClientRect().top - first.getBoundingClientRect().top;
}

/** measureLoopHeight — cache loopHeight for scroll */
function measureLoopHeight() {
  galleryLoopHeight = loopHeight();
}

/** jumpScrollY — instant window jump through Lenis when live */
function jumpScrollY(y) {
  if (typeof radScrollTo === "function") {
    radScrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

/** originalThumbImages — shop thumb imgs that are not clones */
function originalThumbImages() {
  const list = shopList();
  return list ? [...list.querySelectorAll(".product-thumb:not(.is-clone) img")] : [];
}

/** wrapGallery — decode originals (they were off-screen), then jump one loop */
function wrapGallery() {
  if (wrapPending) return;
  wrapPending = true;
  Promise.all(originalThumbImages().map((img) => img.decode().catch(() => {}))).then(() => {
    const h = galleryLoopHeight;
    if (h > 0 && window.scrollY >= h) {
      document.documentElement.style.overflowAnchor = "none";
      jumpScrollY(window.scrollY - h);
      document.documentElement.style.overflowAnchor = "";
    }
    wrapPending = false;
  });
}

/** onGalleryScroll — wrap down in gallery; write 00–99 into #gallery-scroll-counter */
function onGalleryScroll() {
  const list = shopList();
  if (!list?.classList.contains("is-gallery")) return;
  const h = galleryLoopHeight;
  if (galleryReady && h > 0 && window.scrollY >= h) wrapGallery();
  const counter = document.getElementById("gallery-scroll-counter");
  if (counter && h > 0) {
    const pct = Math.min(99, Math.max(0, Math.floor((window.scrollY / h) * 100)));
    counter.textContent = String(pct).padStart(2, "0");
  }
}

/** setView — gallery adds is-gallery; list removes it; is-active follows data-view; jump to top on change */
function setView(view) {
  const list = shopList();
  const current = list?.classList.contains("is-gallery") ? "gallery" : "list";
  if (current === view) return;

  document.documentElement.style.overflowAnchor = "none";
  shopLists().forEach((el) => {
    el.classList.toggle("is-gallery", view === "gallery");
  });
  document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
  });
  jumpScrollY(0);
  requestAnimationFrame(() => {
    jumpScrollY(0);
    document.documentElement.style.overflowAnchor = "";
    measureLoopHeight();
    onGalleryScroll();
  });
}

/** syncActive — is-active matches whether the grid currently has is-gallery */
function syncActive() {
  const list = shopList();
  const view = list?.classList.contains("is-gallery") ? "gallery" : "list";
  document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
  });
}

hydrateThumbs();
cloneGalleryThumbs();
eagerThumbImages();
syncActive();

whenThumbsReady().then(() => {
  pinThumbSrcs();
  measureLoopHeight();
  galleryReady = true;
  onGalleryScroll();
});

window.addEventListener("scroll", onGalleryScroll, { passive: true });
window.addEventListener("resize", () => {
  measureLoopHeight();
  onGalleryScroll();
});

const galleryList = shopList();
if (galleryList) {
  new ResizeObserver(() => {
    measureLoopHeight();
    onGalleryScroll();
  }).observe(galleryList);
}

document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const view = btn.getAttribute("data-view");
    if (view === "gallery" || view === "list") setView(view);
  });
});
