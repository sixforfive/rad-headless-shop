## Why

Light and dark mode do not fade at one speed. `background-color` is 0.3s, text and borders are 0.45s, and later `transition` shorthands drop those properties on shop, product, and the collection gallery. The collection mosaic swaps its canvas texture in a single frame.

## What Changes

- One theme fade: `0.45s ease-out` on `background-color`, `color`, and `border-color`, including `html`.
- The same duration and easing on `.thumb-dark` and `.hero-photo-dark` opacity. Light images stay opaque.
- Page-enter, `.gallery-full-screen`, and dimmed `.main-wrapper` keep their existing opacity and transform timing, and also list the three color properties so the theme fade still runs.
- The collection canvas crossfades light and dark textures over that same 0.45s ease-out. Pan and layout stay put.
- `prefers-reduced-motion: reduce` still skips the fade.

## Capabilities

### New Capabilities

### Modified Capabilities

- `lights-switch`: Smooth mode transition moves from 0.3s to 0.45s ease-out and covers `html` plus elements whose other transitions would otherwise cancel it.
- `collection-infinite-gallery`: Toggling lights crossfades plane textures over 0.45s ease-out instead of replacing the map in one frame.

## Impact

- `css/global.css` — theme transition, thumb and hero-photo opacity, page-enter shorthand, `.gallery-full-screen`, `.main-wrapper.is-dimmed`.
- `js/collection.js` — texture crossfade inside the existing lights observer. No new dependency.
