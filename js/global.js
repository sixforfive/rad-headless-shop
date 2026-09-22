/**
 * global.js — Site-wide behavior shared across all RAD pages.
 * setFavicon — tab icon follows prefers-color-scheme (light PNG / dark PNG)
 * applyLights — .dark-mode on html/body, rad-lights in localStorage, plus/minus is-none
 * storedLightsDark — true only when rad-lights is exactly "dark"
 * scrollToTop — #back-to-top click → radScrollToTop (slower Lenis, or instant if reduced-motion)
 * setDrawerButtons — is-none on open/close plus lights, cart-title, currency; is-normal on .navbar
 * showDrawerPanel — display:flex on the active drawer, none on the other
 * hideDrawerOverlay — display:none on wrapper and both drawers, unlock scroll
 * openDrawer — fade overlay in, or swap panel if the other is already open; is-hidden on notification
 * closeDrawer — fade overlay out, then hideDrawerOverlay; remove is-hidden on notification
 * hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item
 * setMarqueeRate — playbackRate on .notification-item (30/45 hover, 1 leave)
 * onDrawerBackdrop — close when the click target is .drawer-wrapper itself
 * pagePointerId — pathname first segment → #pointer-* id (domain ignored)
 * syncMenuPointer — drop is-none on the matching .menu-drawer .menu-pointer
 * initCursorLabel — one .text-meta label rubber-follows [custom-cursor] on fine pointers
 */

const FAVICON_LIGHT =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a8ad061ef4915729a2a15d5_daa2da18df75b26e9f2a004232412d6e_dot_light_circ.png";
const FAVICON_DARK =
  "https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a8ad061d2c1d2f8d77a0764_1d115c56170321aa050c455a32f3cb8a_dot_dark_circ.png";

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
const lightsPlus = lightsSwitchBtn?.querySelector(".meta-link.is-plus");
const lightsMinus = lightsSwitchBtn?.querySelector(".meta-link.is-minus");

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

