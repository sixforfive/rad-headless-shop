/**
 * global.js — Site-wide behavior shared across all RAD pages.
 */

const FAVICON_LIGHT =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7df4917fdbe70d72a2f8b3_dot_light.png";
const FAVICON_DARK =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7df491b55a7d0896c30e38_dot_dark.png";

/** setFavicon — tab icon follows prefers-color-scheme (light PNG / dark PNG) */
function setFavicon(isDark) {
  const href = isDark ? FAVICON_DARK : FAVICON_LIGHT;
  const links = document.querySelectorAll(
    'link[rel="icon"], link[rel="shortcut icon"]',
  );
  if (links.length === 0) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    document.head.appendChild(link);
    return;
  }
  links.forEach((link) => {
    link.href = href;
  });
}

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
setFavicon(colorScheme.matches);
colorScheme.addEventListener("change", (event) => setFavicon(event.matches));

/** scrollToTop — #back-to-top click → window to top (smooth, or instant if reduced-motion) */
function scrollToTop(event) {
  event.preventDefault();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

document.getElementById("back-to-top")?.addEventListener("click", scrollToTop);
