/**
 * collection.js — Collection page (/).
 * ============================================================================
 * FUNCTIONS EXPLAINER
 * ----------------------------------------------------------------------------
 * readGallerySrcs(list) -> img srcs in DOM order, skip empty/placeholder
 * bootInfiniteGallery() -> mount canvas or no-op
 * clamp(v, min, max) -> bounded number
 * lerp(a, b, t) -> mix
 * hashString(str) -> integer seed
 * seededRandom(seed) -> 0..1
 * generateChunkPlanes(cx, cy) -> plane layouts for one XY chunk
 * urlForIndex(i) -> current-mode src
 * getTexture(url) -> cached THREE.Texture
 * applyModeTextures() -> swap maps from body.dark-mode
 * hitPlane(clientX, clientY) -> mesh or null
 * setCursorLabel(hit) -> custom-cursor on canvas
 * ============================================================================
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js";

const CHUNK_SIZE = 50;
const RENDER_DISTANCE = 2;
const MAX_VELOCITY = 3.2;
const VELOCITY_LERP = 0.16;
const VELOCITY_DECAY = 0.9;
const INVIS_THRESHOLD = 0.01;
const EDGE_FADE_IN = 0.78;
const EDGE_FADE_OUT = 1.18;
const EDGE_LERP = 0.14;
const VIEW_HEIGHT = 72;
const ITEMS_PER_CHUNK = 2;
const MAX_PLANE_CACHE = 256;
const DRAG_CLICK_PX = 8;
const CHUNK_THROTTLE_MS = 100;
const SHOP_HREF = "/shop";
const SHOP_CURSOR = "[SHOP COLLECTION]";

const CHUNK_OFFSETS = [];
{
  for (let dx = -RENDER_DISTANCE; dx <= RENDER_DISTANCE; dx++) {
    for (let dy = -RENDER_DISTANCE; dy <= RENDER_DISTANCE; dy++) {
      CHUNK_OFFSETS.push({ dx, dy });
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

/** generateChunkPlanes(cx, cy) -> plane layouts for one XY chunk */
function generateChunkPlanes(cx, cy) {
  const planes = [];
  const seed = hashString(`${cx},${cy}`);
  const pad = CHUNK_SIZE * 0.16;
  const span = CHUNK_SIZE - pad * 2;
  for (let i = 0; i < ITEMS_PER_CHUNK; i++) {
    const s = seed + i * 1000;
    const r = (n) => seededRandom(s + n);
    const size = 9 + r(4) * 22;
    planes.push({
      id: `${cx}-${cy}-${i}`,
      x: cx * CHUNK_SIZE + pad + r(0) * span,
      y: cy * CHUNK_SIZE + pad + r(1) * span,
      size,
      mediaIndex: Math.floor(r(5) * 1_000_000),
      chunkCx: cx,
      chunkCy: cy,
    });
  }
  return planes;
}

const planeCache = new Map();

