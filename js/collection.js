/**
 * collection.js — Collection page (/).
 * ============================================================================
 * FUNCTIONS EXPLAINER
 * ----------------------------------------------------------------------------
 * displayUrl(img) -> srcset candidate nearest 800w, else src
 * readGallerySrcs(list) -> display URLs in DOM order, skip empty/placeholder
 * preloadTextures() -> fetch light and dark srcs
 * bootInfiniteGallery() -> mount canvas or no-op
 * advanceReveal(now) -> fade a decoded image in after its random delay
 * clamp(v, min, max) -> bounded number
 * lerp(a, b, t) -> mix
 * wrapDelta(d, period) -> shortest torus delta
 * hashString(str) -> integer seed
 * seededRandom(seed) -> 0..1
 * makeRng(seed) -> (n) -> 0..1
 * pickSizeClass(rand) -> class width / SIZE_BASE
 * aabbOverlap(a, b) -> torus boxes collide (with gutter)
 * isNearby(a, b) -> tiles close enough to ban the same image
 * pickMediaIndex(tile, tiles, n, rand) -> image index
 * buildPeriod(srcs) -> tiles for one wrapping poster
 * urlForIndex(i) -> current-mode src
 * getTexture(url) -> cached THREE.Texture
 * uploadTexture(texture) -> decoded image onto the GPU
 * setModeMix(value) -> write the shared texture mix
 * textureReady(texture) -> image has decoded
 * assignMaps(fit) -> set current-mode maps; fit scale only when asked
 * targetsReady() -> every current-mode image has decoded
 * startCrossfade() -> aim incoming maps and restart the mix
 * themeEaseOut(t) -> css ease-out cubic-bezier(0, 0, 0.58, 1)
 * advanceModeFade(now) -> drive the shared texture mix
 * applyModeTextures(fit) -> crossfade maps from body.dark-mode
 * hitPlane(clientX, clientY) -> mesh or null
 * setCursorLabel(hit) -> custom-cursor + pointer on canvas
 * grabGain(s, now) -> 0..1 ease-in-out on grab
 * setMouseNdc(event) -> cursor in host as -1..1; true if inside
 * canHoverDim() -> 768+ fine hover (same gate as shop)
 * applyHoverDim(dt) -> mix plane rgb toward theme bg; opacity follows reveal
 * patchHoverMaterial(material) -> uDim / uBg / incoming map in the fragment shader
 * parallaxFactor(w) -> class p (S 0.55 .. XL 1)
 * placeCopies() -> mesh positions from pan * p; camera stays home
 * ============================================================================
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js";

const VIEW_H = 90;
const PERIOD_W = 320;
const PERIOD_H = 180;
const SIZE_BASE = 180;
const TILE_COUNT = 40;
const PLACE_TRIES = 150;
const GUTTER = SIZE_BASE * (40 / 1440);
const MAX_VELOCITY = 3.2;
const VELOCITY_LERP = 0.16;
const VELOCITY_DECAY = 0.94;
const GRAB_EASE_MS = 280;
const DRIFT_AMOUNT = 8;
const DRIFT_LERP = 0.12;
const DRAG_CLICK_PX = 8;
const WHEEL_GAIN = 0.006;
const SHOP_HREF = "/shop";
const SHOP_CURSOR = "[SHOP COLLECTION]";
const HOVER_DIM = 0.5;
const HOVER_FADE_MS = 300;
const THEME_FADE_MS = 450;
const REVEAL_DELAY_MS = 300;
const REVEAL_FADE_MS = 600;

const SIZE_CLASSES = [
  { frac: 0.11, weight: 2, p: 0.55 },
  { frac: 0.16, weight: 4, p: 0.7 },
  { frac: 0.21, weight: 3, p: 0.85 },
  { frac: 0.26, weight: 1, p: 1 },
];

const SIZE_WEIGHT_SUM = SIZE_CLASSES.reduce((sum, c) => sum + c.weight, 0);

const PERIOD_OFFSETS = [];
{
  for (let ox = -1; ox <= 1; ox++) {
    for (let oy = -1; oy <= 1; oy++) {
      PERIOD_OFFSETS.push({ ox, oy });
    }
  }
}

/** clamp(v, min, max) -> bounded number */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** lerp(a, b, t) -> mix */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** themeEaseOut(t) -> css ease-out cubic-bezier(0, 0, 0.58, 1) */
function themeEaseOut(t) {
  const x2 = 0.58;
  const y2 = 1;
  const bx = 3 * x2;
  const ax = 1 - bx;
  const by = 3 * y2;
  const ay = 1 - by;
  let u = t;
  for (let i = 0; i < 5; i++) {
    const x = (ax * u + bx) * u * u - t;
    const dx = (3 * ax * u + 2 * bx) * u;
    if (Math.abs(dx) < 1e-6) break;
    u -= x / dx;
  }
  return (ay * u + by) * u * u;
}

