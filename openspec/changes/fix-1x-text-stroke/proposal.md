## Why

Unica 77 Medium has a 126/1000 UPM stem. At 11.008px on a 1x or 125% display that stem is 1.39 device pixels, so difference-blended white type blooms and reads too heavy. Retina already lands on a whole pixel and stays as it is. `text-rendering: geometricPrecision` was tried for this and failed; main does not have it.

## What Changes

- Below `1.5dppx`, body type gets a `0.25px` stroke in `currentColor` so content reads closer to Retina. The stroke is centred, so half paints inward.
- The same query gives blended white chrome a `0.35px` `#000` stroke. Black is a no-op under difference, so it erases the stem edge instead of thickening it. That is 25% of the stem.
- An open drawer (`.navbar.is-normal`) drops difference and uses theme text, so it takes the content stroke. If the fullscreen layer is still blending, that navbar stays on the black stroke.
- Do not add `text-rendering: geometricPrecision`.

## Capabilities

### New Capabilities

- `1x-text-stroke`: Stroke weight for body type and difference-blended white chrome when device pixel ratio is at most 1.5.

### Modified Capabilities

- None.

## Impact

- `css/global.css`, immediately after `.navbar.is-normal .menu-link`.
- Navbar, second-menu, blend layer, product info, fullscreen close, zoom bracket, fullscreen product nav, cursor label, and body type on 1x and 125% displays.
- No JS. No new dependencies. No Webflow markup change.
