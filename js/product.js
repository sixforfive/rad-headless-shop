/**
 * product.js — Product detail page (/product/{slug}).
 * isMobileViewport — true at max-width 767px
 * setFullScreenGallery — is-none on .gallery-full-screen (closed) vs .layer (open)
 */

/** isMobileViewport — true at max-width 767px */
function isMobileViewport() {
  return window.matchMedia("(max-width: 767px)").matches;
}

const galleryFullScreen = document.querySelector(".gallery-full-screen");
const layer = document.querySelector(".layer");

/** setFullScreenGallery — is-none on .gallery-full-screen vs .layer */
function setFullScreenGallery(open) {
  if (!galleryFullScreen || !layer) return;
  galleryFullScreen.classList.toggle("is-none", !open);
  layer.classList.toggle("is-none", open);
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