function wrapDelta(d, period) {
  let r = d % period;
  if (r > period / 2) r -= period;
  if (r < -period / 2) r += period;
  return r;
}

/** hashString(str) -> integer seed */
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** seededRandom(seed) -> 0..1 */
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

/** makeRng(seed) -> (n) -> 0..1 */
function makeRng(seed) {
  let s = seed + 1;
  return (n) => {
    s += 1 + (n || 0);
    return seededRandom(s);
  };
}

/** pickSizeClass(rand) -> class width / SIZE_BASE */
function pickSizeClass(rand) {
  let t = rand() * SIZE_WEIGHT_SUM;
  for (let i = 0; i < SIZE_CLASSES.length; i++) {
    t -= SIZE_CLASSES[i].weight;
    if (t <= 0) return SIZE_CLASSES[i].frac;
  }
  return SIZE_CLASSES[SIZE_CLASSES.length - 1].frac;
}

/** aabbOverlap(a, b) -> torus boxes collide (with gutter) */
function aabbOverlap(a, b) {
  const dx = Math.abs(wrapDelta(a.x - b.x, PERIOD_W));
  const dy = Math.abs(wrapDelta(a.y - b.y, PERIOD_H));
  return dx < a.w / 2 + b.w / 2 + GUTTER && dy < a.h / 2 + b.h / 2 + GUTTER;
}

/** isNearby(a, b) -> tiles close enough to ban the same image */
function isNearby(a, b) {
  const dx = Math.abs(wrapDelta(a.x - b.x, PERIOD_W));
  const dy = Math.abs(wrapDelta(a.y - b.y, PERIOD_H));
  return (
    dx < a.w / 2 + b.w / 2 + GUTTER + Math.min(a.w, b.w) / 2 &&
    dy < a.h / 2 + b.h / 2 + GUTTER + Math.min(a.h, b.h) / 2
  );
}

/** pickMediaIndex(tile, tiles, n, rand) -> image index */
function pickMediaIndex(tile, tiles, n, rand) {
  if (n <= 0) return 0;
  if (n < 3) return Math.floor(rand() * n);
  const banned = new Set();
  for (let t = 0; t < tiles.length; t++) {
    if (isNearby(tile, tiles[t])) banned.add(tiles[t].mediaIndex);
  }
  const order = [];
  for (let i = 0; i < n; i++) order.push(i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  for (let i = 0; i < order.length; i++) {
    if (!banned.has(order[i])) return order[i];
  }
  return order[0];
}

/** buildPeriod(srcs) -> tiles for one wrapping poster */
function buildPeriod(srcs) {
  const n = srcs.length;
  const rand = makeRng(hashString(srcs.slice().sort().join("|")));
  const maxW = PERIOD_W - GUTTER;
  const maxH = PERIOD_H - GUTTER;
  const tiles = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    const classW = pickSizeClass(rand) * SIZE_BASE;
    const w = Math.min(classW, maxW);
    const h = Math.min(w, maxH);
    const tile = { x: 0, y: 0, w, h, mediaIndex: 0 };
    let hits = true;
    for (let attempt = 0; attempt < PLACE_TRIES && hits; attempt++) {
      tile.x = rand() * PERIOD_W;
      tile.y = rand() * PERIOD_H;
      hits = false;
      for (let t = 0; t < tiles.length; t++) {
        if (aabbOverlap(tiles[t], tile)) {
          hits = true;
          break;
        }
      }
    }
    if (hits) continue;
    tile.mediaIndex = pickMediaIndex(tile, tiles, n, rand);
    tiles.push(tile);
  }
  return tiles;
}

