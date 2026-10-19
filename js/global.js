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
 * closeDrawer — menu or cart reverse, then fade the overlay; empty cart fades its copy first
 * parseMenuReveal — menu-reveal value → { order, stagger, dir } or null
 * markMenuRevealFade — is-fade and is-from-up/down on order greater than 2
 * writeMenuRevealTiming — order 1 lines from the bottom, then order 2, then both order 3; reverse leaves 3 first
 * menuRevealReverseMs — length of the close stages, in ms
 * clearMenuRevealHide — drop a pending shell fade
 * fadeDrawerOut — drop is-visible and restore closed chrome, then hide after the veil
 * splitMenuRevealLines — nowrap rows for orders 1 and 2; rebuild when width changes
 * playMenuReveal — opening flushes the from-state, waits DRAWER_OPEN_GAP, then adds is-revealed; closing removes it
 * playCartReveal — cart titles, rows, subtotal, and bottom on the cart clock; empty copy fades after the veil; close reverses them
 * clearEmptyCartFade — drop a pending empty fade and clear inline opacity on .empty-cart
 * fadeEmptyCart — after the last line, wait DRAWER_SHELL, then fade .empty-cart on the empty-open clocks
 * snapCartReveal — rested row heights while .cart-drawer is already revealed, after images load
 * hideNotificationIfEmpty — is-none on .notification-bar-box when no .notification-item
 * setMarqueeRate — playbackRate on .notification-item (30/45 hover, 1 leave)
 * saveNotificationPhase — pagehide writes marquee progress to rad-notification-marquee
 * onDrawerBackdrop — close when the click target is .drawer-wrapper itself
 * pagePointerId — pathname first segment → #pointer-* id (domain ignored)
 * syncMenuPointer — drop is-none on the matching .menu-drawer .menu-pointer
 * initCursorLabel — two labels rubber-follow [custom-cursor]; copy fades out then in; 12px difference dot replaces pointer
 * revealPage — add html.is-ready after --rad-css and the hidden state are on screen
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

/** saveNotificationPhase — pagehide writes marquee progress to rad-notification-marquee */
function saveNotificationPhase() {
  const item = notificationBarBox?.querySelector(".notification-item");
  if (!item) return;
  const width = item.offsetWidth;
  if (!width) return;
  const transform = getComputedStyle(item).transform;
  let x = 0;
  if (transform && transform !== "none") {
    x = new DOMMatrix(transform).m41;
  }
  const p = (((-x / (width / 3)) % 1) + 1) % 1;
  let r = 1;
  item.getAnimations().forEach((animation) => {
    if (animation.animationName === "notification-marquee") {
      r = animation.playbackRate;
    }
  });
  try {
    sessionStorage.setItem(
      "rad-notification-marquee",
      JSON.stringify({ p, at: Date.now(), r }),
    );
  } catch (e) {}
}

window.addEventListener("pagehide", saveNotificationPhase);

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

const MENU_REVEAL_DURATION = 1.5;
const MENU_REVEAL_ORDER3_DURATION = 0.3;
const MENU_REVEAL_LINE_STEP = 0.07;
const MENU_LEAVE_TAIL_MS = 600;
const CART_REVEAL_DURATION = 0.45;
const CART_REVEAL_ORDER3_DURATION = 0.45;
const CART_REVEAL_GAP = 0.3;
const DRAWER_OPEN_GAP = 0.3;
const DRAWER_CLOSE_GAP = 0.3;
const DRAWER_SHELL = 0.45;
const CART_EMPTY_FADE = 0.3;
cartDrawer?.style.setProperty(
  "--cart-row-duration",
  `${CART_REVEAL_DURATION}s`,
);
cartDrawer?.style.setProperty(
  "--cart-title-duration",
  `${CART_REVEAL_ORDER3_DURATION}s`,
);
cartDrawer?.style.setProperty(
  "--cart-empty-duration",
  `${CART_EMPTY_FADE}s`,
);
let cartRevealToken = 0;
let emptyCartFadeToken = 0;
let menuRevealToken = 0;

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
  if (duration == null) return;
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
  const openStart = { 1: 0, 2: order1, 3: order1 + order2 + 0.75 };
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

/** playMenuReveal — opening flushes the from-state, waits DRAWER_OPEN_GAP, then adds is-revealed; closing removes it */
function playMenuReveal(opening) {
  if (!menuDrawer) return;
  menuRevealToken += 1;
  if (opening) {
    const token = menuRevealToken;
    if (!prefersReducedMotion()) splitMenuRevealLines();
    if (!prefersReducedMotion()) writeMenuRevealTiming(true);
    void menuDrawer.offsetWidth;
    const start = () => {
      if (token !== menuRevealToken || activeDrawer !== "menu") return;
      menuDrawer.classList.add("is-revealed");
    };
    if (prefersReducedMotion() || DRAWER_OPEN_GAP <= 0) {
      start();
      return;
    }
    setTimeout(start, DRAWER_OPEN_GAP * 1000);
    return;
  }
  if (!prefersReducedMotion()) writeMenuRevealTiming(false);
  menuDrawer.classList.remove("is-revealed");
}

