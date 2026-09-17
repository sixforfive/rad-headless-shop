## Why

Shop and merch grids treat every product link the same on hover, so the active item does not stand out. Dim the rest of the list so the hovered `.product-link` is the only one at full opacity.

## What Changes

- Hovering a `.product-link` inside a shop or merch `.product-list` fades every other `.product-link` in that list to 30% opacity.
- The hovered link stays at 100%. Leaving all links restores every `.product-link` to 100%.
- The fade is smooth. Clicks and existing placement stay as they are.

## Capabilities

### New Capabilities

- `product-thumb-hover`: Sibling dim on `.product-list` hover — other `.product-link` nodes fade to 30%, the hovered `.product-link` stays 100%, restore on leave.

### Modified Capabilities

- None.

## Impact

- `css/global.css` (already loaded site-wide).
- Shop `/shop` (gallery and list) and merch `/merch` listing, both of which already use `.product-list` + `.product-thumb` wrapping `.product-link`.
- No JS. No new dependencies. No Webflow markup change.
