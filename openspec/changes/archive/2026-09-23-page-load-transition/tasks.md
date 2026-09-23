## 1. Enter

- [x] 1.1 In `css/global.css`, set the enter target to `.main-wrapper:not(:has(.collection-hero-logo))` plus `:has(> .collection-hero-logo) > :not(.collection-hero-logo)`, starting at `opacity: 0` and `translateY(1.25rem)` with a 0.45s transition
- [x] 1.2 Add the `html.is-ready` rule on the same selector: `opacity: 1`, `transform: none`
- [x] 1.3 Keep drawer dim on `html.is-ready .main-wrapper.is-dimmed` at `opacity: 0.2` with `transition: opacity 0.45s ease-out`

## 2. Leave

- [x] 2.1 In `css/global.css`, sink the same enter selector under `html.is-leaving` to `opacity: 0` and `translateY(1.25rem)` over 0.45s
- [x] 2.2 In `js/global.js`, `radLeaveTo` adds `html.is-leaving`, prefetches, then assigns after 450ms plus a 350ms hold
- [x] 2.3 `prefers-reduced-motion: reduce` assigns immediately and does not add `is-leaving`

## 3. Holds

- [x] 3.1 Leave the logo and the drawer out of the enter/leave selector so they stay while content sinks

## 4. Reveal

- [x] 4.1 In `js/global.js`, add `revealPage` to set `html.is-ready` on the next frame
- [x] 4.2 Layout scripts call `radPageReady`; pages with no gallery layout reveal on `DOMContentLoaded`; a 2s timeout reveals if neither fires

## 5. View switch

- [x] 5.1 In `css/global.css`, give `.products-collection` the same 0.45s opacity and transform transition, and `.is-leaving` the `opacity: 0` / `translateY(1.25rem)` state
- [x] 5.2 In `js/shop.js`, change `setView` to add `is-leaving`, wait for the opacity `transitionend` with a timeout fallback, then run the existing view swap, scroll jump, and measure, then remove `is-leaving`
- [x] 5.3 Under `prefers-reduced-motion: reduce`, `setView` skips the wait and applies the view immediately

## 6. Reduced motion

- [x] 6.1 In `css/global.css`, under `prefers-reduced-motion: reduce`, clear the enter translate and add the enter selector and `.products-collection` to the `transition-duration: 0s` list
