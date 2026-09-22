## Why

The cursor label only refreshes on `pointermove`. Scroll can move a marked area out from under a still pointer and the label stays on hover. Opening or closing full-width gallery swaps Open/Close under the pointer, but the copy stays stale until the pointer moves.

## What Changes

- Re-hit-test the node under the last pointer position when the pointer is still, so leave and live copy stay in sync with the document.
- Scroll or layout that takes a marked area out from under the pointer fades the label out as leave.
- When the node under the pointer is replaced or its `custom-cursor` value changes without pointer movement, the label text updates immediately (Open → Close and Close → Open).

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `cursor-label`: Label visibility and copy track the marked node under a stationary pointer, not only `pointermove`.

## Impact

- `js/global.js` (`initCursorLabel` only).
- No CSS. No `js/product.js`. No Webflow markup. No new dependencies. No Shopify.
