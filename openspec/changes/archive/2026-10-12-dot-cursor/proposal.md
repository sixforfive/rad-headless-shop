## Why

Webflow assigns `cursor: pointer` on hover targets. That native pointer should be a 12×12 dot that blends with `difference`, owned by this repo, on every element whose cursor is pointer.

## What Changes

- **BREAKING** Wherever the computed cursor is `pointer`, the native pointer is hidden and a 12×12 white dot with `mix-blend-mode: difference` sits on the hotspot.
- Grab, grabbing, text, and the default arrow stay native.
- The existing `custom-cursor` label still trails the pointer and does not take clicks.
- Fine pointers only. Coarse pointers keep the native cursor and get no dot.

## Capabilities

### New Capabilities

- `dot-cursor`: 12×12 difference-blend dot in place of the native pointer wherever the computed cursor is `pointer`.

### Modified Capabilities

- `cursor-label`: The label still follows and does not take clicks. It no longer requires the native pointer to stay visible while the dot replaces it.
- `collection-infinite-gallery`: A fine pointer over an image plane still assigns `cursor: pointer` and shows `[SHOP COLLECTION]`. The visitor sees the dot. A gap still uses the grab cursor.

## Impact

- `css/global.css` — dot element and the rule that hides the native pointer while the dot is shown.
- `js/global.js` — show the dot from the same fine-pointer path as `initCursorLabel`.
- `js/collection.js` keeps assigning `pointer`, `grab`, and `grabbing`. No Webflow markup change. No new dependency.
