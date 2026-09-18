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
 * generateChunkPlanes(cx, cy, cz) -> plane layouts for one chunk
 * getChunkUpdateThrottleMs(isZooming, zoomSpeed) -> ms
 * urlForIndex(i) -> current-mode src
 * getTexture(url) -> cached THREE.Texture
 * applyModeTextures() -> swap maps from body.dark-mode
 * hitPlane(clientX, clientY) -> mesh or null
 * setCursorLabel(hit) -> custom-cursor on canvas
 * ============================================================================
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js";

const CHUNK_SIZE = 110;
const RENDER_DISTANCE = 2;
const CHUNK_FADE_MARGIN = 1;
const MAX_VELOCITY = 3.2;
const DEPTH_FADE_START = 140;
const DEPTH_FADE_END = 260;
const INVIS_THRESHOLD = 0.01;
const VELOCITY_LERP = 0.16;
const VELOCITY_DECAY = 0.9;
const INITIAL_CAMERA_Z = 50;
const PLANE_SCALE = 2;
const ITEMS_PER_CHUNK = 2;
const Z_SCATTER = 22;
const MAX_PLANE_CACHE = 256;
const DRAG_CLICK_PX = 8;
const SHOP_HREF = "/shop";
const SHOP_CURSOR = "[SHOP COLLECTION]";

const CHUNK_OFFSETS = [];
{
  const maxDist = RENDER_DISTANCE + CHUNK_FADE_MARGIN;
  for (let dx = -maxDist; dx <= maxDist; dx++) {
    for (let dy = -maxDist; dy <= maxDist; dy++) {
      for (let dz = -maxDist; dz <= maxDist; dz++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
        if (dist > maxDist) continue;
        CHUNK_OFFSETS.push({ dx, dy, dz, dist });
      }
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

/** generateChunkPlanes(cx, cy, cz) -> plane layouts for one chunk */
function generateChunkPlanes(cx, cy, cz) {
  const planes = [];
  const seed = hashString(`${cx},${cy},${cz}`);
  for (let i = 0; i < ITEMS_PER_CHUNK; i++) {
    const s = seed + i * 1000;
    const r = (n) => seededRandom(s + n);
    const size = (12 + r(4) * 8) * PLANE_SCALE;
    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      x: cx * CHUNK_SIZE + r(0) * CHUNK_SIZE,
      y: cy * CHUNK_SIZE + r(1) * CHUNK_SIZE,
      z: cz * CHUNK_SIZE + CHUNK_SIZE / 2 + (r(2) - 0.5) * Z_SCATTER,
      size,
      mediaIndex: Math.floor(r(5) * 1_000_000),
      chunkCx: cx,
      chunkCy: cy,
      chunkCz: cz,
    });
  }
  return planes;
}

const planeCache = new Map();

function generateChunkPlanesCached(cx, cy, cz) {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);
  if (cached) {
    planeCache.delete(key);
    planeCache.set(key, cached);
    return cached;
  }
  const planes = generateChunkPlanes(cx, cy, cz);
  planeCache.set(key, planes);
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
  return planes;
}

/** getChunkUpdateThrottleMs(isZooming, zoomSpeed) -> ms */
function getChunkUpdateThrottleMs(isZooming, zoomSpeed) {
  if (zoomSpeed > 1.0) return 500;
  if (isZooming) return 400;
  return 100;
}

