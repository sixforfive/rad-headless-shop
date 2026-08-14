/**
 * merch.js — Merch listing and detail (/merch, /merch/{slug}).
 * hydrateMerchThumbs — merch-column attr → CSS variable on each merch .product-thumb
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

hydrateMerchThumbs();
