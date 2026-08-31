## Why

Product full-screen gallery behavior now lives in `js/product.js` and `css/global.css` but OpenSpec still describes an older slice (`fullscreen-keep-layer`). This change records the shipped contract so later work can delta from it.

## What Changes

- Document open/close on `/product/{slug}`: desktop (>767px) vs mobile (≤767px) hide/blend, plus hit-testing so nav, CTA, footer, [close], `#close-product`, `#download-spec`, `#add-to-cart`, and `#quantity` stay clickable.
- CSS exception list for those four product controls is a delta on the already-shipped gallery; apply after this update.
- Supersedes the `fullscreen-keep-layer` delta (do not archive that one as the source of truth).

## Capabilities

### New Capabilities

- `product-fullscreen-gallery`: Product template full-screen gallery: triggers, breakpoint open modes, blend, and click-through.

### Modified Capabilities

- None.

## Impact

- `js/product.js` (already implemented).
- `css/global.css` (already implemented).
- Webflow: in-page `.product-gallery-collection.is-default`; [close] may stay hidden on desktop until shown in Designer.
- No new dependencies.
