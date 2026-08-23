/**
 * product.js — Product detail page (/product/{slug}).
 * isMobileViewport — true at max-width 767px
 * setFullScreenGallery — open: hide default collection + blend layer (>767); hide layer (≤767)
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

let galleryOpen = false;

/** setFullScreenGallery — desktop keep-chrome; mobile hide .layer */
function setFullScreenGallery(open) {
  if (!galleryFullScreen) return;
  galleryOpen = open;
  galleryFullScreen.classList.toggle("is-none", !open);
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
  if (!isMobileViewport()) return;
  setFullScreenGallery(false);
});