function shouldThrottleUpdate(lastUpdateTime, throttleMs, currentTime) {
  return currentTime - lastUpdateTime >= throttleMs;
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
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(planeGeometry, material);
  mesh.position.set(plane.x, plane.y, plane.z);
  mesh.visible = false;
  mesh.userData.size = plane.size;
  mesh.userData.mediaIndex = plane.mediaIndex;
  mesh.userData.chunkCx = plane.chunkCx;
  mesh.userData.chunkCy = plane.chunkCy;
  mesh.userData.chunkCz = plane.chunkCz;
  mesh.userData.opacity = 0;
  mesh.userData.frame = 0;
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

function syncChunks(cx, cy, cz) {
  const next = new Map();
  CHUNK_OFFSETS.forEach((o) => {
    const key = `${cx + o.dx},${cy + o.dy},${cz + o.dz}`;
    next.set(key, {
      cx: cx + o.dx,
      cy: cy + o.dy,
      cz: cz + o.dz,
    });
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
    generateChunkPlanesCached(chunk.cx, chunk.cy, chunk.cz).forEach((plane) => {
      group.add(makePlaneMesh(plane));
    });
    scene.add(group);
    chunkGroups.set(key, group);
  });
  applyModeTextures();
}

function fadePlanes() {
  const cam = camera.position;
  const cx = Math.floor(controller.basePos.x / CHUNK_SIZE);
  const cy = Math.floor(controller.basePos.y / CHUNK_SIZE);
  const cz = Math.floor(controller.basePos.z / CHUNK_SIZE);
  planeMeshes.forEach((mesh) => {
    const state = mesh.userData;
    const material = mesh.material;
    state.frame = (state.frame + 1) & 1;
    if (state.opacity < INVIS_THRESHOLD && !mesh.visible && state.frame === 0) {
      return;
    }
    const dist = Math.max(
      Math.abs(state.chunkCx - cx),
      Math.abs(state.chunkCy - cy),
      Math.abs(state.chunkCz - cz),
    );
    const absDepth = Math.abs(mesh.position.z - controller.basePos.z);
    if (absDepth > DEPTH_FADE_END + 50) {
      state.opacity = 0;
      material.opacity = 0;
      material.depthWrite = false;
      mesh.visible = false;
      return;
    }
    const gridFade =
      dist <= RENDER_DISTANCE
        ? 1
        : Math.max(
            0,
            1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001),
          );
    const depthFade =
      absDepth <= DEPTH_FADE_START
        ? 1
        : Math.max(
            0,
            1 -
              (absDepth - DEPTH_FADE_START) /
                Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001),
          );
    const target = Math.min(gridFade, depthFade * depthFade);
    state.opacity =
      target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD
        ? 0
        : lerp(state.opacity, target, 0.18);
    const isFullyOpaque = state.opacity > 0.99;
    material.opacity = isFullyOpaque ? 1 : state.opacity;
    material.depthWrite = isFullyOpaque;
    mesh.visible = state.opacity > INVIS_THRESHOLD;
  });
}

function resizeRenderer() {
  if (!galleryHost || !renderer || !camera) return;
  const width = galleryHost.clientWidth || 1;
  const height = galleryHost.clientHeight || 1;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const dpr = Math.min(
    window.devicePixelRatio || 1,
    isTouchDevice ? 1.25 : 1.5,
  );
  renderer.setPixelRatio(dpr);
  renderer.setSize(width, height, false);
}

