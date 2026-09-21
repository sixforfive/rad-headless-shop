/**
 * shop.js — Shop page (/shop).
 * shopList — the Shop Collection List (not merch)
 * hydrateThumbs — CMS column attrs → CSS variables on each .product-thumb
 * cloneGalleryThumbs — duplicate original thumbs after hydrate for gallery loop; eager-decode clone imgs
 * thumbImages — all shop thumb <img> (originals + clones)
 * whenThumbsReady — resolve once every thumb image is decoded
 * galleryReady — blocks wrap until first real measure lands
 * loopHeight — first clone getBoundingClientRect.top minus first original
 * onGalleryScroll — wrap down when scrollY >= loop height; write 00–99 to #gallery-scroll-counter
 * jumpScrollY — instant radScrollTo (Lenis) or window.scrollTo
 * setView — add/remove is-gallery on .product-list from data-view; jump to top when the view changes
 * syncActive — is-active on the switch button that matches the current view
 */

let galleryLoopHeight = 0;
let galleryReady = false;

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
    clone.querySelectorAll("img").forEach((img) => {
      img.loading = "eager";
      img.decode().catch(() => {});
    });
    el.parentNode.appendChild(clone);
  });
}

/** thumbImages — all shop thumb <img> (originals + clones) */
function thumbImages() {
  const list = shopList();
  return list ? [...list.querySelectorAll(".product-thumb img")] : [];
}

/** whenThumbsReady — resolve once every thumb image is decoded */
function whenThumbsReady() {
  return Promise.all(
    thumbImages().map((img) =>
      img.complete ? img.decode().catch(() => {}) : new Promise((r) => {
        img.addEventListener("load", r, { once: true });
        img.addEventListener("error", r, { once: true });
      })
    )
  );
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
    radScrollTo(y, { immediate: true });
    return;
  }
  window.scrollTo({ top: y, behavior: "auto" });
}

/** onGalleryScroll — wrap down in gallery; write 00–99 into #gallery-scroll-counter */
function onGalleryScroll() {
  const list = shopList();
  if (!list?.classList.contains("is-gallery")) return;
  if (!galleryReady) return;
  const h = galleryLoopHeight;
  if (h <= 0) return;
  if (window.scrollY >= h) {
    document.documentElement.style.overflowAnchor = "none";
    jumpScrollY(window.scrollY - h);
    document.documentElement.style.overflowAnchor = "";
  }
  const counter = document.getElementById("gallery-scroll-counter");
  if (counter) {
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
syncActive();

whenThumbsReady().then(() => {
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
