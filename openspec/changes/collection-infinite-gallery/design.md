## Context

See proposal.md for motivation. Specs in `specs/collection-infinite-gallery/spec.md`.

Constraints:

- Scripts are classic `<script src>` from jsDelivr at a commit SHA, no bundler. `js/collection.js` is the exception: `type="module"` so it can import `three@0.182.0` (no UMD build).
- Collection `/` already publishes `.collection-hero-gallery` with `.hero-gallery-light.is-none` / `.hero-gallery-dark.is-none` and `.hero-gallery-img` srcs. Photo/video formats omit the host.
- `applyLights` already toggles `body.dark-mode`. `initCursorLabel` already follows a non-empty `custom-cursor` via `closest`.
- `html` already paints `--_theme---background--primary`. Codrops demo paints an opaque white scene plus fog.

## Goals / Non-Goals

**Goals:**

- One Collection-only script that no-ops when the host or images are missing.
- Same controller numbers as [edoardolunardi/infinite-canvas](https://github.com/edoardolunardi/infinite-canvas) (`three@0.182.0`), minus keyboard and fog.
- Lights change textures in place.

**Non-Goals:**

- React, R3F, Vite, or a second bundle.
- WASD/QE.
- Per-image product URLs.
- Changing `js/global.js`.
- Webflow markup (already published).

## Decisions

**Vanilla Three.js ESM, not the Codrops React app.** This repo cannot load R3F. `three@0.182.0` has no UMD `three.min.js`. `js/collection.js` is `type="module"` and imports `three.module.min.js` pinned at 0.182.0. Alternative considered: iframe the demo. Rejected — no CMS wiring, opaque white stage, extra origin. Alternative considered: classic UMD tag. Rejected — that file is 404 on 0.182.0.

**`js/collection.js` on the Collection Footer only** as `type="module"`. Site-wide Three.js is wasted on shop/product. The script returns immediately when `.collection-hero-gallery` is missing or has no real `.hero-gallery-img` `src` (skip Webflow `placeholder.svg`). `CHUNK_SIZE` 110, 5 planes/chunk, `VELOCITY_LERP` 0.16, `VELOCITY_DECAY` 0.9, `MAX_VELOCITY` 3.2, fade lerp 0.18, drag 0.025 / 0.02, wheel `delta * 0.006`, DPR cap 1.25 touch / 1.5 desktop, `antialias: false`. Size formula `(12 + r*8) * 1.166`. `mediaIndex % light.length`. No keyboard map.

**Alpha canvas, no `scene.background`, no Fog.** Fog would fill gaps with a fixed color and hide the theme. Plane opacity fade from the demo stays. `gl.setClearColor(0, 0)`.

**Two URL arrays, one scene.** Read `.hero-gallery-light .hero-gallery-img` and `.hero-gallery-dark .hero-gallery-img` in DOM order at boot. Current mode picks the map; `mediaIndex` stays. MutationObserver on `html`/`body` `class` for `dark-mode` — do not touch `applyLights`. Preload the idle set so the first toggle does not hitch. Missing dark index keeps the light texture.

**Raycast for shop and the cursor label.** Pointer down stores xy. Move past 8px → pan, cancel click. Pointer up under threshold: `Raycaster` hit → `location.assign("/shop")`. On `pointermove` (fine pointer only), hit → `canvas.setAttribute("custom-cursor", "[SHOP COLLECTION]")`, miss → `setAttribute("custom-cursor", "")`. `initCursorLabel` then works because `event.target` is the canvas. Alternative considered: `custom-cursor` on the hidden imgs. Rejected — the canvas sits on top.

**Logo `pointer-events: none` in `css/global.css`.** Overlay must not eat pan. Canvas `position: absolute; inset: 0` inside the already-relative host.

**Reduced motion:** still mount the scene; skip velocity integration so drag/wheel do not coast.

**CORS:** `TextureLoader` with `crossOrigin = "anonymous"` on Webflow CDN urls.

## Risks / Trade-offs

- [Three.js ~150kb on Collection] → Page-only `type="module"` tag, not site-wide. Pin `0.182.0`.
- [12 unique images repeat] → Accepted. Layout is independent of N; admin count is DOM length.
- [Texture swap is a hard cut] → `body *` color fade does not animate WebGL maps. Crossfade would be a later change.
- [iOS memory] → Keep Codrops DPR cap. User already confirmed the demo on iOS.
- [Drawer over the canvas] → Overlay takes events; leave the loop running.
- [`three.min.js` UMD missing in a future Three release] → Import is pinned to `three.module.min.js` at 0.182.0. Do not use `@latest`.

## Migration Plan

1. Land `js/collection.js`, canvas/logo CSS, `README.md` row.
2. Collection page Footer: `<script type="module" src="…/js/collection.js">` at the commit SHA. Publish.
3. Rollback: remove that Footer tag. Markup stays inert.
