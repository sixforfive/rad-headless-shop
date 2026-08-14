/**
 * global.js — Site-wide behavior shared across all RAD pages.
 * setFavicon — tab icon follows prefers-color-scheme (light PNG / dark PNG)
 * applyLights — .dark-mode on html/body, rad-lights in localStorage, plus/minus is-none
 * storedLightsDark — true only when rad-lights is exactly "dark"
 * scrollToTop — #back-to-top click → window to top (smooth, or instant if reduced-motion)
 * setDrawerButtons — is-none on the open/close pair for the active drawer
 * showDrawerPanel — display:flex on the active drawer, none on the other
 * hideDrawerOverlay — display:none on wrapper and both drawers, unlock scroll
 * openDrawer — fade overlay in, or swap panel if the other is already open
 * closeDrawer — fade overlay out, then hideDrawerOverlay
 * hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item
 * onDrawerBackdrop — close when the click target is .drawer-wrapper itself
 */

const FAVICON_LIGHT =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7df4917fdbe70d72a2f8b3_d3c42f96cc6ace35efd517729f3e888b_dot_light.png";
const FAVICON_DARK =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7df491b55a7d0896c30e38_04ea4bffdedf9aacb7d8829386cfe7fa_dot_dark.png";

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

const LIGHTS_KEY = "rad-lights";
const lightsSwitchBtn = document.getElementById("lights-switch-btn");
const lightsPlus = lightsSwitchBtn?.querySelector(".text-meta.is-plus");
const lightsMinus = lightsSwitchBtn?.querySelector(".text-meta.is-minus");

/** applyLights — .dark-mode on html/body, persist rad-lights, swap plus/minus is-none */
function applyLights(dark) {
  document.documentElement.classList.toggle("dark-mode", dark);
  document.body.classList.toggle("dark-mode", dark);
  try {
    localStorage.setItem(LIGHTS_KEY, dark ? "dark" : "light");
  } catch (e) {}
  lightsPlus?.classList.toggle("is-none", dark);
  lightsMinus?.classList.toggle("is-none", !dark);
}

/** storedLightsDark — true only when rad-lights is exactly "dark" */
function storedLightsDark() {
  try {
    return localStorage.getItem(LIGHTS_KEY) === "dark";
  } catch (e) {
    return false;
  }
}

applyLights(storedLightsDark());

lightsSwitchBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  applyLights(!document.body.classList.contains("dark-mode"));
});

/** scrollToTop — #back-to-top click → window to top (smooth, or instant if reduced-motion) */
function scrollToTop(event) {
  event.preventDefault();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

document.getElementById("back-to-top")?.addEventListener("click", scrollToTop);

const drawerWrapper = document.querySelector(".drawer-wrapper");
const menuDrawer = document.querySelector(".menu-drawer");
const cartDrawer = document.querySelector(".cart-drawer");
const mainWrapper = document.querySelector(".main-wrapper");
const notificationBarBox = document.querySelector(".notification-bar-box");
const menuOpen = document.getElementById("menu-open");
const menuClose = document.getElementById("menu-close");
const cartOpen = document.getElementById("cart-open");
const cartClose = document.getElementById("cart-close");

let activeDrawer = null;

/** hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item */
function hideNotificationIfEmpty() {
  if (!notificationBarBox) return;
  if (!notificationBarBox.querySelector(".notification-item")) {
    notificationBarBox.classList.add("is-none");
  }
}

hideNotificationIfEmpty();

/** setDrawerButtons — is-none on the matching open control; close controls hidden unless that drawer is active */
function setDrawerButtons(kind) {
  menuOpen?.classList.toggle("is-none", kind === "menu");
  menuClose?.classList.toggle("is-none", kind !== "menu");
  cartOpen?.classList.toggle("is-none", kind === "cart");
  cartClose?.classList.toggle("is-none", kind !== "cart");
}

/** showDrawerPanel — flex on the active drawer, none on the other */
function showDrawerPanel(kind) {
  const show = kind === "menu" ? menuDrawer : cartDrawer;
  const hide = kind === "menu" ? cartDrawer : menuDrawer;
  if (hide) hide.style.display = "none";
  if (show) show.style.display = "flex";
}

/** hideDrawerOverlay — display none after fade-out; no-op if a drawer reopened mid-fade */
function hideDrawerOverlay() {
  if (activeDrawer !== null) return;
  if (drawerWrapper) drawerWrapper.style.display = "none";
  if (menuDrawer) menuDrawer.style.display = "none";
  if (cartDrawer) cartDrawer.style.display = "none";
  document.body.classList.remove("is-scroll-locked");
}

/** openDrawer — kind is "menu" | "cart"; swap if the other is already open */
function openDrawer(kind, event) {
  event.preventDefault();
  if (!drawerWrapper) return;

  const overlayOpen = activeDrawer !== null;
  activeDrawer = kind;
  setDrawerButtons(kind);
  showDrawerPanel(kind);
  notificationBarBox?.classList.add("is-none");
  document.body.classList.add("is-scroll-locked");

  if (overlayOpen) return;

  drawerWrapper.style.display = "grid";
  void drawerWrapper.offsetHeight;
  drawerWrapper.classList.add("is-visible");
  mainWrapper?.classList.add("is-dimmed");
}

/** closeDrawer — fade overlay out, then hideDrawerOverlay */
function closeDrawer(event) {
  event.preventDefault();
  if (activeDrawer === null) return;

  activeDrawer = null;
  setDrawerButtons(null);
  drawerWrapper?.classList.remove("is-visible");
  mainWrapper?.classList.remove("is-dimmed");
  if (notificationBarBox?.querySelector(".notification-item")) {
    notificationBarBox.classList.remove("is-none");
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion || !drawerWrapper) {
    hideDrawerOverlay();
    return;
  }

  drawerWrapper.addEventListener("transitionend", function onFadeOut(event) {
    if (event.target !== drawerWrapper || event.propertyName !== "opacity") {
      return;
    }
    drawerWrapper.removeEventListener("transitionend", onFadeOut);
    hideDrawerOverlay();
  });
}

/** onDrawerBackdrop — empty grid cells of .drawer-wrapper close the overlay */
function onDrawerBackdrop(event) {
  if (event.target === drawerWrapper) closeDrawer(event);
}

menuOpen?.addEventListener("click", (event) => openDrawer("menu", event));
cartOpen?.addEventListener("click", (event) => openDrawer("cart", event));
menuClose?.addEventListener("click", closeDrawer);
cartClose?.addEventListener("click", closeDrawer);
drawerWrapper?.addEventListener("click", onDrawerBackdrop);
