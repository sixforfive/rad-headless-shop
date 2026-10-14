## Why

Gallery view on `/shop` ends at the last row. Looping that view like a marquee, with a percent in the footer, makes the limited series feel continuous and shows that the set repeats.

## What Changes

- In gallery view only, scrolling past the last original row jumps to the first row (down only; top stays a hard stop).
- JS clones each original `.product-thumb` once (class `.is-clone`). No second Webflow collection.
- List view hides clones so the list is not doubled.
- `#gallery-scroll-counter` shows `00`–`99` of the original collection (zero-padded; never `100`). Hidden in list view.

## Capabilities

### New Capabilities

- `shop-gallery-loop`: Gallery-only down wrap on `/shop`, cloned thumbs for a seamless jump, footer percent of the original set, clones and counter hidden in list view.

### Modified Capabilities

- None.

## Impact

- `js/shop.js` (Shop page only).
- `css/global.css` (clone hide, counter hide).
- Webflow: one Products collection list; `#gallery-scroll-counter` already in the footer.
- Merch grid and list placement unchanged. No new dependencies.
