/**
 * shop.js — Shop page (/shop).
 * hydrateThumbs — CMS column attrs → CSS variables on each .product-thumb
 * setView — add/remove is-gallery on .product-list from data-view
 * syncActive — is-active on the switch button that matches the current view
 */

/** shopLists — Shop Collection Lists only (not merch) */
function shopLists() {
  return document.querySelectorAll(".product-list:not(.is-merch)");
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

/** setView — gallery adds is-gallery; list removes it; is-active follows data-view */
function setView(view) {
  shopLists().forEach((list) => {
    list.classList.toggle("is-gallery", view === "gallery");
  });
  document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
  });
}

/** syncActive — is-active matches whether the grid currently has is-gallery */
function syncActive() {
  const list = document.querySelector(".product-list:not(.is-merch)");
  const view = list?.classList.contains("is-gallery") ? "gallery" : "list";
  document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
  });
}

hydrateThumbs();
syncActive();

document.querySelectorAll(".switch-btn[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const view = btn.getAttribute("data-view");
    if (view === "gallery" || view === "list") setView(view);
  });
});
