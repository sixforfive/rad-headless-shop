/**
 * product.js — Product detail page (/product/{slug}).
 * isMobileViewport — true at max-width 767px
 * setFullScreenGallery — is-none on .gallery-full-screen vs .product-gallery-collection.is-default; is-blend on .layer
 */

/** isMobileViewport — true at max-width 767px */
function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

const galleryFullScreen = document.querySelector(".gallery-full-screen");
const layer = document.querySelector(".layer");
const defaultGalleryCollection = document.querySelector(
  ".product-gallery-collection.is-default",
);

/** setFullScreenGallery — is-none on full-screen vs default collection; is-blend on .layer */
function setFullScreenGallery(open) {
  if (!galleryFullScreen) return;
  galleryFullScreen.classList.toggle("is-none", !open);
  defaultGalleryCollection?.classList.toggle("is-none", open);
  layer?.classList.toggle("is-blend", open);
}

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