function generateChunkPlanesCached(cx, cy) {
  const key = `${cx},${cy}`;
  const cached = planeCache.get(key);
  if (cached) {
    planeCache.delete(key);
    planeCache.set(key, cached);
    return cached;
  }
  const planes = generateChunkPlanes(cx, cy);
  planeCache.set(key, planes);
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
  return planes;
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
let ndcScratch = null;
let planeGeometry = null;
let textureLoader = null;
let textureCache = null;
let chunkGroups = null;
let planeMeshes = null;
let controller = null;
let lastChunkKey = "";
let lastChunkUpdate = 0;
let pendingChunk = null;
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
  const img = texture && texture.image;
  const width = img && (img.naturalWidth || img.width);
  const height = img && (img.naturalHeight || img.height);
  const size = mesh.userData.size;
  if (width && height) {
    mesh.scale.set(size * (width / height), size, 1);
    return;
  }
  mesh.scale.set(size, size, 1);
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

function makePlaneMesh(plane) {
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(planeGeometry, material);
  mesh.position.set(plane.x, plane.y, 0);
  mesh.renderOrder = Math.round(plane.size * 10);
  mesh.visible = false;
  mesh.userData.size = plane.size;
  mesh.userData.mediaIndex = plane.mediaIndex;
  mesh.userData.chunkCx = plane.chunkCx;
  mesh.userData.chunkCy = plane.chunkCy;
  mesh.userData.opacity = 0;
  fitPlaneScale(mesh, null);
  planeMeshes.push(mesh);
  return mesh;
}

function disposeChunkGroup(group) {
  group.traverse((obj) => {
    if (obj.isMesh) {
      const i = planeMeshes.indexOf(obj);
      if (i >= 0) planeMeshes.splice(i, 1);
      if (obj.material) obj.material.dispose();
    }
  });
  scene.remove(group);
}

function syncChunks(cx, cy) {
  const next = new Map();
  CHUNK_OFFSETS.forEach((o) => {
    const key = `${cx + o.dx},${cy + o.dy}`;
    next.set(key, { cx: cx + o.dx, cy: cy + o.dy });
  });
  chunkGroups.forEach((group, key) => {
    if (!next.has(key)) {
      disposeChunkGroup(group);
      chunkGroups.delete(key);
    }
  });
  next.forEach((chunk, key) => {
    if (chunkGroups.has(key)) return;
    const group = new THREE.Group();
    generateChunkPlanesCached(chunk.cx, chunk.cy).forEach((plane) => {
      group.add(makePlaneMesh(plane));
    });
    scene.add(group);
    chunkGroups.set(key, group);
  });
  applyModeTextures();
}

function edgeFade(mesh) {
  ndcScratch.copy(mesh.position).project(camera);
  const mx = Math.max(Math.abs(ndcScratch.x), Math.abs(ndcScratch.y));
  if (mx <= EDGE_FADE_IN) return 1;
  if (mx >= EDGE_FADE_OUT) return 0;
  return 1 - (mx - EDGE_FADE_IN) / (EDGE_FADE_OUT - EDGE_FADE_IN);
}

function fadePlanes() {
  const ease = reduceMotion ? 1 : EDGE_LERP;
  planeMeshes.forEach((mesh) => {
    const material = mesh.material;
    const target = edgeFade(mesh);
    const state = mesh.userData;
    state.opacity =
      target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD
        ? 0
        : lerp(state.opacity, target, ease);
    material.opacity = state.opacity > 0.99 ? 1 : state.opacity;
    mesh.visible = state.opacity > INVIS_THRESHOLD;
  });
}

function resizeRenderer() {
  if (!galleryHost || !renderer || !camera) return;
  const width = galleryHost.clientWidth || 1;
  const height = galleryHost.clientHeight || 1;
  const aspect = width / height;
  const halfH = VIEW_HEIGHT / 2;
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
}

function onTouchMove(event) {
  event.preventDefault();
}

function tick(now) {
  rafId = requestAnimationFrame(tick);
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
  } else {
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
  }

  camera.position.set(s.basePos.x, s.basePos.y, 10);

  const cx = Math.floor(s.basePos.x / CHUNK_SIZE);
  const cy = Math.floor(s.basePos.y / CHUNK_SIZE);
  const key = `${cx},${cy}`;
  if (key !== lastChunkKey) {
    pendingChunk = { cx, cy };
    lastChunkKey = key;
  }
  if (pendingChunk && now - lastChunkUpdate >= CHUNK_THROTTLE_MS) {
    syncChunks(pendingChunk.cx, pendingChunk.cy);
    pendingChunk = null;
    lastChunkUpdate = now;
  }

  fadePlanes();
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
  ndcScratch = new THREE.Vector3();
  planeGeometry = new THREE.PlaneGeometry(1, 1);
  textureLoader = new THREE.TextureLoader();
  textureLoader.crossOrigin = "anonymous";
  textureCache = new Map();
  chunkGroups = new Map();
  planeMeshes = [];
  controller = {
    velocity: { x: 0, y: 0 },
    targetVel: { x: 0, y: 0 },
    basePos: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 },
    press: { x: 0, y: 0 },
    isDragging: false,
    pointerId: null,
    moved: 0,
    clickCanceled: false,
  };

  preloadTextures();
  lastChunkKey = "";
  lastChunkUpdate = 0;
  pendingChunk = null;
  syncChunks(0, 0);
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