const DISPLAY_W = 800;

/** displayUrl(img) -> srcset candidate nearest 800w, else src */
function displayUrl(img) {
  const src = img.getAttribute("src") || "";
  const srcset = img.getAttribute("srcset");
  if (!srcset) return src;
  let best = "";
  let bestDelta = Infinity;
  let bestW = Infinity;
  srcset.split(",").forEach((part) => {
    const bits = part.trim().split(/\s+/);
    if (bits.length < 2) return;
    const desc = bits[bits.length - 1];
    if (!desc.endsWith("w")) return;
    const w = parseInt(desc, 10);
    if (!Number.isFinite(w)) return;
    const delta = Math.abs(w - DISPLAY_W);
    if (delta < bestDelta || (delta === bestDelta && w < bestW)) {
      best = bits[0];
      bestDelta = delta;
      bestW = w;
    }
  });
  return best || src;
}

/** readGallerySrcs(list) -> display URLs in DOM order, skip empty/placeholder */
function readGallerySrcs(list) {
  if (!list) return [];
  const srcs = [];
  list.querySelectorAll(".hero-gallery-img").forEach((img) => {
    const src = displayUrl(img);
    if (!src) return;
    if (src.includes("placeholder")) return;
    srcs.push(src);
  });
  return srcs;
}

let galleryHost = null;
let galleryCanvas = null;
let lightSrcs = [];
let darkSrcs = [];
let renderer = null;
let scene = null;
let camera = null;
let raycaster = null;
let pointerNdc = null;
let planeGeometry = null;
let textureLoader = null;
let textureCache = null;
const revealAt = new Map();
let planeMeshes = null;
let controller = null;
let reduceMotion = false;
let finePointer = false;
let isTouchDevice = false;
let rafId = 0;
let hoveredMesh = null;
let lastTick = 0;
const themeBg = new THREE.Color(1, 1, 1);
const modeMix = { value: 0 };
let awaitingFade = false;
let modeFade = null;
let modeToggle = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** canHoverDim() -> 768+ fine hover (same gate as shop) */
function canHoverDim() {
  return window.matchMedia(
    "(min-width: 768px) and (hover: hover) and (pointer: fine)",
  ).matches;
}

function isDarkMode() {
  return document.body.classList.contains("dark-mode");
}

/** urlForIndex(i) -> current-mode src */
function urlForIndex(i) {
  const n = lightSrcs.length;
  if (!n) return "";
  const index = ((i % n) + n) % n;
  if (isDarkMode() && darkSrcs[index]) return darkSrcs[index];
  return lightSrcs[index];
}

/** getTexture(url) -> cached THREE.Texture */
function getTexture(url) {
  if (!url || !textureLoader) return null;
  const existing = textureCache.get(url);
  if (existing) return existing;
  const texture = textureLoader.load(url, (tex) => {
    if (!revealAt.has(url)) {
      revealAt.set(url, performance.now() + Math.random() * REVEAL_DELAY_MS);
    }
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    uploadTexture(tex);
    if (awaitingFade || modeFade || modeToggle) applyModeTextures(false);
    else applyModeTextures(true);
  });
  textureCache.set(url, texture);
  return texture;
}

