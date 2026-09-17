## Why

Some hover targets need a short label next to the pointer so the visitor knows what the area is. The native arrow must stay; the copy is information only and must not replace or block the existing click target.

## What Changes

- Elements marked `custom-cursor` show a `.text-meta` label whose text is the attribute value.
- The label rubber-follows the pointer with easing. It fades in on enter and out on leave.
- The default arrow is unchanged. The label does not capture clicks or change hrefs.
- Put `custom-cursor` on the existing hover target in Webflow. No new element.

## Capabilities

### New Capabilities

- `cursor-label`: Pointer-following informational label on `[custom-cursor]`, rubber motion, fade in/out, default arrow kept.

### Modified Capabilities

- None.

## Impact

- `js/global.js` and `css/global.css` (already loaded site-wide).
- `README.md` (global.js role).
- Webflow: add `custom-cursor` on chosen hover targets after the SHA is live. No new script tag.
- No GSAP. No new dependencies. No Shopify.
