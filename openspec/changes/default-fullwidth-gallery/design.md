## Context

See proposal.md. `galleryOpen` in `js/product.js` starts false. Boot calls `setFullScreenGallery(true)` only when `sessionStorage` key `rad-fs-gallery` is `"1"`. Product and Merch Head snippets add `html.is-full-screen` only in that same case. `css/global.css` already paints the open gallery from that class. `setFullScreenGallery` applies settled classes in one turn and does not fade. Product and merch share this script.

## Goals / Non-Goals

**Goals:**

- Boot opens unless the one-shot flag is closed.
- First paint matches that, with no chrome fade.
- Keep the existing open and close gestures as zoom in and zoom out.

**Non-Goals:**

- A new zoom control.
- Changing fade timing, blend, or click-through.
- `css/global.css` paint rules. They already key off `html.is-full-screen`.
- Collection or shop galleries.

## Decisions

**Closed flag is `rad-fs-gallery` = `"0"`.** Absence means open, including a leftover `"1"` from the old open flag. Written on `.next-product` only when `galleryOpen` is false; removed when open. Consumed on every `product.js` boot. Alternative: a new key. Rejected: the old key already lives on both templates, and `"1"` still means "not closed."

**Boot calls `setFullScreenGallery(true)` when the flag is not `"0"`.** That path does not fade. When the flag is `"0"`, leave `galleryOpen` false and do not sync. Storage errors fail open.

**Head adds `html.is-full-screen` unless the flag is `"0"`.** Same fail-open on a storage error. `document.body` is still null in Head. Both Product and Merch templates, because they share `product.js`.

## Risks / Trade-offs

- [JS ships before the Head snippet] → `product.js` opens after first paint, so the column gallery flashes. Mitigation: update both Head snippets in the same publish.
- [Old Head snippet left in place] → it only classes `html` when the flag is `"1"`, so a normal visit paints closed until `product.js`. Same mitigation.
- [sessionStorage blocked] → Head and boot both open. No zoomed-out hop.

## Migration Plan

1. Ship `js/product.js`.
2. Replace the Head snippet on Products Template and Merch Template; publish Webflow.
3. Rollback: restore the previous boot (`"1"` opens) and the previous Head snippet.