function fitPlaneScale(mesh, texture) {
  const maxW = mesh.userData.w;
  const maxH = mesh.userData.h;
  const img = texture && texture.image;
  const width = img && (img.naturalWidth || img.width);
  const height = img && (img.naturalHeight || img.height);
  if (width && height) {
    const aspect = width / height;
    let w = maxW;
    let h = w / aspect;
    if (h > maxH) {
      h = maxH;
      w = h * aspect;
    }
    mesh.scale.set(w, h, 1);
    return;
  }
  mesh.scale.set(maxW, maxH, 1);
}

/** uploadTexture(texture) -> decoded image onto the GPU */
function uploadTexture(texture) {
  if (!renderer || !textureReady(texture)) return;
  renderer.initTexture(texture);
}

/** setModeMix(value) -> write the shared texture mix */
function setModeMix(value) {
  modeMix.value = value;
  if (!planeMeshes) return;
  for (let i = 0; i < planeMeshes.length; i++) {
    const uniform = planeMeshes[i].material.userData.uMix;
    if (uniform && uniform !== modeMix) uniform.value = value;
  }
}

/** textureReady(texture) -> image has decoded */
function textureReady(texture) {
  const img = texture && texture.image;
  return Boolean(img && (img.naturalWidth || img.width));
}

/** assignMaps(fit) -> set current-mode maps; fit scale only when asked */
function assignMaps(fit) {
  modeFade = null;
  awaitingFade = false;
  setModeMix(0);
  if (!planeMeshes) return;
  planeMeshes.forEach((mesh) => {
    const texture = getTexture(urlForIndex(mesh.userData.mediaIndex));
    const material = mesh.material;
    if (material.map !== texture) {
      material.map = texture;
      material.needsUpdate = true;
    }
    material.userData.mapIn = texture;
    if (material.userData.uMapIn) material.userData.uMapIn.value = texture;
    if (fit && texture) fitPlaneScale(mesh, texture);
  });
}

/** targetsReady() -> every current-mode image has decoded */
function targetsReady() {
  if (!planeMeshes) return false;
  for (let i = 0; i < planeMeshes.length; i++) {
    const texture = getTexture(urlForIndex(planeMeshes[i].userData.mediaIndex));
    if (!textureReady(texture)) return false;
  }
  return true;
}

/** startCrossfade() -> aim incoming maps and restart the mix */
function startCrossfade() {
  if (!planeMeshes) return;
  const k = modeMix.value;
  let from = k;
  let changed = false;
  planeMeshes.forEach((mesh) => {
    const material = mesh.material;
    const target = getTexture(urlForIndex(mesh.userData.mediaIndex));
    const map = material.map;
    const mapIn = material.userData.mapIn || map;
    if (target === map && (k <= 0 || mapIn === map)) {
      material.userData.mapIn = map;
      if (material.userData.uMapIn) material.userData.uMapIn.value = map;
      return;
    }
    if (target === mapIn && k > 0) {
      changed = true;
      return;
    }
    if (target === map && k > 0 && mapIn !== map) {
      material.map = mapIn;
      material.userData.mapIn = map;
      if (material.userData.uMapIn) material.userData.uMapIn.value = map;
      from = 1 - k;
      changed = true;
      return;
    }
    material.userData.mapIn = target;
    if (material.userData.uMapIn) material.userData.uMapIn.value = target;
    from = 0;
    changed = true;
  });
  if (!changed) {
    modeFade = null;
    awaitingFade = false;
    return;
  }
  for (let i = 0; i < planeMeshes.length; i++) {
    uploadTexture(planeMeshes[i].material.userData.mapIn);
  }
  setModeMix(from);
  modeFade = { start: performance.now(), from };
  awaitingFade = false;
}

