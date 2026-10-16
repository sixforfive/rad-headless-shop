## Why

Opening a product or merch detail page paints the column gallery first. The full-width gallery is the view people stay in, and reaching it takes a click. It should already be open, with the column gallery still available as a zoom-out.

## What Changes

- A `/product/{slug}` or `/merch/{slug}` load starts with the full-width gallery open at the current breakpoint.
- First paint is already open, so the column gallery does not flash.
- Existing close gestures are the zoom-out: desktop click on the full-width image list, click-through chrome, and `#full-screen-close`. Existing open gestures zoom back in.
- `.next-product` still carries a zoomed-out (closed) state for that one hop. A later load with no flag returns to full width.
- Open and close chrome, blend, click-through, and the desktop fade stay as they are. An already-open first paint does not fade.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `product-fullscreen-gallery`: detail load starts full-width; first paint is open unless a one-shot closed flag is set; next-product still carries zoomed-out.
- `merch-fullscreen-gallery`: same on `/merch/{slug}`. Product and merch share `product.js`.

## Impact

- `js/product.js` — boot opens the gallery unless the one-shot flag says closed; `.next-product` writes that closed flag only when zoomed out.
- Webflow Head custom code on Products Template and Merch Template — `html.is-full-screen` before first paint unless that flag is set.
- `css/global.css` — existing `html.is-full-screen` paint rules already cover the open first frame.
