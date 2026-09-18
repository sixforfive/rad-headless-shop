## 1. Host CSS

- [x] 1.1 In `css/global.css`, position the WebGL canvas absolute inset 0 inside `.collection-hero-gallery`
- [x] 1.2 In `css/global.css`, set `pointer-events: none` on `.collection-hero-logo`

## 2. Boot `js/collection.js`

- [x] 2.1 Create `js/collection.js` with the FUNCTIONS EXPLAINER box listing `readGallerySrcs`, `bootInfiniteGallery`, and the controller helpers that will land in section 3
- [x] 2.2 Add `readGallerySrcs(list)` — `.hero-gallery-img` in DOM order, skip empty/`placeholder` srcs
- [x] 2.3 Add `bootInfiniteGallery()` — no-op without `.collection-hero-gallery`, without `window.THREE`, or when light srcs are empty; otherwise mount the canvas in the host
- [x] 2.4 Call `bootInfiniteGallery()` at the bottom of the file

## 3. Codrops port

- [x] 3.1 In `js/collection.js`, copy Infinite Canvas constants (`CHUNK_SIZE` 110, 5 planes/chunk, velocity lerp/decay/max, fade, drag, wheel, DPR cap, `antialias: false`); multiply plane size by 1.166; omit WASD/QE
- [x] 3.2 Port chunk plane generation (seeded layout, `mediaIndex % light.length`) and the inertia controller (drag, wheel, pinch, fade) onto `THREE.WebGLRenderer` with alpha clear and no fog
- [x] 3.3 Skip velocity integration when `prefers-reduced-motion: reduce`

## 4. Lights and shop

- [x] 4.1 Read dark srcs at boot, preload both texture sets, apply light or dark maps from `body.dark-mode`; MutationObserver on `html`/`body` class swaps maps without resetting `basePos`
- [x] 4.2 Raycast: still click (move under 8px) on a plane → `/shop`; drag past 8px pans and does not navigate; miss does not navigate
- [x] 4.3 Fine pointer: `custom-cursor="[SHOP COLLECTION]"` on the canvas when the ray hits a plane, empty attribute on a miss

## 5. Docs and pin

- [x] 5.1 In `README.md`, add a `js/collection.js` row (Collection `/` only, infinite hero canvas)
- [ ] 5.2 After commit: Collection Footer `<script type="module">` for `js/collection.js` at the SHA (Three comes from the ESM import); publish