/** advanceModeFade(now) -> drive the shared texture mix */
function advanceModeFade(now) {
  if (!modeFade) return;
  if (reduceMotion) {
    assignMaps(false);
    return;
  }
  const t = clamp((now - modeFade.start) / THEME_FADE_MS, 0, 1);
  const eased = t >= 1 ? 1 : themeEaseOut(t);
  setModeMix(modeFade.from + (1 - modeFade.from) * eased);
  if (t >= 1) assignMaps(false);
}

/** applyModeTextures(fit) -> crossfade maps from body.dark-mode */
function applyModeTextures(fit) {
  if (!planeMeshes) return;
  if (fit || reduceMotion) {
    assignMaps(Boolean(fit));
    return;
  }
  if (!targetsReady()) {
    awaitingFade = true;
    return;
  }
  startCrossfade();
}

/** preloadTextures() -> fetch light and dark srcs */
function preloadTextures() {
  const seen = new Set();
  for (let i = 0; i < lightSrcs.length; i++) {
    const urls = [lightSrcs[i], darkSrcs[i]];
    for (let j = 0; j < urls.length; j++) {
      const url = urls[j];
      if (!url || seen.has(url)) continue;
      seen.add(url);
      getTexture(url);
    }
  }
}

/** patchHoverMaterial(material) -> uDim / uBg / incoming map in the fragment shader */
function patchHoverMaterial(material) {
  material.userData.dim = 0;
  material.userData.mapIn = null;
  material.customProgramCacheKey = () => "hover-dim-mix";
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDim = { value: material.userData.dim };
    shader.uniforms.uBg = { value: themeBg };
    shader.uniforms.uMapIn = { value: material.userData.mapIn || material.map };
    shader.uniforms.uMix = modeMix;
    material.userData.uDim = shader.uniforms.uDim;
    material.userData.uMapIn = shader.uniforms.uMapIn;
    material.userData.uMix = shader.uniforms.uMix;
    shader.fragmentShader =
      "uniform float uDim;\nuniform vec3 uBg;\nuniform sampler2D uMapIn;\nuniform float uMix;\n" +
      shader.fragmentShader.replace(
        "#include <map_fragment>",
        `#include <map_fragment>
         vec4 radIn = texture2D(uMapIn, vMapUv);
         diffuseColor.rgb = mix(diffuseColor.rgb, radIn.rgb, uMix);
         diffuseColor.rgb = mix(diffuseColor.rgb, uBg, uDim);`,
      );
  };
}

function makePlaneMesh(tile, ox, oy) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  patchHoverMaterial(material);
  const mesh = new THREE.Mesh(planeGeometry, material);
  mesh.position.set(tile.x + ox * PERIOD_W, tile.y + oy * PERIOD_H, 0);
  mesh.renderOrder = Math.round(tile.w * 10);
  mesh.visible = true;
  mesh.userData.tileX = tile.x;
  mesh.userData.tileY = tile.y;
  mesh.userData.ox = ox;
  mesh.userData.oy = oy;
  mesh.userData.w = tile.w;
  mesh.userData.h = tile.h;
  mesh.userData.mediaIndex = tile.mediaIndex;
  mesh.userData.reveal = 0;
  fitPlaneScale(mesh, null);
  planeMeshes.push(mesh);
  return mesh;
}

function mountPeriod() {
  planeMeshes = [];
  const tiles = buildPeriod(lightSrcs);
  PERIOD_OFFSETS.forEach((o) => {
    tiles.forEach((tile) => {
      scene.add(makePlaneMesh(tile, o.ox, o.oy));
    });
  });
  applyModeTextures(true);
}

function resizeRenderer() {
  if (!galleryHost || !renderer || !camera) return;
  const width = galleryHost.clientWidth || 1;
  const height = galleryHost.clientHeight || 1;
  const aspect = width / height;
  const halfH = VIEW_H / 2;
  const halfW = halfH * aspect;
  camera.left = -halfW;
  camera.right = halfW;
  camera.top = halfH;
  camera.bottom = -halfH;
  camera.updateProjectionMatrix();
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    isTouchDevice ? 1.25 : 1.5,
  );
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
}

