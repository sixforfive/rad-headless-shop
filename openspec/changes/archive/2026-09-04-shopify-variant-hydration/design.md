## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA or tag, no bundler, no modules. Files share one global scope in load order (`rad-workflow-scripts.md`).
- The repo is public. Anything committed here is public and permanent.
- Webflow owns the markup. This repo can only read attributes and classes that already exist in the published DOM.
- `js/shopify.js` exists as a 4-line stub whose docstring already claims the Storefront client role. `js/cart.js` is empty.
- Existing hydration precedent: `hydrateThumbs` in `js/shop.js` reads CMS-bound attributes off elements and writes CSS variables. Same shape, different source.

## Goals / Non-Goals

**Goals:**

- One code path serves listing pages and detail pages, with no knowledge of either layout.
- One network round trip per page.
- Layout-agnostic: adding a product or moving markup in Webflow requires no JS change.

**Non-Goals:**

- Add to cart, cart lines, cart drawer, checkout. Next change; `js/cart.js` stays empty.
- Dual EUR/PLN pricing. Shopify returns the store's currency; the `#currency-btn` toggle keeps its current CMS-driven behavior. Doing this properly means `@inContext(country:)` plus Shopify Markets, which is its own change.
- Wiring `data-quantity`. The attribute is part of the DOM contract so Webflow can be marked up once, but nothing reads it yet.
- Retries, caching, or loading skeletons.

## Decisions

**`js/shopify.js`, not `js/cart.js`.** The user's snippet targeted `cart.js`, but `shopify.js` already exists for exactly this and hydration is not cart behavior — it runs on `/shop` and `/merch` where there is no cart interaction at all. Putting it in `cart.js` would force `cart.js` onto every page and mix read-path and cart state in one file. Alternative considered: a third file `js/variants.js`. Rejected — the Storefront client and its only consumer would be split across two files for no gain.

**Site-wide Footer, before the per-page scripts.** Wrappers exist on four page types. Registering `shopify.js` once at site level is one embed instead of four, and the script no-ops on pages with no wrappers. It must load before per-page scripts so `shopifyFetch` is in scope if a later change needs it.

**Credentials via `window.RAD_SHOPIFY`.** The Storefront token is publishable, so exposure in the browser is expected and fine. Committing it is a different problem: this repo is public and git history is permanent, so a rotated or wrong-store token would live forever in the history and every fork. Reading it from a Webflow embed keeps the value where it can be changed and rotated in one place, and keeps the repo publishable. Alternative considered: hardcoded consts. Rejected on the permanence of git history, not on secrecy.

Shape, set in the Webflow Site Footer above the `shopify.js` tag:

```html
<script>
  window.RAD_SHOPIFY = {
    domain: "rad-dev.myshopify.com",
    token: "xxxxxxxx",
    apiVersion: "2026-07",
  };
</script>
```

`apiVersion` is overridable from the embed with a default in the repo, so a Shopify quarterly version bump is a Webflow edit and a publish — no commit, no jsDelivr URL change.

**`nodes(ids:)` for the batch.** Wrappers on a page are unrelated variants across different products, so per-product queries would mean N round trips and a per-page query builder. `nodes(ids:)` takes an arbitrary id list and returns them in request order, capped at 250 — well above any real page here. Alternative considered: aliased per-variant fields in one document. Rejected — same result with a hand-built query string.

**Variant ids normalized to gid.** Shopify's admin UI shows bare numeric variant ids, and whoever fills the CMS field will paste whichever form is in front of them. Accepting both and normalizing to `gid://shopify/ProductVariant/<id>` costs one function and removes a class of silent CMS-entry bug. Detection is on the `gid://` prefix.

**State on the wrapper, roles on the children.** Children carry attribute names only (`data-price`, `data-add-to-cart`, `data-quantity`) and never a value. All state lives on the wrapper as `data-available`, so CSS resolves visibility with descendant selectors and JS writes exactly one attribute per product. This is what lets the same code serve both page types.

**Every lookup scoped to the wrapper.** `wrapper.querySelector('[data-price]')`, never `document.querySelector`. On `/shop` twelve wrappers each contain a `[data-price]`; a document-level lookup would write all twelve prices into the first product.

**Both branches hidden before the response.** `data-available` is absent until the fetch lands, so with only the two state rules a visitor would briefly see Add to cart and Sold out together. A third rule on `[data-variant-id]:not([data-available]) [data-when]` hides both until the state is known. Alternative considered: server-side default from the CMS `sold-out` switch. Rejected — that reintroduces the field this change retires.

**Failures leave the DOM alone.** A network or GraphQL failure leaves wrappers without `data-available`, so both branches stay hidden and no purchase is offered against unknown stock. Falling open to "available" would let someone try to buy a sold-out piece.

## Risks / Trade-offs

- [Blank price and no buttons if the API is down or the config embed is missing] → Deliberate. Hiding both branches is the safe failure for a store selling numbered one-offs; showing a stale CMS price and a live Add to cart is worse. Cart-phase work can add a visible failure state.
- [Price and buttons pop in after first paint] → Accepted for now. The pre-resolve rule keeps it to one transition rather than a flash of contradictory state. Reserving space is a Webflow layout concern.
- [CMS `variantId` typo yields a wrapper that never resolves] → That wrapper stays in the hidden pre-state, visibly wrong in QA rather than silently priced wrong.
- [Shopify variant ids are now a CMS field maintained by hand] → Unavoidable while Webflow owns the catalog rendering. The gid normalization removes the most likely entry error.
- [Shopify Storefront API version reaches end of life] → `apiVersion` is settable from the embed, so the fix is a Webflow publish.
- [`shopify.js` on every page adds a request to pages with no products] → Small file, and the alternative is four per-page embeds to keep in sync.

## Migration Plan

1. Implement `js/shopify.js` and the `css/global.css` rules; commit and push to `main`.
2. In Webflow, add the `window.RAD_SHOPIFY` embed and the `shopify.js` tag at the commit SHA in Site Footer, above the per-page script tags.
3. In Webflow, mark up one product detail page: `data-variant-id` on `page-wrapper`, `data-price` on the price text, `data-add-to-cart` on both add-to-cart buttons, `data-quantity` on the dropdown, `data-when` on the available and sold-out branches.
4. Publish, hard-refresh, verify against a variant that is in stock and one that is not.
5. Mark up `/shop` and `/merch` Collection Items the same way, one wrapper per item.
6. Remove the conditional visibility bound to the CMS `sold-out` switch.
7. Promote to a tag and update the Webflow URLs per `rad-workflow-scripts.md`.
8. Rollback: point the Webflow script URL back at the previous tag and restore the `sold-out` conditional visibility. The attributes are inert without the script.
