## Why

`.notification-item` runs a CSS loop that starts at `translateX(0)` on every document load. The bar sits in the navbar, outside the content that sinks on leave, so that restart is visible while the rest of the page is transitioning. It reads as a hard load.

## What Changes

- Remember the marquee playhead for the current tab and apply it on the next document before the bar paints, so the loop continues instead of jumping back to the start.
- Cover same-tab navigations that `radLeaveTo` and `radMenuLeaveTo` already perform, including a reload in that tab.
- A new tab, a closed tab, and a page with no `.notification-item` still start at the beginning.
- Hover speed and the empty-bar hide stay as they are.

## Capabilities

### New Capabilities

### Modified Capabilities

- `notification-marquee`: When a `.notification-item` is showing, a same-tab document load continues the loop from the playhead of the previous document instead of `translateX(0)`.

## Impact

- `js/global.js` — write the playhead when the document is leaving.
- `css/global.css` — the loop honors a delay set before first paint.
- Webflow Site Settings → Custom Code → Head — a small snippet reads the saved playhead and sets that delay on `html` before `body` exists. Same pattern as the lights-switch first-paint snippet.