function pointerFromEvent(event) {
  const rect = galleryCanvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

/** hitPlane(clientX, clientY) -> mesh or null */
function hitPlane(clientX, clientY) {
  if (!raycaster || !camera) return null;
  pointerFromEvent({ clientX, clientY });
  raycaster.setFromCamera(pointerNdc, camera);
  const hits = raycaster.intersectObjects(planeMeshes, false);
  for (let i = 0; i < hits.length; i++) {
    if (hits[i].object.visible) return hits[i].object;
  }
  return null;
}

/** setCursorLabel(hit) -> custom-cursor + pointer on canvas */
function setCursorLabel(hit) {
  if (!galleryCanvas || !finePointer) return;
  if (hit) {
    galleryCanvas.setAttribute("custom-cursor", SHOP_CURSOR);
    galleryCanvas.style.cursor = "pointer";
    return;
  }
  galleryCanvas.setAttribute("custom-cursor", "");
  galleryCanvas.style.cursor = "grab";
}

/** grabGain(s, now) -> 0..1 ease-in-out on grab */
function grabGain(s, now) {
  if (reduceMotion) return 1;
  const t = clamp((now - s.grabStart) / GRAB_EASE_MS, 0, 1);
  return t * t * (3 - 2 * t);
}

/** setMouseNdc(event) -> cursor in host as -1..1; true if inside */
function setMouseNdc(event) {
  if (!galleryHost || !controller) return false;
  const s = controller;
  const rect = galleryHost.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;
  if (!inside) {
    s.mouse.x = 0;
    s.mouse.y = 0;
    return false;
  }
  const w = rect.width || 1;
  const h = rect.height || 1;
  s.mouse.x = ((event.clientX - rect.left) / w) * 2 - 1;
  s.mouse.y = -((event.clientY - rect.top) / h) * 2 + 1;
  return true;
}

/** applyHoverDim(dt) -> mix plane rgb toward theme bg; opacity follows reveal */
function applyHoverDim(dt) {
  if (!planeMeshes) return;
  themeBg.setStyle(
    getComputedStyle(galleryHost || document.documentElement).backgroundColor,
  );
  const dimming = Boolean(hoveredMesh);
  const maxStep = reduceMotion
    ? 1
    : HOVER_DIM * Math.min(1, dt / HOVER_FADE_MS);
  for (let i = 0; i < planeMeshes.length; i++) {
    const mesh = planeMeshes[i];
    const material = mesh.material;
    const url = urlForIndex(mesh.userData.mediaIndex);
    if (reduceMotion && textureReady(getTexture(url))) mesh.userData.reveal = 1;
    material.opacity = mesh.userData.reveal || 0;
    const target = dimming && mesh !== hoveredMesh ? HOVER_DIM : 0;
    const current = material.userData.dim || 0;
    const delta = target - current;
    const next =
      Math.abs(delta) <= maxStep
        ? target
        : current + Math.sign(delta) * maxStep;
    material.userData.dim = next;
    if (material.userData.uDim) material.userData.uDim.value = next;
  }
}

/** parallaxFactor(w) -> class p (S 0.55 .. XL 1) */
function parallaxFactor(w) {
  if (reduceMotion) return 1;
  const frac = w / SIZE_BASE;
  let best = SIZE_CLASSES[0];
  let bestD = Math.abs(frac - best.frac);
  for (let i = 1; i < SIZE_CLASSES.length; i++) {
    const d = Math.abs(frac - SIZE_CLASSES[i].frac);
    if (d < bestD) {
      best = SIZE_CLASSES[i];
      bestD = d;
    }
  }
  return best.p;
}

/** placeCopies() -> mesh positions from pan * p; camera stays home */
function placeCopies() {
  if (!planeMeshes || !controller) return;
  const s = controller;
  const panX = s.basePos.x - PERIOD_W / 2;
  const panY = s.basePos.y - PERIOD_H / 2;
  for (let i = 0; i < planeMeshes.length; i++) {
    const mesh = planeMeshes[i];
    const d = mesh.userData;
    const p = parallaxFactor(d.w);
    const worldX = d.tileX;
    const worldY = d.tileY;
    const shiftX = panX * p;
    const shiftY = panY * p;
    const cx = Math.round((shiftX + PERIOD_W / 2 - worldX) / PERIOD_W);
    const cy = Math.round((shiftY + PERIOD_H / 2 - worldY) / PERIOD_H);
    mesh.position.set(
      worldX + (cx + d.ox) * PERIOD_W - shiftX,
      worldY + (cy + d.oy) * PERIOD_H - shiftY,
      0,
    );
  }
}

function onPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  const s = controller;
  s.isDragging = true;
  s.pointerId = event.pointerId;
  s.lastMouse.x = event.clientX;
  s.lastMouse.y = event.clientY;
  s.press.x = event.clientX;
  s.press.y = event.clientY;
  s.moved = 0;
  s.clickCanceled = false;
  s.grabStart = event.timeStamp;
  hoveredMesh = null;
  galleryCanvas.style.cursor = "grabbing";
}