function getTouchDistance(touches) {
  if (touches.length < 2) return 0;
  const t1 = touches[0];
  const t2 = touches[1];
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
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
  s.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  s.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (s.isDragging && event.pointerId === s.pointerId) {
    const dx = event.clientX - s.lastMouse.x;
    const dy = event.clientY - s.lastMouse.y;
    s.moved = Math.hypot(event.clientX - s.press.x, event.clientY - s.press.y);
    if (s.moved >= DRAG_CLICK_PX) s.clickCanceled = true;
    if (event.pointerType === "touch") {
      s.targetVel.x -= dx * 0.02;
      s.targetVel.y += dy * 0.02;
    } else {
      s.targetVel.x -= dx * 0.025;
      s.targetVel.y += dy * 0.025;
    }
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
  controller.scrollAccum += event.deltaY * 0.006;
}

function onTouchMove(event) {
  event.preventDefault();
  const s = controller;
  const touches = Array.from(event.touches);
  if (touches.length === 2) {
    const dist = getTouchDistance(touches);
    if (s.lastTouchDist > 0) {
      s.scrollAccum += (s.lastTouchDist - dist) * 0.006;
      s.clickCanceled = true;
    }
    s.lastTouchDist = dist;
  } else {
    s.lastTouchDist = 0;
  }
}

function tick(now) {
  rafId = requestAnimationFrame(tick);
  const s = controller;
  reduceMotion = prefersReducedMotion();
  const isZooming = Math.abs(s.velocity.z) > 0.05;
  const zoomFactor = clamp(s.basePos.z / 50, 0.3, 2.0);
  const driftAmount = 8.0 * zoomFactor;
  const driftLerp = isZooming ? 0.2 : 0.12;

  if (!s.isDragging) {
    if (isTouchDevice) {
      s.drift.x = lerp(s.drift.x, 0, driftLerp);
      s.drift.y = lerp(s.drift.y, 0, driftLerp);
    } else {
      s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount, driftLerp);
      s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount, driftLerp);
    }
  }

  s.targetVel.z += s.scrollAccum;
  s.scrollAccum *= 0.8;
  s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
  s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);
  s.targetVel.z = clamp(s.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY);

  if (reduceMotion) {
    s.basePos.x += s.targetVel.x;
    s.basePos.y += s.targetVel.y;
    s.basePos.z += s.targetVel.z;
    s.velocity.x = 0;
    s.velocity.y = 0;
    s.velocity.z = 0;
    s.targetVel.x = 0;
    s.targetVel.y = 0;
    s.targetVel.z = 0;
  } else {
    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.velocity.z = lerp(s.velocity.z, s.targetVel.z, VELOCITY_LERP);
    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.basePos.z += s.velocity.z;
    s.targetVel.x *= VELOCITY_DECAY;
    s.targetVel.y *= VELOCITY_DECAY;
    s.targetVel.z *= VELOCITY_DECAY;
  }

  camera.position.set(
    s.basePos.x + s.drift.x,
    s.basePos.y + s.drift.y,
    s.basePos.z,
  );

  const cx = Math.floor(s.basePos.x / CHUNK_SIZE);
  const cy = Math.floor(s.basePos.y / CHUNK_SIZE);
  const cz = Math.floor(s.basePos.z / CHUNK_SIZE);
  const key = `${cx},${cy},${cz}`;
  if (key !== lastChunkKey) {
    pendingChunk = { cx, cy, cz };
    lastChunkKey = key;
  }
  const throttleMs = getChunkUpdateThrottleMs(isZooming, Math.abs(s.velocity.z));
  if (pendingChunk && shouldThrottleUpdate(lastChunkUpdate, throttleMs, now)) {
    syncChunks(pendingChunk.cx, pendingChunk.cy, pendingChunk.cz);
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
  camera = new THREE.PerspectiveCamera(60, 1, 1, 500);
  camera.position.set(0, 0, INITIAL_CAMERA_Z);
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
  chunkGroups = new Map();
  planeMeshes = [];
  controller = {
    velocity: { x: 0, y: 0, z: 0 },
    targetVel: { x: 0, y: 0, z: 0 },
    basePos: { x: 0, y: 0, z: INITIAL_CAMERA_Z },
    drift: { x: 0, y: 0 },
    mouse: { x: 0, y: 0 },
    lastMouse: { x: 0, y: 0 },
    press: { x: 0, y: 0 },
    scrollAccum: 0,
    isDragging: false,
    pointerId: null,
    moved: 0,
    clickCanceled: false,
    lastTouches: [],
    lastTouchDist: 0,
  };

  preloadTextures();
  lastChunkKey = "";
  lastChunkUpdate = 0;
  pendingChunk = null;
  syncChunks(0, 0, Math.floor(INITIAL_CAMERA_Z / CHUNK_SIZE));
  resizeRenderer();

  galleryCanvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  galleryCanvas.addEventListener("wheel", onWheel, { passive: false });
  galleryCanvas.addEventListener("touchstart", (event) => event.preventDefault(), {
    passive: false,
  });
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
