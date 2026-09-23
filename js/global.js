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
 * parseMenuReveal — menu-reveal value → { order, stagger, dir } or null
 * markMenuRevealFade — is-fade on [menu-reveal] when order is greater than 2
 * writeMenuRevealTiming — delay and duration custom props; reverse flips order and line index
 * splitMenuRevealLines — mask each wrapped line of a stagger node; rebuild when width changes
 * playMenuReveal — opening flushes the from-state then adds is-revealed; closing removes it
 * hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item
 * setMarqueeRate — playbackRate on .notification-item (30/45 hover, 1 leave)
 * onDrawerBackdrop — close when the click target is .drawer-wrapper itself
 * pagePointerId — pathname first segment → #pointer-* id (domain ignored)
 * syncMenuPointer — drop is-none on the matching .menu-drawer .menu-pointer
 * initCursorLabel — one .text-meta label rubber-follows [custom-cursor] on fine pointers
 * revealPage — add html.is-ready on the next frame so the rise can paint
 * radPageReady — page scripts call this after layout; first paint stays hidden until then
 * radLeaveTo — sink content, keep the drawer, prefetch, then go
 * interceptPageClicks — same-origin links run radLeaveTo instead of a raw navigation
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

const MENU_REVEAL_TOTAL = 0.45;
const MENU_REVEAL_STEP = 0.06;
const MENU_REVEAL_LINE_STEP = 0.03;

/** prefersReducedMotion — true when the visitor asks for less motion */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** parseMenuReveal — menu-reveal value → { order, stagger, dir } or null */
function parseMenuReveal(value) {
  const match = /^(\d+)(-stagger)?-(up|down)$/.exec(value || "");
  if (!match) return null;
  return {
    order: Number(match[1]),
    stagger: match[2] === "-stagger",
    dir: match[3],
  };
}

/** menuRevealEntries — parsed [menu-reveal] nodes inside .menu-drawer */
function menuRevealEntries() {
  if (!menuDrawer) return [];
  return [...menuDrawer.querySelectorAll("[menu-reveal]")]
    .map((el) => ({
      el,
      parsed: parseMenuReveal(el.getAttribute("menu-reveal")),
    }))
    .filter((entry) => entry.parsed);
}

/** markMenuRevealFade — is-fade on [menu-reveal] when order is greater than 2 */
function markMenuRevealFade() {
  menuRevealEntries().forEach(({ el, parsed }) => {
    el.classList.toggle("is-fade", parsed.order > 2);
  });
}

/** setRevealTiming — write the delay and duration used by the reveal transition */
function setRevealTiming(el, delay, duration) {
  el.style.setProperty("--menu-reveal-delay", `${delay}s`);
  el.style.setProperty("--menu-reveal-duration", `${duration}s`);
}

/** lineRevealTiming — step and duration so the last line ends at 0.45s */
function lineRevealTiming(groupDelay, duration, count) {
  let lineStep = MENU_REVEAL_LINE_STEP;
  let lineDuration = duration;
  if (count > 1) {
    const end = groupDelay + (count - 1) * lineStep + lineDuration;
    if (end > MENU_REVEAL_TOTAL) {
      const room = MENU_REVEAL_TOTAL - groupDelay - lineDuration;
      if (room > 0) lineStep = room / (count - 1);
      else {
        lineStep = 0;
        lineDuration = Math.max(0, MENU_REVEAL_TOTAL - groupDelay);
      }
    }
  }
  return { lineStep, lineDuration };
}

/** writeMenuRevealTiming — delay and duration custom props; reverse flips order and line index */
function writeMenuRevealTiming(opening) {
  const entries = menuRevealEntries();
  if (entries.length === 0) return;
  const maxOrder = Math.max(...entries.map((entry) => entry.parsed.order));
  const duration = MENU_REVEAL_TOTAL - (maxOrder - 1) * MENU_REVEAL_STEP;
  entries.forEach(({ el, parsed }) => {
    const groupDelay = opening
      ? (parsed.order - 1) * MENU_REVEAL_STEP
      : (maxOrder - parsed.order) * MENU_REVEAL_STEP;
    setRevealTiming(el, groupDelay, duration);
    if (!parsed.stagger) return;
    const inners = [...el.querySelectorAll(".menu-reveal-line-inner")];
    const { lineStep, lineDuration } = lineRevealTiming(
      groupDelay,
      duration,
      inners.length,
    );
    inners.forEach((inner, index) => {
      const lineIndex = opening ? index : inners.length - 1 - index;
      setRevealTiming(inner, groupDelay + lineIndex * lineStep, lineDuration);
    });
  });
}