function onPointerMove(event) {
  const s = controller;
  const inside = setMouseNdc(event);
  if (s.isDragging && event.pointerId === s.pointerId) {
    const dx = event.clientX - s.lastMouse.x;
    const dy = event.clientY - s.lastMouse.y;
    s.moved = Math.hypot(event.clientX - s.press.x, event.clientY - s.press.y);
    if (s.moved >= DRAG_CLICK_PX) s.clickCanceled = true;
    const gain =
      (event.pointerType === "touch" ? 0.02 : 0.025) *
      grabGain(s, event.timeStamp);
    s.targetVel.x -= dx * gain;
    s.targetVel.y += dy * gain;
    s.lastMouse.x = event.clientX;
    s.lastMouse.y = event.clientY;
  }
  if (s.isDragging) {
    hoveredMesh = null;
    return;
  }
  if (finePointer) {
    const hit = hitPlane(event.clientX, event.clientY);
    setCursorLabel(hit);
    hoveredMesh = canHoverDim() && inside ? hit : null;
    return;
  }
  hoveredMesh = null;
}

function onPointerUp(event) {
  const s = controller;
  if (!s.isDragging || event.pointerId !== s.pointerId) return;
  s.isDragging = false;
  galleryCanvas.style.cursor = "grab";
  const inside = setMouseNdc(event);
  const hit = hitPlane(event.clientX, event.clientY);
  if (finePointer) setCursorLabel(hit);
  hoveredMesh = canHoverDim() && inside ? hit : null;
  if (s.clickCanceled || s.moved >= DRAG_CLICK_PX) return;
  if (hit) {
    if (typeof window.radLeaveTo === "function") window.radLeaveTo(SHOP_HREF);
    else window.location.assign(SHOP_HREF);
  }
}

function onWheel(event) {
  event.preventDefault();
  if (!controller) return;
  const s = controller;
  s.targetVel.x -= event.deltaX * WHEEL_GAIN;
  s.targetVel.y -= event.deltaY * WHEEL_GAIN;
}

function onTouchMove(event) {
  event.preventDefault();
}

/** advanceReveal(now) -> fade a decoded image in after its random delay */
function advanceReveal(now) {
  if (!planeMeshes) return;
  for (let i = 0; i < planeMeshes.length; i++) {
    const mesh = planeMeshes[i];
    if (mesh.userData.reveal >= 1) {
      mesh.material.opacity = 1;
      continue;
    }
    const url = urlForIndex(mesh.userData.mediaIndex);
    if (!textureReady(getTexture(url))) continue;
    if (reduceMotion) continue;
    const start = revealAt.get(url);
    if (start == null || now < start) continue;
    const t = clamp((now - start) / REVEAL_FADE_MS, 0, 1);
    const next = t >= 1 ? 1 : themeEaseOut(t);
    if (next > mesh.userData.reveal) mesh.userData.reveal = next;
    mesh.material.opacity = mesh.userData.reveal;
  }
}