window.addEventListener("resize", () => {
  if (activeDrawer !== "menu" || prefersReducedMotion()) return;
  splitMenuRevealLines();
});

/** cartProductRows — cloned cart rows, not the template */
function cartProductRows() {
  if (!cartDrawer) return [];
  return [
    ...cartDrawer.querySelectorAll(
      ".cart-product:not([data-cart-line-template])",
    ),
  ];
}

/** cartLineCount — cloned rows in .cart-drawer */
function cartLineCount() {
  return cartProductRows().length;
}

/** wrapRevealTextHost — one masked line around a node's current children */
function wrapRevealTextHost(el) {
  if (!el || el.querySelector(":scope > .menu-reveal-line")) return;
  const line = document.createElement("span");
  line.className = "menu-reveal-line";
  const inner = document.createElement("span");
  inner.className = "menu-reveal-line-inner";
  while (el.firstChild) inner.appendChild(el.firstChild);
  line.appendChild(inner);
  el.appendChild(line);
}

/** wrapRevealElement — mask around the node so its own display stays intact */
function wrapRevealElement(el) {
  if (!el || el.parentElement?.classList.contains("menu-reveal-line-inner")) {
    return;
  }
  const line = document.createElement("span");
  line.className = "menu-reveal-line";
  const inner = document.createElement("span");
  inner.className = "menu-reveal-line-inner";
  el.replaceWith(line);
  inner.appendChild(el);
  line.appendChild(inner);
}

/** wrapCartRevealLines — sku, price, remove, and subtotal texts, once */
function wrapCartRevealLines() {
  if (!cartDrawer) return;
  cartDrawer
    .querySelectorAll(
      ".cart-product:not([data-cart-line-template]) [data-cart-sku], .cart-product:not([data-cart-line-template]) [data-cart-line-price], .cart-summary .text-meta, .cart-summary [data-cart-subtotal]",
    )
    .forEach(wrapRevealTextHost);
  cartDrawer
    .querySelectorAll(
      ".cart-product:not([data-cart-line-template]) [data-cart-remove]",
    )
    .forEach(wrapRevealElement);
}

/** cartRowImageReady — true when the row image already has a natural size */
function cartRowImageReady(img) {
  if (!img || !img.getAttribute("src")) return true;
  return img.complete && img.naturalWidth > 0;
}

/** whenCartRowsReady — resolve once every row image can be measured */
function whenCartRowsReady(rows) {
  const pending = [];
  rows.forEach((row) => {
    const img = row.querySelector(".cart-prod-img_dummy");
    if (cartRowImageReady(img)) return;
    pending.push(
      typeof img.decode === "function"
        ? img.decode().catch(() => {})
        : Promise.resolve(),
    );
  });
  return pending.length ? Promise.all(pending) : null;
}

/** measureCartRow — --cart-row-h with the image at full size and the Webflow padding, then back to height 0 */
function measureCartRow(row) {
  row.style.transition = "none";
  row.style.height = "auto";
  row.style.overflow = "visible";
  row.style.paddingBottom = "var(--_layout---spacing--space-100)";
  const h = row.offsetHeight;
  row.style.height = "";
  row.style.overflow = "";
  row.style.paddingBottom = "";
  void row.offsetWidth;
  row.style.transition = "";
  if (h) row.style.setProperty("--cart-row-h", `${h}px`);
}

