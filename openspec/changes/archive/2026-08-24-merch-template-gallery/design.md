## Context

See proposal.md for motivation. Product gallery is already shipped in [`js/product.js`](../../../js/product.js) and [`css/global.css`](../../../css/global.css), keyed to `.product-gallery-collection.is-default`. Live merch template (`/merch/ex-m01`) now has that combo on the in-page collection and loads `product.js` at pin `d0ab0e9`. Fullscreen collection stays without `is-default`. `/merch` listing does not load `product.js`.

## Goals / Non-Goals

**Goals:**

- Same gallery script and CSS on merch detail as product. No second implementation.
- Spec merch fullscreen without `#download-spec` (control is not on the merch template).

**Non-Goals:**

- New JS or CSS for the gallery.
- Loading `product.js` on `/merch` listing.
- Loading `merch.js` on the merch template.
- Editing the open `fullscreen-gallery` change.
- Extracting `gallery.js`.

## Decisions

### Load `product.js` on the merch template, do not copy it

`setFullScreenGallery`, `setPaginationTicks`, and `setChosenTick` already no-op when nodes are missing and bind `.is-default` when present. One footer script covers fullscreen and snap. `merch.js` stays listing-only (`hydrateMerchThumbs`).

Alternative considered: duplicate the functions in `merch.js` — two copies. Shared `gallery.js` — extra file, not asked.

### Combo `is-default` on the in-page merch collection only

The fullscreen `.product-gallery-collection` is first in the DOM. Without `is-default` on the in-page list, `querySelector(".product-gallery-collection")` would bind fullscreen. Product already uses the combo; merch now matches.

### README is the only repo edit

Webflow wiring is already published. `css/global.css` snap rules already target `.is-default`. Update the Files table so `product.js` is product and merch detail, `merch.js` is merch listing.

On archive, update `product-gallery-snap` Purpose in the main spec to mention merch (delta Purpose is ignored for existing capabilities).

## Risks / Trade-offs

- [Pin drift] → Merch footer must stay on the same `product.js` SHA as the product template.
- [Merch without `#download-spec`] → Accepted; pointer-events rule for that id is a no-op.
- [`is-default` on the fullscreen collection] → Would hide the wrong list on desktop open. Keep it on the in-page collection only.

## Migration Plan

1. Webflow already has `is-default` + `product.js` on the merch template.
2. Update `README.md` script roles.
3. Rollback: remove the merch template `product.js` embed and/or `is-default`; listing is unaffected.
