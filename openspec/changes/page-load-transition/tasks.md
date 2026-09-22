## 1. Enter

- [ ] 1.1 In `css/global.css`, start `.main-wrapper` at `opacity: 0` and `translateY(1.25rem)`, and set `html.is-ready .main-wrapper` to `opacity: 1` and `transform: none` over 0.6s
- [ ] 1.2 In `css/global.css`, keep drawer dim on `html.is-ready .main-wrapper.is-dimmed` at `opacity: 0.2` with `transition: opacity 0.45s ease-out`

## 2. Leave

- [ ] 2.1 In `css/global.css`, add `@view-transition { navigation: auto }` and `view-transition-name: page` on `.main-wrapper`
- [ ] 2.2 Set root old and new view-transition animations to `none`, `::view-transition-old(page)` to `page-out` (down 1.25rem and fade, 0.6s), and `::view-transition-new(page)` to `animation: none`

## 3. Reveal

- [ ] 3.1 In `js/global.js`, add `revealPage` to set `html.is-ready` on the next frame
- [ ] 3.2 In `js/global.js`, add `schedulePageReveal`: on `pagereveal`, wait for `viewTransition.finished` when a transition exists, otherwise reveal immediately; double `requestAnimationFrame` reveals only if `pagereveal` never fired

## 4. Reduced motion

- [ ] 4.1 In `css/global.css`, under `prefers-reduced-motion: reduce`, set `@view-transition { navigation: none }`, `.main-wrapper { transform: none }`, and page view-transition animations to `none`