/** writeCartRevealTiming — titles, then each row, then subtotal; bottom overlaps the subtotal by 0.375s */
function writeCartRevealTiming(opening) {
  const rows = cartProductRows();
  const n = rows.length;
  const titles = cartDrawer.querySelector(".cart-list-titles");
  const list = cartDrawer.querySelector(".cart-list");
  const summary = cartDrawer.querySelector(".cart-summary");
  const bottom = cartDrawer.querySelector(".cart-bottom");
  const subtotal = [
    ...cartDrawer.querySelectorAll(".cart-summary .menu-reveal-line-inner"),
  ];
  const titleDur = CART_REVEAL_ORDER3_DURATION;
  const subtotalStart = titleDur + n * CART_REVEAL_DURATION;
  if (opening) {
    if (titles) setRevealTiming(titles, 0);
    if (list) setRevealTiming(list, 0);
    if (summary) {
      setRevealTiming(
        summary,
        titleDur + Math.max(0, n - 1) * CART_REVEAL_DURATION,
      );
    }
    rows.forEach((row, i) => {
      const start = titleDur + i * CART_REVEAL_DURATION;
      setRevealTiming(row, start);
      row
        .querySelectorAll(".menu-reveal-line-inner")
        .forEach((el) => setRevealTiming(el, start));
    });
    subtotal.forEach((el) => setRevealTiming(el, subtotalStart));
    if (bottom) setRevealTiming(bottom, subtotalStart + CART_REVEAL_GAP);
    return;
  }
  let t = 0;
  if (bottom) setRevealTiming(bottom, t);
  t += titleDur;
  subtotal.forEach((el) => setRevealTiming(el, t));
  t += CART_REVEAL_DURATION;
  const lastRowStart = t;
  for (let i = n - 1; i >= 0; i -= 1) {
    setRevealTiming(rows[i], t);
    rows[i]
      .querySelectorAll(".menu-reveal-line-inner")
      .forEach((el) => setRevealTiming(el, t));
    t += CART_REVEAL_DURATION;
  }
  if (summary) setRevealTiming(summary, lastRowStart);
  if (list) setRevealTiming(list, t);
  if (titles) setRevealTiming(titles, t);
}

/** cartRevealReverseMs — length of the close stages, in ms */
function cartRevealReverseMs() {
  const n = cartLineCount();
  if (!n) return 0;
  return (
    (CART_REVEAL_ORDER3_DURATION +
      CART_REVEAL_DURATION +
      n * CART_REVEAL_DURATION +
      CART_REVEAL_ORDER3_DURATION) *
    1000
  );
}

/** startCartReveal — measure loaded rows, then add is-revealed */
function startCartReveal() {
  cartProductRows().forEach((row) => measureCartRow(row));
  writeCartRevealTiming(true);
  void cartDrawer.offsetWidth;
  cartDrawer.classList.add("is-revealed");
}

/** clearEmptyCartFade — drop a pending empty fade and clear inline opacity on .empty-cart */
function clearEmptyCartFade() {
  emptyCartFadeToken += 1;
  const empty = document.querySelector(".empty-cart");
  if (!empty) return;
  empty.style.opacity = "";
  empty.style.transition = "";
}

/** fadeEmptyCart — snap .empty-cart to 0, wait DRAWER_SHELL, then let the empty-open fade run */
function fadeEmptyCart() {
  const empty = document.querySelector(".empty-cart");
  if (!empty || !cartDrawer) return;
  emptyCartFadeToken += 1;
  if (prefersReducedMotion()) {
    empty.style.opacity = "";
    empty.style.transition = "";
    return;
  }
  const token = emptyCartFadeToken;
  empty.style.transition = "none";
  empty.style.opacity = "0";
  void empty.offsetWidth;
  empty.style.transition = "";
  const release = () => {
    if (token !== emptyCartFadeToken) return;
    if (!cartDrawer.classList.contains("is-revealed")) return;
    if (cartLineCount()) return;
    empty.style.opacity = "";
  };
  if (DRAWER_SHELL <= 0) {
    release();
    return;
  }
  setTimeout(release, DRAWER_SHELL * 1000);
}

/** playCartReveal — opening flushes the from-state then adds is-revealed; closing removes it */
function playCartReveal(opening) {
  if (!cartDrawer) return;
  cartRevealToken += 1;
  clearEmptyCartFade();
  if (!cartLineCount()) {
    const token = cartRevealToken;
    cartDrawer.classList.remove("is-revealed");
    if (!opening) return;
    const show = () => {
      if (token !== cartRevealToken || activeDrawer !== "cart") return;
      cartDrawer.classList.add("is-revealed");
    };
    if (prefersReducedMotion() || DRAWER_SHELL <= 0) {
      show();
      return;
    }
    setTimeout(show, DRAWER_SHELL * 1000);
    return;
  }
  if (opening) {
    const token = cartRevealToken;
    cartDrawer.classList.remove("is-revealed");
    wrapCartRevealLines();
    if (prefersReducedMotion()) {
      cartDrawer.classList.add("is-revealed");
      return;
    }
    const arm = () => {
      const start = () => {
        if (token !== cartRevealToken || activeDrawer !== "cart") return;
        startCartReveal();
      };
      if (DRAWER_SHELL <= 0) {
        start();
        return;
      }
      setTimeout(start, DRAWER_SHELL * 1000);
    };
    const wait = whenCartRowsReady(cartProductRows());
    if (!wait) {
      arm();
      return;
    }
    wait.then(() => {
      if (token !== cartRevealToken || activeDrawer !== "cart") return;
      arm();
    });
    return;
  }
  if (!prefersReducedMotion()) writeCartRevealTiming(false);
  cartDrawer.classList.remove("is-revealed");
}

