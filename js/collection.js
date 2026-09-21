/**
 * collection.js — Collection page (/).
 * ============================================================================
 * FUNCTIONS EXPLAINER
 * ----------------------------------------------------------------------------
 * readGallerySrcs(list) -> img srcs in DOM order, skip empty/placeholder
 * bootInfiniteGallery() -> mount canvas or no-op
 * clamp(v, min, max) -> bounded number
 * lerp(a, b, t) -> mix
 * wrap(v, period) -> v in [0, period)
 * hashString(str) -> integer seed
 * seededRandom(seed) -> 0..1
 * makeRng(seed) -> (n) -> 0..1
 * pickSizeClass(rand, classes) -> class width / PERIOD_W
 * aabbOverlap(a, b) -> torus boxes collide (with gutter)
 * isNearby(a, b) -> tiles close enough to ban the same image
 * pickMediaIndex(tile, tiles, n, rand) -> image index
 * buildPeriod(srcs, layer) -> tiles for one layer period
 * urlForIndex(i) -> current-mode src
 * getTexture(url) -> cached THREE.Texture
 * applyModeTextures() -> swap maps from body.dark-mode
 * hitPlane(clientX, clientY) -> mesh or null
 * setCursorLabel(hit) -> custom-cursor on canvas
 * pxToWorld() -> world units per CSS pixel
 * grabGain(s, now) -> 0..1 ease-in on grab
 * syncLayerOffsets() -> parallax wrap per layer group
 * ============================================================================
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js";

const VIEW_H = 90;
const PERIOD_W = 320;
const PERIOD_H = 180;
const PLACE_TRIES = 40;
const GUTTER = PERIOD_W * (24 / 1440);
const MAX_VELOCITY = 3.2;
const FRICTION = 0.92;
const GRAB_EASE_MS = 220;
const DRIFT = 0.04;
const DRIFT_FADE_MS = 900;
const REST_EPS = 0.012;
const DRAG_CLICK_PX = 8;
const WHEEL_GAIN = 0.006;
const SHOP_HREF = "/shop";
const SHOP_CURSOR = "[SHOP COLLECTION]";

const LAYERS = [
  {
    id: "far",
    parallax: 0.7,
    z: -2,
    count: 18,
    sizes: [
      { frac: 0.08, weight: 2 },
      { frac: 0.16, weight: 2 },
      { frac: 0.28, weight: 3 },
      { frac: 0.42, weight: 3 },
    ],
  },
  {
    id: "mid",
    parallax: 0.85,
    z: -1,
    count: 14,
    sizes: [
      { frac: 0.1, weight: 2 },
      { frac: 0.16, weight: 3 },
      { frac: 0.24, weight: 3 },
      { frac: 0.36, weight: 2 },
    ],
  },
  {
    id: "fore",
    parallax: 1,
    z: 0,
    count: 12,
    sizes: [
      { frac: 0.14, weight: 3 },
      { frac: 0.2, weight: 3 },
      { frac: 0.26, weight: 3 },
      { frac: 0.32, weight: 2 },
    ],
  },
];

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

/** wrap(v, period) -> v in [0, period) */
function wrap(v, period) {
  const r = v % period;
  return r < 0 ? r + period : r;
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

/** pickSizeClass(rand, classes) -> class width / PERIOD_W */
function pickSizeClass(rand, classes) {
  let sum = 0;
  for (let i = 0; i < classes.length; i++) sum += classes[i].weight;
  let t = rand() * sum;
  for (let i = 0; i < classes.length; i++) {
    t -= classes[i].weight;
    if (t <= 0) return classes[i].frac;
  }
  return classes[classes.length - 1].frac;
}

/** aabbOverlap(a, b) -> torus boxes collide (with gutter) */
function aabbOverlap(a, b) {
  const dx = Math.abs(wrapDelta(a.x - b.x, PERIOD_W));
  const dy = Math.abs(wrapDelta(a.y - b.y, PERIOD_H));
  return (
    dx < a.w / 2 + b.w / 2 + GUTTER && dy < a.h / 2 + b.h / 2 + GUTTER
  );
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

/** buildPeriod(srcs, layer) -> tiles for one layer period */
function buildPeriod(srcs, layer) {
  const n = srcs.length;
  const rand = makeRng(
    hashString(srcs.slice().sort().join("|") + "|" + layer.id),
  );
  const maxW = PERIOD_W - GUTTER;
  const maxH = PERIOD_H - GUTTER;
  const tiles = [];
  for (let i = 0; i < layer.count; i++) {
    const classW = pickSizeClass(rand, layer.sizes) * PERIOD_W;
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

/** readGallerySrcs(list) -> img srcs in DOM order, skip empty/placeholder */
function readGallerySrcs(list) {
  if (!list) return [];
  const srcs = [];
  list.querySelectorAll(".hero-gallery-img").forEach((img) => {
    const src = img.currentSrc || img.src || "";
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
let planeMeshes = null;
let layerGroups = null;
let controller = null;
let reduceMotion = false;
let finePointer = false;
let isTouchDevice = false;
let rafId = 0;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    applyModeTextures();
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

/** applyModeTextures() -> swap maps from body.dark-mode */
function applyModeTextures() {
  if (!planeMeshes) return;
  planeMeshes.forEach((mesh) => {
    const url = urlForIndex(mesh.userData.mediaIndex);
    const texture = getTexture(url);
    const material = mesh.material;
    if (material.map !== texture) {
      material.map = texture;
      material.needsUpdate = true;
    }
    if (texture) fitPlaneScale(mesh, texture);
  });
}

function preloadTextures() {
  lightSrcs.forEach(getTexture);
  darkSrcs.forEach(getTexture);
}

function makePlaneMesh(tile, ox, oy) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeometry, material);
  mesh.position.set(tile.x + ox * PERIOD_W, tile.y + oy * PERIOD_H, 0);
  mesh.renderOrder = Math.round(tile.w * 10);
  mesh.visible = true;
  mesh.userData.w = tile.w;
  mesh.userData.h = tile.h;
  mesh.userData.mediaIndex = tile.mediaIndex;
  fitPlaneScale(mesh, null);
  planeMeshes.push(mesh);
  return mesh;
}

function mountPeriod() {
  planeMeshes = [];
  layerGroups = [];
  LAYERS.forEach((layer) => {
    const group = new THREE.Group();
    group.position.z = layer.z;
    const tiles = buildPeriod(lightSrcs, layer);
    PERIOD_OFFSETS.forEach((o) => {
      tiles.forEach((tile) => {
        group.add(makePlaneMesh(tile, o.ox, o.oy));
      });
    });
    scene.add(group);
    layerGroups.push(group);
  });
  applyModeTextures();
}

/** pxToWorld() -> world units per CSS pixel */
function pxToWorld() {
  const h = (galleryHost && galleryHost.clientHeight) || 1;
  return VIEW_H / h;
}

/** grabGain(s, now) -> 0..1 ease-in on grab */
function grabGain(s, now) {
  if (reduceMotion) return 1;
  const t = (now - s.grabStart) / GRAB_EASE_MS;
  if (t >= 1) return 1;
  if (t <= 0) return 0;
  return t * t;
}

/** syncLayerOffsets() -> parallax wrap per layer group */
function syncLayerOffsets() {
  if (!layerGroups || !controller) return;
  const s = controller;
  for (let i = 0; i < LAYERS.length; i++) {
    const p = LAYERS[i].parallax;
    layerGroups[i].position.x = -wrap(s.basePos.x * p, PERIOD_W);
    layerGroups[i].position.y = -wrap(s.basePos.y * p, PERIOD_H);
  }
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

/** setCursorLabel(hit) -> custom-cursor on canvas */
function setCursorLabel(hit) {
  if (!galleryCanvas || !finePointer) return;
  if (hit) {
    galleryCanvas.setAttribute("custom-cursor", SHOP_CURSOR);
    return;
  }
  galleryCanvas.setAttribute("custom-cursor", "");
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
  s.velocity.x = 0;
  s.velocity.y = 0;
  s.driftT = 0;
  galleryCanvas.style.cursor = "grabbing";
}

function onPointerMove(event) {
  const s = controller;
  if (s.isDragging && event.pointerId === s.pointerId) {
    const dx = event.clientX - s.lastMouse.x;
    const dy = event.clientY - s.lastMouse.y;
    s.moved = Math.hypot(event.clientX - s.press.x, event.clientY - s.press.y);
    if (s.moved >= DRAG_CLICK_PX) s.clickCanceled = true;
    const scale = pxToWorld() * grabGain(s, event.timeStamp);
    const wx = -dx * scale;
    const wy = dy * scale;
    s.basePos.x += wx;
    s.basePos.y += wy;
    s.velocity.x = clamp(wx, -MAX_VELOCITY, MAX_VELOCITY);
    s.velocity.y = clamp(wy, -MAX_VELOCITY, MAX_VELOCITY);
    s.lastMouse.x = event.clientX;
    s.lastMouse.y = event.clientY;
    syncLayerOffsets();
  }
  if (finePointer && !s.isDragging) {
    setCursorLabel(hitPlane(event.clientX, event.clientY));
  }
}

function onPointerUp(event) {
  const s = controller;
  if (!s.isDragging || event.pointerId !== s.pointerId) return;
  s.isDragging = false;
  galleryCanvas.style.cursor = "grab";
  if (s.clickCanceled || s.moved >= DRAG_CLICK_PX) return;
  s.velocity.x = 0;
  s.velocity.y = 0;
  if (hitPlane(event.clientX, event.clientY)) {
    window.location.assign(SHOP_HREF);
  }
}

function onWheel(event) {
  event.preventDefault();
  if (!controller) return;
  const s = controller;
  const wx = -event.deltaX * WHEEL_GAIN;
  const wy = event.deltaY * WHEEL_GAIN;
  s.basePos.x += wx;
  s.basePos.y += wy;
  s.velocity.x = clamp(wx, -MAX_VELOCITY, MAX_VELOCITY);
  s.velocity.y = clamp(wy, -MAX_VELOCITY, MAX_VELOCITY);
  s.driftT = 0;
  syncLayerOffsets();
}

function onTouchMove(event) {
  event.preventDefault();
}

function tick(now) {
  rafId = requestAnimationFrame(tick);
  const s = controller;
  const dt = s.lastTick ? now - s.lastTick : 16;
  s.lastTick = now;
  reduceMotion = prefersReducedMotion();

  if (!s.isDragging) {
    if (reduceMotion) {
      s.velocity.x = 0;
      s.velocity.y = 0;
      s.driftT = 0;
    } else {
      const speed = Math.hypot(s.velocity.x, s.velocity.y);
      if (speed < REST_EPS) {
        s.velocity.x = 0;
        s.velocity.y = 0;
        s.driftT = Math.min(1, s.driftT + dt / DRIFT_FADE_MS);
        const k = s.driftT * s.driftT;
        s.basePos.x += DRIFT * k;
        s.basePos.y += DRIFT * k;
      } else {
        s.driftT = 0;
        s.basePos.x += s.velocity.x;
        s.basePos.y += s.velocity.y;
        s.velocity.x *= FRICTION;
        s.velocity.y *= FRICTION;
      }
    }
  }

  s.basePos.x = wrap(s.basePos.x, PERIOD_W);
  s.basePos.y = wrap(s.basePos.y, PERIOD_H);
  syncLayerOffsets();
  renderer.render(scene, camera);
}

function bindLightsObserver() {
  const onClass = () => applyModeTextures();
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
  camera.position.set(0, 0, 10);
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
    basePos: { x: PERIOD_W / 2, y: PERIOD_H / 2 },
    lastMouse: { x: 0, y: 0 },
    press: { x: 0, y: 0 },
    isDragging: false,
    pointerId: null,
    moved: 0,
    clickCanceled: false,
    grabStart: 0,
    driftT: 0,
    lastTick: 0,
  };

  preloadTextures();
  mountPeriod();
  resizeRenderer();
  syncLayerOffsets();

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
  if (!lightSrcs.length) return;
  mountScene(host);
}

bootInfiniteGallery();