/** splitRevealNode — wrap each measured line; no-op when width is unchanged */
function splitRevealNode(el) {
  const width = el.clientWidth;
  if (!width) return;
  const widthKey = String(width);
  if (
    el.getAttribute("data-reveal-width") === widthKey &&
    el.querySelector(".menu-reveal-line")
  ) {
    return;
  }
  const text = el.getAttribute("data-reveal-text") ?? el.textContent;
  el.setAttribute("data-reveal-text", text);
  const pieces = text.split(/(\s+)/).map((piece) => {
    const span = document.createElement("span");
    span.textContent = piece;
    return span;
  });
  el.replaceChildren(...pieces);
  const lines = [];
  let current = [];
  let top = null;
  pieces.forEach((span) => {
    if (!span.textContent) return;
    const spanTop = span.offsetTop;
    if (top !== null && spanTop - top > 1) {
      lines.push(current.join(""));
      current = [];
    }
    top = spanTop;
    current.push(span.textContent);
  });
  if (current.length) lines.push(current.join(""));
  el.replaceChildren(
    ...lines.map((lineText) => {
      const mask = document.createElement("span");
      mask.className = "menu-reveal-line";
      const inner = document.createElement("span");
      inner.className = "menu-reveal-line-inner";
      inner.textContent = lineText;
      mask.appendChild(inner);
      return mask;
    }),
  );
  el.setAttribute("data-reveal-width", widthKey);
}

/** splitMenuRevealLines — mask each wrapped line of a stagger node; rebuild when width changes */
function splitMenuRevealLines() {
  if (!menuDrawer || menuDrawer.style.display === "none") return;
  menuRevealEntries().forEach(({ el, parsed }) => {
    if (parsed.stagger) splitRevealNode(el);
  });
}

/** playMenuReveal — opening flushes the from-state then adds is-revealed; closing removes it */
function playMenuReveal(opening) {
  if (!menuDrawer) return;
  if (opening) {
    if (!prefersReducedMotion()) splitMenuRevealLines();
    if (!prefersReducedMotion()) writeMenuRevealTiming(true);
    void menuDrawer.offsetWidth;
    menuDrawer.classList.add("is-revealed");
    return;
  }
  if (!prefersReducedMotion()) writeMenuRevealTiming(false);
  menuDrawer.classList.remove("is-revealed");
}

window.addEventListener("resize", () => {
  if (activeDrawer !== "menu" || prefersReducedMotion()) return;
  splitMenuRevealLines();
});

/** hideDrawerOverlay — display none after fade-out; no-op if a drawer reopened mid-fade */
function hideDrawerOverlay() {
  if (activeDrawer !== null) return;
  if (drawerWrapper) drawerWrapper.style.display = "none";
  if (menuDrawer) menuDrawer.style.display = "none";
  if (cartDrawer) cartDrawer.style.display = "none";
  menuDrawer?.removeAttribute("data-lenis-prevent");
  cartDrawer?.removeAttribute("data-lenis-prevent");
  document.body.classList.remove("is-scroll-locked");
  if (typeof radLenisStart === "function") radLenisStart();
}

/** openDrawer — kind is "menu" | "cart"; swap if the other is already open */
function openDrawer(kind, event) {
  event.preventDefault();
  if (!drawerWrapper) return;

  const overlayOpen = activeDrawer !== null;
  const openingMenu = kind === "menu" && menuDrawer;
  if (openingMenu) {
    menuDrawer.classList.remove("is-revealed");
    markMenuRevealFade();
  }
  activeDrawer = kind;
  setDrawerButtons(kind);
  showDrawerPanel(kind);
  const show = kind === "menu" ? menuDrawer : cartDrawer;
  const hide = kind === "menu" ? cartDrawer : menuDrawer;
  hide?.removeAttribute("data-lenis-prevent");
  show?.setAttribute("data-lenis-prevent", "");
  notificationBarBox?.classList.add("is-hidden");
  document.body.classList.add("is-scroll-locked");
  if (typeof radLenisStop === "function") radLenisStop();

  if (!overlayOpen) drawerWrapper.style.display = "grid";
  if (openingMenu) playMenuReveal(true);
  if (overlayOpen) return;

  void drawerWrapper.offsetHeight;
  drawerWrapper.classList.add("is-visible");
  mainWrapper?.classList.add("is-dimmed");
  dimGallery?.classList.add("is-dimmed");
}