/** snapCartReveal — pixel row heights on rows rebuilt while the cart is already open */
function snapCartReveal() {
  if (!cartDrawer?.classList.contains("is-revealed")) return;
  wrapCartRevealLines();
  const token = cartRevealToken;
  const wait = whenCartRowsReady(cartProductRows());
  if (!wait) {
    cartProductRows().forEach((row) => measureCartRow(row));
    return;
  }
  wait.then(() => {
    if (token !== cartRevealToken) return;
    if (!cartDrawer.classList.contains("is-revealed")) return;
    cartProductRows().forEach((row) => measureCartRow(row));
  });
}

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

/** fadeDrawerOut — drop is-visible and restore closed chrome, then hide after the veil */
function fadeDrawerOut() {
  if (drawerWrapper) drawerWrapper.style.opacity = "1";
  drawerWrapper?.classList.remove("is-visible");
  setDrawerButtons(null);
  mainWrapper?.classList.remove("is-dimmed");
  dimGallery?.classList.remove("is-dimmed");
  notificationBarBox?.classList.remove("is-hidden");
  if (prefersReducedMotion() || !drawerWrapper) {
    if (drawerWrapper) drawerWrapper.style.opacity = "";
    hideDrawerOverlay();
    return;
  }
  drawerWrapper.addEventListener("transitionend", function onFadeOut(event) {
    if (event.target !== drawerWrapper) return;
    if (event.propertyName !== "opacity") return;
    drawerWrapper.removeEventListener("transitionend", onFadeOut);
    drawerWrapper.style.opacity = "";
    hideDrawerOverlay();
  });
}

/** openDrawer — kind is "menu" | "cart"; swap if the other is already open */
function openDrawer(kind, event) {
  event.preventDefault();
  if (!drawerWrapper) return;

  clearMenuRevealHide();
  const overlayOpen = activeDrawer !== null;
  const wasCart = activeDrawer === "cart";
  const openingMenu = kind === "menu" && menuDrawer;
  const openingCart = kind === "cart" && cartDrawer;
  if (openingMenu) {
    menuDrawer.classList.remove("is-revealed");
    markMenuRevealFade();
  }
  if (openingCart && activeDrawer !== "cart") {
    cartDrawer.classList.remove("is-revealed");
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
  if (openingCart && !wasCart) playCartReveal(true);
  if (overlayOpen) return;

  void drawerWrapper.offsetHeight;
  drawerWrapper.classList.add("is-visible");
  mainWrapper?.classList.add("is-dimmed");
  dimGallery?.classList.add("is-dimmed");
}

/** closeDrawer — menu or cart reverse finishes, then the overlay fades */
function closeDrawer(event) {
  event.preventDefault();
  if (activeDrawer === null) return;

  const closingMenu = activeDrawer === "menu";
  const closingCart = activeDrawer === "cart" && cartLineCount() > 0;
  const closingEmpty = activeDrawer === "cart" && !cartLineCount();
  if (closingMenu) playMenuReveal(false);
  if (activeDrawer === "cart") playCartReveal(false);
  activeDrawer = null;
  if ((closingMenu || closingCart || closingEmpty) && !prefersReducedMotion()) {
    clearMenuRevealHide();
    const wait = closingMenu
      ? menuRevealReverseMs() - MENU_LEAVE_TAIL_MS
      : closingEmpty
        ? CART_EMPTY_FADE * 1000
        : cartRevealReverseMs() + DRAWER_CLOSE_GAP * 1000;
    menuRevealHideTimer = setTimeout(
      () => {
        menuRevealHideTimer = 0;
        if (activeDrawer !== null) return;
        fadeDrawerOut();
      },
      Math.max(0, wait),
    );
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

/** revealPage — add html.is-ready after --rad-css and the hidden state are on screen */
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
    const cssOn =
      getComputedStyle(root).getPropertyValue("--rad-css").trim() === "1";
    if (!cssOn) return false;
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

/** resetDrawerState — bfcache restore: no drawer, no dim, scroll unlocked */
function resetDrawerState() {
  clearMenuRevealHide();
  activeDrawer = null;
  setDrawerButtons(null);
  if (drawerWrapper) drawerWrapper.style.opacity = "";
  drawerWrapper?.classList.remove("is-visible");
  mainWrapper?.classList.remove("is-dimmed");
  dimGallery?.classList.remove("is-dimmed");
  notificationBarBox?.classList.remove("is-hidden");
  menuDrawer?.classList.remove("is-revealed");
  cartDrawer?.classList.remove("is-revealed");
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
    if (drawerWrapper) drawerWrapper.style.opacity = "1";
    drawerWrapper?.classList.remove("is-visible");
    setTimeout(() => {
      if (drawerWrapper) drawerWrapper.style.opacity = "";
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
