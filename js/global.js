/**
 * global.js — Site-wide behavior shared across all RAD pages.
 *
 * scrollToTop — #back-to-top click → window to top (smooth, or instant if reduced-motion)
 */

document.getElementById("back-to-top")?.addEventListener("click", (event) => {
  event.preventDefault();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
});
