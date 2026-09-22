/**
 * shop.js — Shop page (/shop).
 * shopList — the Shop Collection List (not merch)
 * cloneList — the cloned Shop Collection List, or null
 * hydrateThumbs — CMS column attrs → CSS variables on each .product-thumb
 * eagerThumbImages — loading=eager on every thumb img so below-fold thumbs actually fetch
 * cloneGalleryList — one .is-clone copy of the whole list, appended as its sibling
 * alignCloneGap — clone list margin-top so the seam gap equals the grid row gap
 * originalsSized — every original thumb has layout height
 * loopHeight — clone list getBoundingClientRect.top minus original list top
 * onGalleryScroll — wrap down when scrollY >= loop height; write 00–99 to #gallery-scroll-counter
 * shiftScrollY — momentum-preserving radScrollShift (Lenis) or window.scrollTo
 * jumpScrollY — instant radScrollTo (Lenis) or window.scrollTo
 * setView — add/remove is-gallery on .product-list from data-view; jump to top when the view changes
 * syncActive — is-active on the switch button that matches the current view
 */

let galleryLoopHeight = 0;
let galleryOriginalsSized = false;

/** shopLists — Shop Collection Lists only (not merch) */
function shopLists() {
  return document.querySelectorAll(".product-list:not(.is-merch)");
}

/** shopList — the Shop Collection List (not merch) */
function shopList() {
  return document.querySelector(".product-list:not(.is-merch)");
}

/** cloneList — the cloned Shop Collection List, or null */
function cloneList() {
  return document.querySelector(".product-list.is-clone");
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

/** eagerThumbImages — loading=eager on every shop thumb img */
function eagerThumbImages() {
  const list = shopList();
  if (!list) return;
  list.querySelectorAll(".product-thumb img").forEach((img) => {
    img.loading = "eager";
  });
}

/** cloneGalleryList — copy the whole list into a sibling grid; skip if already cloned */
function cloneGalleryList() {
  const list = shopList();
  if (!list || cloneList()) return;
  const clone = list.cloneNode(true);
  clone.classList.add("is-clone");
  clone.setAttribute("aria-hidden", "true");
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
  list.insertAdjacentElement("afterend", clone);
}

/** alignCloneGap — correct the measured seam gap to the grid's own row gap */
function alignCloneGap() {
  const list = shopList();
  const clone = cloneList();
  if (!list || !clone) return;
  const rowGap = parseFloat(getComputedStyle(list).rowGap) || 0;
  // Collapsing margins do not answer 1:1, so re-measure until the gap lands.
  for (let pass = 0; pass < 3; pass++) {
    const visualGap =
      clone.getBoundingClientRect().top - list.getBoundingClientRect().bottom;
    if (Math.abs(rowGap - visualGap) < 0.5) return;
    const marginTop = parseFloat(getComputedStyle(clone).marginTop) || 0;
    clone.style.marginTop = `${marginTop + (rowGap - visualGap)}px`;
  }
}

/** originalsSized — every original thumb has layout height */
function originalsSized() {
  const list = shopList();
  if (!list) return false;
  const originals = list.querySelectorAll(".product-thumb");
  if (!originals.length) return false;
  return [...originals].every((el) => el.getBoundingClientRect().height > 1);
}

/** loopHeight — clone list top minus original list top */
function loopHeight() {
  const list = shopList();
  const clone = cloneList();
  if (!list || !clone) return 0;
  return clone.getBoundingClientRect().top - list.getBoundingClientRect().top;
}

/** measureLoopHeight — align the seam, then cache loop height and sizing for scroll */
function measureLoopHeight() {
  const list = shopList();
  if (!list?.classList.contains("is-gallery")) {
    galleryLoopHeight = 0;
    galleryOriginalsSized = false;
    return;
  }
  alignCloneGap();
  galleryOriginalsSized = originalsSized();
  galleryLoopHeight = loopHeight();
}

/** shiftScrollY — move by delta through Lenis when live, keeping momentum */
function shiftScrollY(delta) {
  if (typeof radScrollShift === "function") {
    radScrollShift(delta);
    return;
  }
  window.scrollTo(0, window.scrollY - delta);
}

/** jumpScrollY — instant window jump through Lenis when live */
function jumpScrollY(y) {
  if (typeof radScrollTo === "function") {
    radScrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

/** onGalleryScroll — wrap down in gallery; write 00–99 into #gallery-scroll-counter */
function onGalleryScroll() {
  const list = shopList();
  if (!list?.classList.contains("is-gallery")) return;
  const h = galleryLoopHeight;
  if (h > 0 && galleryOriginalsSized && window.scrollY >= h) {
    document.documentElement.style.overflowAnchor = "none";
    shiftScrollY(h);
    document.documentElement.style.overflowAnchor = "";
  }
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
eagerThumbImages();
cloneGalleryList();
syncActive();
measureLoopHeight();
onGalleryScroll();

if (typeof radOnScroll === "function") {
  radOnScroll(onGalleryScroll);
} else {
  window.addEventListener("scroll", onGalleryScroll, { passive: true });
}
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