function tick(now) {
  rafId = requestAnimationFrame(tick);
  const dt = lastTick ? Math.min(now - lastTick, 50) : 16;
  lastTick = now;
  const s = controller;
  reduceMotion = prefersReducedMotion();

  s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
  s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);

  if (reduceMotion) {
    s.basePos.x += s.targetVel.x;
    s.basePos.y += s.targetVel.y;
    s.velocity.x = 0;
    s.velocity.y = 0;
    s.targetVel.x = 0;
    s.targetVel.y = 0;
    s.drift.x = 0;
    s.drift.y = 0;
  } else {
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
    if (!isTouchDevice) {
      s.drift.x = lerp(s.drift.x, s.mouse.x * DRIFT_AMOUNT, DRIFT_LERP);
      s.drift.y = lerp(s.drift.y, s.mouse.y * DRIFT_AMOUNT, DRIFT_LERP);
    } else {
      s.drift.x = lerp(s.drift.x, 0, DRIFT_LERP);
      s.drift.y = lerp(s.drift.y, 0, DRIFT_LERP);
    }
  }

  camera.position.set(PERIOD_W / 2 + s.drift.x, PERIOD_H / 2 + s.drift.y, 10);
  placeCopies();
  advanceReveal(now);
  applyHoverDim(dt);
  advanceModeFade(now);

  renderer.render(scene, camera);
}

function bindLightsObserver() {
  const onClass = () => {
    modeToggle = true;
    applyModeTextures(false);
  };
  const obs = new MutationObserver(onClass);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  obs.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

function mountScene(host) {
  galleryHost = host;
  isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  finePointer = isFinePointer();
  reduceMotion = prefersReducedMotion();

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(PERIOD_W / 2, PERIOD_H / 2, 10);
  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  galleryCanvas = renderer.domElement;
  galleryCanvas.style.cursor = "grab";
  host.appendChild(galleryCanvas);

  raycaster = new THREE.Raycaster();
  pointerNdc = new THREE.Vector2();
  planeGeometry = new THREE.PlaneGeometry(1, 1);
  textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "anonymous";
  textureCache = new Map();
  controller = {
    velocity: { x: 0, y: 0 },
    targetVel: { x: 0, y: 0 },
    basePos: { x: PERIOD_W / 2, y: PERIOD_H / 2 },
    drift: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 },
    press: { x: 0, y: 0 },
    isDragging: false,
    pointerId: null,
    moved: 0,
    clickCanceled: false,
    grabStart: 0,
  };

  preloadTextures();
  mountPeriod();
  resizeRenderer();

  galleryCanvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  galleryCanvas.addEventListener("wheel", onWheel, { passive: false });
  galleryCanvas.addEventListener(
    "touchstart",
    (event) => event.preventDefault(),
    { passive: false },
  );
  galleryCanvas.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("resize", resizeRenderer);
  if (window.ResizeObserver) {
    new ResizeObserver(resizeRenderer).observe(host);
  }
  bindLightsObserver();
  rafId = requestAnimationFrame(tick);
}

/** bootInfiniteGallery() -> mount canvas or no-op */
function bootInfiniteGallery() {
  const host = document.querySelector(".collection-hero-gallery");
  if (!host) return;
  lightSrcs = readGallerySrcs(host.querySelector(".hero-gallery-light"));
  darkSrcs = readGallerySrcs(host.querySelector(".hero-gallery-dark"));
  if (lightSrcs.length) mountScene(host);
  window.radPageReadyFired = true;
  if (typeof window.radPageReady === "function") window.radPageReady();
}

bootInfiniteGallery();