/** scrollToTop — #back-to-top click → nested gallery or window; slower Lenis duration */
function scrollToTop(event) {
  event.preventDefault();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (typeof radScrollToTop === "function") {
    radScrollToTop(
      reduceMotion ? { immediate: true } : { duration: 1.4 },
    );
    return;
  }
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

document.getElementById("back-to-top")?.addEventListener("click", scrollToTop);

const drawerWrapper = document.querySelector(".drawer-wrapper");
const menuDrawer = document.querySelector(".menu-drawer");
const cartDrawer = document.querySelector(".cart-drawer");
const mainWrapper = document.querySelector(".main-wrapper");
const dimGallery = document.querySelector(".gallery-full-screen");
const notificationBarBox = document.querySelector(".notification-bar-box");
const menuOpen = document.getElementById("menu-open");
const menuClose = document.getElementById("menu-close");
const cartOpen = document.getElementById("cart-open");
const cartClose = document.getElementById("cart-close");
const cartTitle = document.getElementById("cart-title");
const currencyBtn = document.getElementById("currency-btn");
const navbar = document.querySelector(".navbar");

let activeDrawer = null;

/** hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item */
function hideNotificationIfEmpty() {
  if (!notificationBarBox) return;
  if (!notificationBarBox.querySelector(".notification-item")) {
    notificationBarBox.classList.add("is-none");
  }
}

hideNotificationIfEmpty();

/** setMarqueeRate — playbackRate on .notification-item (30/45 hover, 1 leave) */
function setMarqueeRate(rate) {
  const item = notificationBarBox?.querySelector(".notification-item");
  item?.getAnimations().forEach((animation) => {
    if (animation.animationName === "notification-marquee") {
      animation.playbackRate = rate;
    }
  });
}

const notificationHolder = document.querySelector(".notification-holder");
notificationHolder?.addEventListener("mouseenter", () =>
  setMarqueeRate(30 / 60),
);
notificationHolder?.addEventListener("mouseleave", () => setMarqueeRate(1));

/** setDrawerButtons — is-none on open/close plus lights, cart-title, currency; is-normal on .navbar */
function setDrawerButtons(kind) {
  const drawerOpen = kind !== null;
  menuOpen?.classList.toggle("is-none", drawerOpen);
  menuClose?.classList.toggle("is-none", kind !== "menu");
  cartOpen?.classList.toggle("is-none", drawerOpen);
  cartClose?.classList.toggle("is-none", kind !== "cart");
  lightsSwitchBtn?.classList.toggle("is-none", drawerOpen);
  cartTitle?.classList.toggle("is-none", kind !== "cart");
  currencyBtn?.classList.toggle("is-none", kind !== "cart");
  navbar?.classList.toggle("is-normal", drawerOpen);
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
  if (typeof radLenisStart === "function") radLenisStart();
}

/** openDrawer — kind is "menu" | "cart"; swap if the other is already open */
function openDrawer(kind, event) {
  event.preventDefault();
  if (!drawerWrapper) return;

  const overlayOpen = activeDrawer !== null;
  activeDrawer = kind;
  setDrawerButtons(kind);
  showDrawerPanel(kind);
  notificationBarBox?.classList.add("is-hidden");
  document.body.classList.add("is-scroll-locked");
  if (typeof radLenisStop === "function") radLenisStop();

  if (overlayOpen) return;

  drawerWrapper.style.display = "grid";
  void drawerWrapper.offsetHeight;
  drawerWrapper.classList.add("is-visible");
  mainWrapper?.classList.add("is-dimmed");
  dimGallery?.classList.add("is-dimmed");
}

/** closeDrawer — fade overlay out, then hideDrawerOverlay */
function closeDrawer(event) {
  event.preventDefault();
  if (activeDrawer === null) return;

  activeDrawer = null;
  setDrawerButtons(null);
  drawerWrapper?.classList.remove("is-visible");
  mainWrapper?.classList.remove("is-dimmed");
  dimGallery?.classList.remove("is-dimmed");
  notificationBarBox?.classList.remove("is-hidden");

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
document
  .getElementById("keep-shopping")
  ?.addEventListener("click", closeDrawer);
drawerWrapper?.addEventListener("click", onDrawerBackdrop);

const PAGE_POINTER_IDS = {
  "": "pointer-collection",
  collection: "pointer-collection",
  shop: "pointer-shop",
  merch: "pointer-merch",
  faq: "pointer-faq",
};

/** pagePointerId — pathname first segment → #pointer-* id; domain ignored */
function pagePointerId() {
  const segment = location.pathname.replace(/\/+$/, "").split("/")[1] || "";
  return PAGE_POINTER_IDS[segment] || null;
}

/** syncMenuPointer — drop is-none on the matching .menu-drawer .menu-pointer */
function syncMenuPointer() {
  const activeId = pagePointerId();
  document
    .querySelectorAll(".menu-drawer .menu-list .menu-pointer")
    .forEach((el) => {
      el.classList.toggle("is-none", el.id !== activeId);
    });
}

syncMenuPointer();

const CURSOR_LABEL_OFFSET_X = 16;
const CURSOR_LABEL_OFFSET_Y = 20;
const CURSOR_LABEL_LERP = 0.125;

/** initCursorLabel — one .text-meta label rubber-follows [custom-cursor] on fine pointers */
function initCursorLabel() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const label = document.createElement("div");
  label.className = "custom-cursor-label text-meta";
  document.body.appendChild(label);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hasPointer = false;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function applyTransform() {
    label.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  function applyLabel() {
    if (!hasPointer) return;
    const el = document.elementFromPoint(pointerX, pointerY);
    const node =
      el instanceof Element ? el.closest("[custom-cursor]") : null;
    const text = node?.getAttribute("custom-cursor")?.trim() ?? "";
    const show = text.length > 0;
    const wasVisible = label.classList.contains("is-visible");

    if (show) {
      label.textContent = text;
      if (!wasVisible) {
        currentX = targetX;
        currentY = targetY;
        applyTransform();
      }
    }
    label.classList.toggle("is-visible", show);
  }

  function onPointerMove(event) {
    hasPointer = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    targetX = pointerX + CURSOR_LABEL_OFFSET_X;
    targetY = pointerY + CURSOR_LABEL_OFFSET_Y;
    applyLabel();
  }

  function tick() {
    const factor = reduceMotion.matches ? 1 : CURSOR_LABEL_LERP;
    currentX += (targetX - currentX) * factor;
    currentY += (targetY - currentY) * factor;
    applyTransform();
    applyLabel();
    requestAnimationFrame(tick);
  }

  document.addEventListener("pointermove", onPointerMove);
  document.addEventListener("scroll", applyLabel, true);
  requestAnimationFrame(tick);
}

initCursorLabel();
