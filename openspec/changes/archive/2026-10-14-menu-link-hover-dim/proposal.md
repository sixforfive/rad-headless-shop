## Why

Menu links stay the same opacity on hover, so the active item does not stand out. Dim the rest of the `.menu-link` set so the hovered link is the only one at full opacity.

## What Changes

- Hovering a `.menu-link` fades every other `.menu-link` on the page, including navbar, to 30% opacity.
- The hovered link stays at 100%. Leaving all `.menu-link` nodes restores every one to 100%.
- The fade is 0.3s. Viewports under 768px and coarse pointers do not dim. Clicks stay as they are.

## Capabilities

### New Capabilities

- `menu-link-hover`: Page-wide dim on `.menu-link` hover — other `.menu-link` nodes fade to 30%, the hovered one stays 100%, restore on leave, 768px and up.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- Every page that publishes `.menu-link` (navbar, drawer, cart chrome).
- No JS. No new dependencies. No Webflow markup change.
