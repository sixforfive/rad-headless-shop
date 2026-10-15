/**
 * global.js — Site-wide behavior shared across all RAD pages.
 * setFavicon — tab icon follows prefers-color-scheme (light PNG / dark PNG)
 * applyLights — .dark-mode on html/body, rad-lights in localStorage, plus/minus is-none
 * storedLightsDark — true only when rad-lights is exactly "dark"
 * scrollToTop — #back-to-top click → radScrollToTop (700ms enter spring, or instant if reduced-motion)
 * setDrawerButtons — is-none on open/close plus lights, cart-title, currency; is-normal on .navbar
 * showDrawerPanel — display:flex on the active drawer, none on the other
 * hideDrawerOverlay — display:none on wrapper and both drawers, unlock scroll
 * openDrawer — fade overlay in, or swap panel if the other is already open; is-hidden on notification
 * closeDrawer — fade overlay out, then hideDrawerOverlay; remove is-hidden on notification
 * parseMenuReveal — menu-reveal value → { order, stagger, dir } or null
 * markMenuRevealFade — is-fade and is-from-up/down on order greater than 2
 * writeMenuRevealTiming — order 1 lines from the bottom, then order 2, then both order 3; reverse leaves 3 first
 * menuRevealReverseMs — length of the close stages, in ms
 * clearMenuRevealHide — drop a pending shell fade
 * fadeDrawerOut — drop is-visible, then hide after the blur transition
 * splitMenuRevealLines — nowrap rows for orders 1 and 2; rebuild when width changes
 * playMenuReveal — opening flushes the from-state then adds is-revealed; closing removes it
 * hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item
 * setMarqueeRate — playbackRate on .notification-item (30/45 hover, 1 leave)
 * onDrawerBackdrop — close when the click target is .drawer-wrapper itself
 * pagePointerId — pathname first segment → #pointer-* id (domain ignored)
 * syncMenuPointer — drop is-none on the matching .menu-drawer .menu-pointer
 * initCursorLabel — two labels rubber-follow [custom-cursor]; copy fades out then in; 12px difference dot replaces pointer
 * revealPage — add html.is-ready after the hidden state is on screen
 * radPageReady — page scripts call this after layout; first paint stays hidden until then
 * resetDrawerState — bfcache restore: no drawer, no dim, scroll unlocked
 * radLeaveTo — sink content, keep the drawer, prefetch, then go
 * radMenuLeaveTo — menu reverses, page fades under the drawer, then the drawer fades, then go
 * interceptPageClicks — same-origin links run radLeaveTo; open-menu links run radMenuLeaveTo
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

/** scrollToTop — #back-to-top click → radScrollToTop, or instant if reduced-motion */
function scrollToTop(event) {
  event.preventDefault();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (typeof radScrollToTop === "function") {
    if (reduceMotion) radScrollToTop({ immediate: true });
    else radScrollToTop();
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

const MENU_REVEAL_DURATION = 1.47;
const MENU_REVEAL_ORDER3_DURATION = 0.3;
const MENU_REVEAL_LINE_STEP = 0.07;
const MENU_LEAVE_TAIL_MS = 600;

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

/** markMenuRevealFade — is-fade and is-from-up/down on order greater than 2 */
function markMenuRevealFade() {
  menuRevealEntries().forEach(({ el, parsed }) => {
    const fromSide = parsed.order > 2;
    el.classList.toggle("is-fade", fromSide);
    el.classList.toggle("is-from-up", fromSide && parsed.dir === "up");
    el.classList.toggle("is-from-down", fromSide && parsed.dir === "down");
  });
}

/** setRevealTiming — write the delay and duration used by the reveal transition */
function setRevealTiming(el, delay, duration) {
  el.style.setProperty("--menu-reveal-delay", `${delay}s`);
  el.style.setProperty("--menu-reveal-duration", `${duration}s`);
}

/** revealStageLength — delay until the last line of a stage begins */
function revealStageLength(count) {
  if (count <= 0) return 0;
  return (count - 1) * MENU_REVEAL_LINE_STEP;
}

/** lineCountForOrder — longest split row count among nodes of that order */
function lineCountForOrder(entries, order) {
  const counts = entries
    .filter((entry) => entry.parsed.order === order)
    .map(
      (entry) => entry.el.querySelectorAll(".menu-reveal-line-inner").length,
    );
  return counts.length ? Math.max(...counts) : 0;
}

/** writeMenuRevealTiming — order 1 lines, then order 2 lines, then both order 3; reverse leaves 3 first */
function writeMenuRevealTiming(opening) {
  const entries = menuRevealEntries();
  if (entries.length === 0) return;
  const order1 = revealStageLength(lineCountForOrder(entries, 1));
  const order2 = revealStageLength(lineCountForOrder(entries, 2));
  const openStart = { 1: 0, 2: order1, 3: order1 + order2 + 0.5 };
  const closeStart = { 3: 0, 2: 0, 1: order2 };
  entries.forEach(({ el, parsed }) => {
    const stageStart = (opening ? openStart : closeStart)[parsed.order] ?? 0;
    if (parsed.order > 2) {
      setRevealTiming(el, stageStart, MENU_REVEAL_ORDER3_DURATION);
      return;
    }
    const inners = [...el.querySelectorAll(".menu-reveal-line-inner")];
    inners.forEach((inner, index) => {
      const lineIndex = opening ? inners.length - 1 - index : index;
      setRevealTiming(
        inner,
        stageStart + lineIndex * MENU_REVEAL_LINE_STEP,
        MENU_REVEAL_DURATION,
      );
    });
  });
}

/** splitRevealNode — nowrap rows measured against clientWidth; no-op when width is unchanged */
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
  const text = (el.getAttribute("data-reveal-text") ?? el.textContent)
    .replace(/\s+/g, " ")
    .trim();
  el.setAttribute("data-reveal-text", text);
  const words = text.split(" ").filter(Boolean);
  const probe = document.createElement("span");
  probe.style.whiteSpace = "nowrap";
  probe.style.visibility = "hidden";
  probe.style.position = "absolute";
  el.replaceChildren(probe);
  const lines = [];
  let current = [];
  words.forEach((word) => {
    probe.textContent = [...current, word].join(" ");
    if (probe.offsetWidth > width && current.length) {
      lines.push(current.join(" "));
      current = [word];
    } else {
      current.push(word);
    }
  });
  if (current.length) lines.push(current.join(" "));
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

/** splitMenuRevealLines — nowrap rows for orders 1 and 2; rebuild when width changes */
function splitMenuRevealLines() {
  if (!menuDrawer || menuDrawer.style.display === "none") return;
  menuRevealEntries().forEach(({ el, parsed }) => {
    if (parsed.order <= 2) splitRevealNode(el);
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

let menuRevealHideTimer = 0;

/** menuRevealReverseMs — length of the close stages, in ms */
function menuRevealReverseMs() {
  const entries = menuRevealEntries();
  const order1 = revealStageLength(lineCountForOrder(entries, 1));
  const order2 = revealStageLength(lineCountForOrder(entries, 2));
  return (order1 + order2 + MENU_REVEAL_DURATION) * 1000;
}

/** clearMenuRevealHide — drop a pending shell fade */
function clearMenuRevealHide() {
  if (!menuRevealHideTimer) return;
  clearTimeout(menuRevealHideTimer);
  menuRevealHideTimer = 0;
}

/** fadeDrawerOut — drop is-visible, then hide after the blur transition */
function fadeDrawerOut() {
  drawerWrapper?.classList.remove("is-visible");
  mainWrapper?.classList.remove("is-dimmed");
  dimGallery?.classList.remove("is-dimmed");
  notificationBarBox?.classList.remove("is-hidden");
  if (prefersReducedMotion() || !drawerWrapper) {
    hideDrawerOverlay();
    return;
  }
  drawerWrapper.addEventListener("transitionend", function onFadeOut(event) {
    if (event.target !== drawerWrapper) return;
    if (
      event.propertyName !== "backdrop-filter" &&
      event.propertyName !== "-webkit-backdrop-filter"
    ) {
      return;
    }
    drawerWrapper.removeEventListener("transitionend", onFadeOut);
    hideDrawerOverlay();
  });
}

/** openDrawer — kind is "menu" | "cart"; swap if the other is already open */
function openDrawer(kind, event) {
  event.preventDefault();
  if (!drawerWrapper) return;

  clearMenuRevealHide();
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

/** closeDrawer — menu reverse finishes, then the overlay fades; cart fades immediately */
function closeDrawer(event) {
  event.preventDefault();
  if (activeDrawer === null) return;

  const closingMenu = activeDrawer === "menu";
  if (closingMenu) playMenuReveal(false);
  activeDrawer = null;
  setDrawerButtons(null);
  if (closingMenu && !prefersReducedMotion()) {
    clearMenuRevealHide();
    menuRevealHideTimer = setTimeout(() => {
      menuRevealHideTimer = 0;
      if (activeDrawer !== null) return;
      fadeDrawerOut();
    }, menuRevealReverseMs() - MENU_LEAVE_TAIL_MS);
    return;
  }
  fadeDrawerOut();
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

/** initCursorLabel — two labels rubber-follow [custom-cursor]; copy fades out then in; 12px difference dot replaces pointer */
function initCursorLabel() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const labels = [0, 1].map(() => {
    const label = document.createElement("div");
    label.className = "custom-cursor-label text-meta";
    document.body.appendChild(label);
    return label;
  });

  const dot = document.createElement("div");
  dot.className = "custom-cursor-dot";
  document.body.appendChild(dot);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;
  let hasPointer = false;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function applyTransform() {
    const transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    labels[0].style.transform = transform;
    labels[1].style.transform = transform;
  }

  function clearLabelModes(label) {
    label.classList.remove("is-visible", "is-in", "is-out");
  }

  /** applyCopy — enter/leave on .is-visible; string change hands off .is-out then .is-in */
  function applyCopy(text, show) {
    const incoming = labels.find((label) => label.classList.contains("is-in"));
    const active =
      incoming ||
      labels.find((label) => label.classList.contains("is-visible"));

    if (!show) {
      labels.forEach(clearLabelModes);
      return false;
    }

    if (reduceMotion.matches) {
      const label = active || labels[0];
      label.textContent = text;
      labels.forEach((node) => {
        if (node === label) {
          node.classList.remove("is-in", "is-out");
          node.classList.add("is-visible");
        } else {
          clearLabelModes(node);
        }
      });
      return !active;
    }

    if (incoming?.textContent === text) return false;
    if (!incoming && active?.textContent === text) return false;

    if (!active) {
      labels[0].textContent = text;
      labels[0].classList.remove("is-in", "is-out");
      labels[0].classList.add("is-visible");
      return true;
    }

    const nodeOut = incoming || active;
    const nodeIn = labels.find((label) => label !== nodeOut);
    nodeOut.classList.remove("is-visible", "is-in");
    nodeOut.classList.add("is-out");
    nodeIn.textContent = text;
    nodeIn.classList.remove("is-visible", "is-out");
    nodeIn.classList.add("is-in");
    return false;
  }

  function applyLabel() {
    if (!hasPointer) return;
    root.classList.remove("is-dot-cursor");
    const el = document.elementFromPoint(pointerX, pointerY);
    const showDot =
      el instanceof Element && getComputedStyle(el).cursor === "pointer";
    root.classList.toggle("is-dot-cursor", showDot);
    dot.classList.toggle("is-visible", showDot);
    dot.style.transform = `translate3d(${pointerX - 6}px, ${pointerY - 6}px, 0)`;

    const node = el instanceof Element ? el.closest("[custom-cursor]") : null;
    const text = node?.getAttribute("custom-cursor")?.trim() ?? "";
    const entered = applyCopy(text, text.length > 0);
    if (entered) {
      currentX = targetX;
      currentY = targetY;
      applyTransform();
    }
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

/** revealPage — add html.is-ready after the hidden state is on screen */
function revealPage() {
  if (pageRevealed) return;
  pageRevealed = true;
  const root = document.documentElement;
  let armed = false;

  const arm = () => {
    if (armed) return;
    armed = true;
    void root.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add("is-ready");
      });
    });
  };

  const fromStateOn = () => {
    const logo = document.querySelector(".collection-hero-logo");
    if (logo) return parseFloat(getComputedStyle(logo).opacity) === 0;
    const wrapper = document.querySelector(".main-wrapper");
    if (!wrapper) return true;
    return parseFloat(getComputedStyle(wrapper).opacity) === 0;
  };

  const tryArm = () => {
    if (armed || document.visibilityState === "hidden") return;
    if (!fromStateOn()) return;
    const home = !!document.querySelector(".collection-hero-logo");
    if (!home && document.readyState !== "complete") return;
    arm();
  };

  tryArm();
  if (armed) return;
  document.addEventListener("visibilitychange", tryArm);
  window.addEventListener("load", tryArm);
  const poll = () => {
    if (armed) return;
    tryArm();
    if (!armed) requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
  setTimeout(arm, 2000);
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

/** resetDrawerState — bfcache restore: no drawer, no dim, scroll unlocked */
function resetDrawerState() {
  clearMenuRevealHide();
  activeDrawer = null;
  setDrawerButtons(null);
  drawerWrapper?.classList.remove("is-visible");
  mainWrapper?.classList.remove("is-dimmed");
  dimGallery?.classList.remove("is-dimmed");
  notificationBarBox?.classList.remove("is-hidden");
  menuDrawer?.classList.remove("is-revealed");
  hideDrawerOverlay();
}

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  resetDrawerState();
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
    if (url.pathname === location.pathname && url.search === location.search) {
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

/** radMenuLeaveTo — menu reverses, page fades under the drawer, then the drawer fades, then assign */
function radMenuLeaveTo(href) {
  if (!href || pageLeaving) return;
  pageLeaving = true;
  prefetchHref(href);
  activeDrawer = null;
  setDrawerButtons(null);
  if (prefersReducedMotion()) {
    location.href = href;
    return;
  }
  clearMenuRevealHide();
  playMenuReveal(false);
  const lineGone = menuRevealReverseMs() - MENU_LEAVE_TAIL_MS;
  setTimeout(
    () => {
      document.documentElement.classList.add("is-leaving");
    },
    Math.max(0, lineGone - PAGE_LEAVE_MS),
  );
  setTimeout(() => {
    drawerWrapper?.classList.remove("is-visible");
    setTimeout(() => {
      hideDrawerOverlay();
      location.href = href;
    }, PAGE_LEAVE_MS);
  }, lineGone);
}

/** interceptPageClicks — same-origin page links leave, then go; open-menu links run radMenuLeaveTo */
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
    radMenuLeaveTo(href);
    return;
  }
  radLeaveTo(href);
}

document.addEventListener("click", interceptPageClicks);
document.addEventListener(
  "pointerenter",
  (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || SKIP_LEAVE_IDS.has(anchor.id)) return;
    const href = navHref(anchor);
    if (href) prefetchHref(href);
  },
  true,
);
