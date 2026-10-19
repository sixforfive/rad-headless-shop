/**
 * merch.js — Merch listing and detail (/merch, /merch/{slug}).
 * hydrateMerchThumbs — merch-column attr → CSS variable on each merch .product-thumb
 * signalMerchReady — radPageReady once every merch thumb has layout height
 */

/** hydrateMerchThumbs — merch-column → --merch-column */
function hydrateMerchThumbs() {
  document
    .querySelectorAll(".product-list.is-merch .product-thumb")
    .forEach((el) => {
      const col = el.getAttribute("merch-column");
      if (col) el.style.setProperty("--merch-column", col);
    });
}

/** signalMerchReady — radPageReady once every merch thumb has layout height */
function signalMerchReady() {
  if (window.radPageReadyFired) return;
  const thumbs = document.querySelectorAll(
    ".product-list.is-merch .product-thumb",
  );
  const sized = [...thumbs].every(
    (el) => el.getBoundingClientRect().height > 1,
  );
  if (thumbs.length && !sized) return;
  window.radPageReadyFired = true;
  if (typeof radPageReady === "function") radPageReady();
}

hydrateMerchThumbs();
document
  .querySelectorAll(".product-list.is-merch .product-thumb img")
  .forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", signalMerchReady);
    img.addEventListener("error", signalMerchReady);
  });
document.querySelectorAll(".product-list.is-merch").forEach((list) => {
  new ResizeObserver(signalMerchReady).observe(list);
});
signalMerchReady();
