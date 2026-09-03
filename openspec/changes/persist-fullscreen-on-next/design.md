## Context

See proposal.md. `setFullScreenGallery` in `js/product.js` holds `galleryOpen` in memory. `#next-product` is a normal full-page link. `product.js` is Footer code on Product and Merch templates, so it cannot set open state before first paint. Head custom code runs before `body` exists, so it can only class `html`.

## Goals / Non-Goals

**Goals:**

- One-shot persist across `#next-product` only.
- First paint matches open vs closed.
- Blend allowlist matches `.close-product` and `#next-product`.

**Non-Goals:**

- Sticky session (shop links, refresh, close).
- AJAX product swap.
- Fade curtain.
- `global.js`.

## Decisions

**sessionStorage key `rad-fs-gallery` = `"1"`.** Written on `#next-product` click when `galleryOpen` is true; removed when closed. Consumed on every `product.js` boot. Alternative: query param on the link. Rejected: leaks into the URL and sharing.

**Head snippet classes `html`, not `body`.** `document.body` is null in Head. CSS keys `html.is-full-screen` for the incoming paint (show `.gallery-full-screen`, hide default collection on desktop, hide `.layer` on mobile, white chrome). `setFullScreenGallery` toggles the same class on `html` and `body` so close/resize stay in sync.

**Write in `product.js`, restore in template Head.** Gallery owner is `product.js`. Site-wide `global.js` must not read the flag.

**Allowlist `.close-product` and `#next-product`.** Two close nodes share the class (one per breakpoint). `#next-product` sits in `.layer` outside the existing auto list, so a click would close the gallery instead of navigating.

## Risks / Trade-offs

- [Webflow `.gallery-full-screen.is-none` uses `display: none !important`] → repo override also uses `!important`.
- [Head snippet not deployed] → persist still works after `product.js`, but first paint can flash closed. Mitigation: tasks include the snippet on both templates.
- [sessionStorage blocked] → treat as closed.

## Migration Plan

1. Ship `css/global.css` and `js/product.js`.
2. Paste the Head snippet on Products Template and Merch Template; publish Webflow.
3. Rollback: revert the two files and remove the Head snippet.
