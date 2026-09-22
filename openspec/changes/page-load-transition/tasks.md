## 1. Enter

- [x] 1.1 In `css/global.css`, start the rising element at `opacity: 0` and `translateY(0.625rem)`, and set `html.is-ready` to `opacity: 1` and `transform: none` over 0.6s
- [x] 1.2 On pages with `.collection-hero-logo`, apply that rise to each direct child of `.main-wrapper` that is not the logo and does not contain it. On other pages, apply it to `.main-wrapper`
- [x] 1.3 In `css/global.css`, keep drawer dim on `html.is-ready .main-wrapper.is-dimmed` at `opacity: 0.2` with `transition: opacity 0.45s ease-out`

## 2. No leave motion

- [x] 2.1 In `css/global.css`, add `@view-transition { navigation: auto }` and `view-transition-name: page` on `.main-wrapper` only
- [x] 2.2 Set root, old, and new view-transition animations to `none`. Do not add a leave keyframe

## 3. Reveal

- [x] 3.1 In `js/global.js`, add `revealPage` to set `html.is-ready` on the next frame
- [x] 3.2 In `js/global.js`, add `schedulePageReveal`: on `pagereveal`, wait for `viewTransition.finished` when a transition exists, otherwise reveal immediately; double `requestAnimationFrame` reveals only if `pagereveal` never fired

## 4. Reduced motion

- [x] 4.1 In `css/global.css`, under `prefers-reduced-motion: reduce`, set `@view-transition { navigation: none }`, clear the rise translate, set view-transition animations to `none`, and include the direct-child rise rule in the `transition-duration: 0s` list
