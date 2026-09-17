## Why

Shop and merch grids treat every thumb the same on hover, so the active item does not stand out. Dim the rest of the list so the hovered thumb is the only one at full opacity.

## What Changes

- Hovering a `.product-thumb` inside a shop or merch `.product-list` fades every other thumb in that list to 30% opacity.
- The hovered thumb stays at 100%. Leaving all thumbs restores every thumb to 100%.
- The fade is smooth. Clicks and existing placement stay as they are.

## Capabilities

### New Capabilities

- `product-thumb-hover`: Sibling dim on `.product-list` hover — other `.product-thumb` nodes fade to 30%, hovered stays 100%, restore on leave.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- Shop `/shop` (gallery and list) and merch `/merch` listing, both of which already use `.product-list` + `.product-thumb`.
- No JS. No new dependencies. No Webflow markup change.