/** closeDrawer — fade overlay out, then hideDrawerOverlay */
function closeDrawer(event) {
  event.preventDefault();
  if (activeDrawer === null) return;

  if (activeDrawer === "menu") playMenuReveal(false);
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

const PAGE_LEAVE_MS = 450;
const PAGE_HOLD_MS = 350;
const SKIP_LEAVE_IDS = new Set([
  "menu-open",
  "menu-close",
  "cart-open",
  "cart-close",
  "back-to-top",
  "keep-shopping",
  "full-screen-open",
  "full-screen-close",
  "currency-btn",
  "lights-switch-btn",
  "checkout-btn",
  "download-spec",
]);

let pageRevealed = false;
let pageLeaving = false;
const prefetchedHrefs = new Set();

/** revealPage — add html.is-ready on the next frame so the rise can paint */
function revealPage() {
  if (pageRevealed) return;
  pageRevealed = true;
  requestAnimationFrame(() => {
    document.documentElement.classList.add("is-ready");
  });
}

/** radPageReady — layout scripts call this; global.js also exposes it on window */
function radPageReady() {
  revealPage();
}
window.radPageReady = radPageReady;
if (window.radPageReadyFired) revealPage();

document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    if (window.radPageReadyFired) return;
    const needsLayout =
      document.querySelector(".product-list .product-thumb") ||
      document.querySelector(".collection-hero-gallery");
    if (!needsLayout) revealPage();
  });
});
setTimeout(revealPage, 2000);
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  pageLeaving = false;
  document.documentElement.classList.remove("is-leaving");
  document.documentElement.classList.add("is-ready");
  pageRevealed = true;
});

/** prefetchHref — warm the next document during the leave */
function prefetchHref(href) {
  if (prefetchedHrefs.has(href)) return;
  prefetchedHrefs.add(href);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/** navHref — same-origin page URL, or empty for hash / external / non-http */
function navHref(anchor) {
  if (!anchor?.href) return "";
  if (anchor.hasAttribute("download")) return "";
  if (anchor.target && anchor.target !== "" && anchor.target !== "_self") {
    return "";
  }
  try {
    const url = new URL(anchor.href, location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    if (url.origin !== location.origin) return "";
    if (
      url.pathname === location.pathname &&
      url.search === location.search
    ) {
      return "";
    }
    return url.href;
  } catch (e) {
    return "";
  }
}

/** radLeaveTo — sink content, keep the drawer, prefetch, then assign */
function radLeaveTo(href) {
  if (!href || pageLeaving) return;
  pageLeaving = true;
  prefetchHref(href);
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) {
    location.href = href;
    return;
  }
  document.documentElement.classList.add("is-leaving");
  setTimeout(() => {
    location.href = href;
  }, PAGE_LEAVE_MS + PAGE_HOLD_MS);
}
window.radLeaveTo = radLeaveTo;

/** interceptPageClicks — same-origin page links leave, then go */
function interceptPageClicks(event) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest?.("a[href]");
  if (!anchor) return;
  if (SKIP_LEAVE_IDS.has(anchor.id)) return;
  if (anchor.closest("[data-add-to-cart], [data-cart-remove]")) return;
  const href = navHref(anchor);
  if (!href) return;
  event.preventDefault();
  if (anchor.closest(".menu-drawer") && activeDrawer === "menu") {
    playMenuReveal(false);
  }
  radLeaveTo(href);
}

document.addEventListener("click", interceptPageClicks);
document.addEventListener("pointerenter", (event) => {
  const anchor = event.target.closest?.("a[href]");
  if (!anchor || SKIP_LEAVE_IDS.has(anchor.id)) return;
  const href = navHref(anchor);
  if (href) prefetchHref(href);
}, true);
