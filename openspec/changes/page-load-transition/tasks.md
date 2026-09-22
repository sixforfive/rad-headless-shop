## 1. Enter

- [x] 1.1 In `css/global.css`, set the enter target to `.main-wrapper:not(:has(.collection-hero-logo))` plus `:has(> .collection-hero-logo) > :not(.collection-hero-logo)`, starting at `opacity: 0` and `translateY(1.25rem)` with a 0.6s transition
- [x] 1.2 Add the `html.is-ready` rule on the same selector: `opacity: 1`, `transform: none`
- [x] 1.3 Keep drawer dim on `html.is-ready .main-wrapper.is-dimmed` at `opacity: 0.2` with `transition: opacity 0.45s ease-out`

## 2. Leave

- [x] 2.1 In `css/global.css`, add `@view-transition { navigation: auto }`, `view-transition-name: page` on `.main-wrapper`, and `view-transition-name: none` on `.main-wrapper:has(.collection-hero-logo)`
- [x] 2.2 Put `view-transition-name: page` on `.collection-hero-gallery`
- [x] 2.3 Set root old and new to `animation: none`, `::view-transition-old(page)` to a `page-out` keyframe (down `1.25rem`, fade, 0.6s), and `::view-transition-new(page)` to `animation: none`

## 3. Holds

- [x] 3.1 In `css/global.css`, name `.collection-hero-logo` `hero-logo` and `.drawer-wrapper` `drawer`, leaving both old pseudos with no animation so they hold for the leave
- [x] 3.2 Set group `z-index`: `page` 1, `hero-logo` 2, `drawer` 3

## 4. Reveal

- [x] 4.1 In `js/global.js`, add `revealPage` to set `html.is-ready` on the next frame
- [x] 4.2 In `js/global.js`, add `schedulePageReveal`: on `pagereveal`, wait for `viewTransition.finished` when a transition exists, otherwise reveal immediately; double `requestAnimationFrame` reveals only if `pagereveal` never fired

## 5. View switch

- [x] 5.1 In `css/global.css`, give `.products-collection` the same 0.6s opacity and transform transition, and `.is-leaving` the `opacity: 0` / `translateY(1.25rem)` state
- [x] 5.2 In `js/shop.js`, change `setView` to add `is-leaving`, wait for the opacity `transitionend` with a timeout fallback, then run the existing view swap, scroll jump, and measure, then remove `is-leaving`
- [x] 5.3 Under `prefers-reduced-motion: reduce`, `setView` skips the wait and applies the view immediately

## 6. Reduced motion

- [x] 6.1 In `css/global.css`, under `prefers-reduced-motion: reduce`, set `@view-transition { navigation: none }`, clear the enter translate, set root and page view-transition animations to `none`, and add the enter selector and `.products-collection` to the `transition-duration: 0s` list
