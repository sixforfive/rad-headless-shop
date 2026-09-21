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
 * pickSizeClass(rand) -> class width / PERIOD_W
 * aabbOverlap(a, b) -> torus boxes collide (with gutter)
 * pickMediaIndex(col, row, grid, n, rand) -> image index
 * buildPeriod(srcs) -> tiles for one wrapping poster
 * urlForIndex(i) -> current-mode src
 * getTexture(url) -> cached THREE.Texture
 * applyModeTextures() -> swap maps from body.dark-mode
 * hitPlane(clientX, clientY) -> mesh or null
 * setCursorLabel(hit) -> custom-cursor on canvas
 * ============================================================================
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js";

const PERIOD_W = 160;
const PERIOD_H = 90;
const GRID_COLS = 6;
const GRID_ROWS = 4;
const FILL = 0.35;
const GUTTER = PERIOD_W * (24 / 1440);
const DRIFT = 0.04;
const MAX_VELOCITY = 1.8;
const VELOCITY_LERP = 0.16;
const VELOCITY_DECAY = 0.9;
const DRAG_CLICK_PX = 8;
const WHEEL_GAIN = 0.008;
const SHOP_HREF = "/shop";
const SHOP_CURSOR = "[SHOP COLLECTION]";

const SIZE_CLASSES = [
  { frac: 0.07, weight: 3 },
  { frac: 0.11, weight: 4 },
  { frac: 0.16, weight: 2 },
  { frac: 0.2, weight: 1 },
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

/** pickSizeClass(rand) -> class width / PERIOD_W */
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
  return (
    dx < a.w / 2 + b.w / 2 + GUTTER && dy < a.h / 2 + b.h / 2 + GUTTER
  );
}

/** pickMediaIndex(col, row, grid, n, rand) -> image index */
function pickMediaIndex(col, row, grid, n, rand) {
  if (n <= 0) return 0;
  if (n < 3) return Math.floor(rand() * n);
  const banned = new Set();
  for (let dc = -1; dc <= 1; dc++) {
    for (let dr = -1; dr <= 1; dr++) {
      if (dc === 0 && dr === 0) continue;
      const nc = (col + dc + GRID_COLS) % GRID_COLS;
      const nr = (row + dr + GRID_ROWS) % GRID_ROWS;
      const used = grid[nr][nc];
      if (used >= 0) banned.add(used);
    }
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
  const cellW = PERIOD_W / GRID_COLS;
  const cellH = PERIOD_H / GRID_ROWS;
  const maxW = Math.max(1, cellW - GUTTER);
  const maxH = Math.max(1, cellH - GUTTER);
  const jitterCap = GUTTER / 2;
  const targetCount = Math.max(1, Math.round(GRID_COLS * GRID_ROWS * FILL));
  const cells = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      cells.push({ col, row });
    }
  }
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = cells[i];
    cells[i] = cells[j];
    cells[j] = tmp;
  }
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_COLS; col++) grid[row][col] = -1;
  }
  const tiles = [];
  for (let c = 0; c < cells.length && tiles.length < targetCount; c++) {
    const cell = cells[c];
    const classW = pickSizeClass(rand) * PERIOD_W;
    const w = Math.min(classW, maxW);
    const h = Math.min(w, maxH);
    const slackX = Math.max(0, (cellW - w) / 2);
    const slackY = Math.max(0, (cellH - h) / 2);
    const spanX = Math.min(slackX, jitterCap);
    const spanY = Math.min(slackY, jitterCap);
    const tile = {
      x: 0,
      y: 0,
      w,
      h,
      col: cell.col,
      row: cell.row,
      mediaIndex: 0,
    };
    let hits = true;
    for (let attempt = 0; attempt < 8 && hits; attempt++) {
      tile.x = cell.col * cellW + cellW / 2 + (rand() - 0.5) * 2 * spanX;
      tile.y = cell.row * cellH + cellH / 2 + (rand() - 0.5) * 2 * spanY;
      hits = false;
      for (let t = 0; t < tiles.length; t++) {
        if (aabbOverlap(tiles[t], tile)) {
          hits = true;
          break;
        }
      }
    }
    if (hits) continue;
    tile.mediaIndex = pickMediaIndex(cell.col, cell.row, grid, n, rand);
    grid[cell.row][cell.col] = tile.mediaIndex;
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
  const tiles = buildPeriod(lightSrcs);
  PERIOD_OFFSETS.forEach((o) => {
    tiles.forEach((tile) => {
      scene.add(makePlaneMesh(tile, o.ox, o.oy));
    });
  });
  applyModeTextures();
}

function resizeRenderer() {
  if (!galleryHost || !renderer || !camera) return;
  const width = galleryHost.clientWidth || 1;
  const height = galleryHost.clientHeight || 1;
  const aspect = width / height;
  const halfH = PERIOD_H / 2;
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
  controller.isDragging = true;
  controller.pointerId = event.pointerId;
  controller.lastMouse.x = event.clientX;
  controller.lastMouse.y = event.clientY;
  controller.press.x = event.clientX;
  controller.press.y = event.clientY;
  controller.moved = 0;
  controller.clickCanceled = false;
  galleryCanvas.style.cursor = "grabbing";
}

function onPointerMove(event) {
  const s = controller;
  if (s.isDragging && event.pointerId === s.pointerId) {
    const dx = event.clientX - s.lastMouse.x;
    const dy = event.clientY - s.lastMouse.y;
    s.moved = Math.hypot(event.clientX - s.press.x, event.clientY - s.press.y);
    if (s.moved >= DRAG_CLICK_PX) s.clickCanceled = true;
    const gain = event.pointerType === "touch" ? 0.045 : 0.055;
    s.targetVel.x -= dx * gain;
    s.targetVel.y += dy * gain;
    s.lastMouse.x = event.clientX;
    s.lastMouse.y = event.clientY;
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
  if (hitPlane(event.clientX, event.clientY)) {
    window.location.assign(SHOP_HREF);
  }
}

function onWheel(event) {
  event.preventDefault();
  if (!controller) return;
  controller.targetVel.x -= event.deltaX * WHEEL_GAIN;
  controller.targetVel.y += event.deltaY * WHEEL_GAIN;
}

function onTouchMove(event) {
  event.preventDefault();
}

function tick() {
  rafId = requestAnimationFrame(tick);
  const s = controller;
  reduceMotion = prefersReducedMotion();

  if (!reduceMotion && !s.isDragging) {
    s.targetVel.x += DRIFT;
    s.targetVel.y += DRIFT;
  }

  s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
  s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);

  if (reduceMotion) {
    s.basePos.x += s.targetVel.x;
    s.basePos.y += s.targetVel.y;
    s.velocity.x = 0;
    s.velocity.y = 0;
    s.targetVel.x = 0;
    s.targetVel.y = 0;
  } else {
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
  }

  s.basePos.x = wrap(s.basePos.x, PERIOD_W);
  s.basePos.y = wrap(s.basePos.y, PERIOD_H);
  camera.position.set(s.basePos.x, s.basePos.y, 10);

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
    lastMouse: { x: 0, y: 0 },
    press: { x: 0, y: 0 },
    isDragging: false,
    pointerId: null,
    moved: 0,
    clickCanceled: false,
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
  if (!lightSrcs.length) return;
  mountScene(host);
}

bootInfiniteGallery();
