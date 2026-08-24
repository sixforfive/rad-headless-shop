/**
 * product.js — Product detail page (/product/{slug}).
 * isMobileViewport — true at max-width 767px
 * setFullScreenGallery — open: hide default collection + blend layer (>767); hide layer (≤767); body.is-full-screen
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

/** setFullScreenGallery — desktop keep-chrome; mobile hide .layer */
function setFullScreenGallery(open) {
  if (!galleryFullScreen) return;
  galleryOpen = open;
  galleryFullScreen.classList.toggle("is-none", !open);
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

mobileQuery.addEventListener("change", () => {
  if (galleryOpen) setFullScreenGallery(true);
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
