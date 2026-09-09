## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order.
- `shopifyFetch` already lives in `js/shopify.js` and is in scope once that file has run. Domain and token come from `window.RAD_SHOPIFY`.
- `js/cart.js` is empty. Navbar and cart drawer markup already exist on every page.
- The repo is public. Nothing Shopify-secret is committed here.

## Goals / Non-Goals

**Goals:**

- One cart id per browser, restored across full page loads.
- `cartCreate` only when a later caller needs an id and none is valid.
- Boot is restore-only, so a visitor who never adds anything never creates a Shopify cart.

**Non-Goals:**

- Add to cart, line items, drawer rendering, badge, quantity, checkout redirect.
- Expanding the cart query beyond `id`.
- Retries, in-memory cache beyond the stored id, or UI for a failed create.

## Decisions

**`js/cart.js`, reusing `shopifyFetch`.** Cart identity is cart behavior, not hydration. Putting `cartCreate` into `js/shopify.js` would mix the read-path client with cart state. Alternative considered: a third file `js/cart-api.js`. Rejected — one empty file already exists for this.

**Lazy create.** Boot calls `restoreCart()` only. `ensureCart()` runs `cartCreate` when there is no valid id; this change implements it and does not call it. Alternative considered: `ensureCart()` on every page load. Rejected — that would create empty Shopify carts for FAQ, privacy, and every first-time visitor.

**Key `rad-cart-id`, full gid.** Matches `rad-lights`. Shopify cart ids are gids (`gid://shopify/Cart/...`); storing the gid avoids a second normalisation helper. Alternative considered: storing only the token tail. Rejected — `cart(id:)` wants the gid.

**Null cart clears; throw keeps.** `cart(id)` returning `null` is Shopify's signal that the cart expired or checkout finished. A network or GraphQL throw is not that signal, so clearing would drop a probably-valid cart. Alternative considered: clear on any failure. Rejected — a blip would force a new empty cart and lose lines once add-to-cart exists.

**Query is `id` only.** This change only needs to know whether the cart still exists. `totalQuantity`, lines, and `checkoutUrl` wait for the changes that render them. Alternative considered: a full cart fragment now. Rejected — unused fields and a bigger payload for a restore that most pages do not need.

**`userErrors` are a failed create.** `shopifyFetch` only throws on GraphQL `errors`. `cartCreate` can return `data.cartCreate.userErrors` with `cart: null`. `createCart` treats that as failure and does not write the key.

**Site-wide Footer, after `shopify.js`.** The cart drawer lives in the global chrome, so `cart.js` loads once at site level. It must follow `shopify.js` so `shopifyFetch` exists. It no-ops when config is missing, same as `hydrateVariants`.

Functions in `js/cart.js`:

- `readCartId` / `writeCartId` / `clearCartId` — `localStorage` with try/catch
- `fetchCart(id)` — `CART_QUERY`, return the cart or null
- `createCart()` — `CART_CREATE` with no lines; return id or empty string
- `restoreCart()` — if config and stored id, query; keep, clear, or leave on throw
- `ensureCart()` — restore if valid, else `createCart` and persist

GraphQL:

```
query cart($id: ID!) {
  cart(id: $id) {
    id
  }
}

mutation cartCreate {
  cartCreate {
    cart { id }
    userErrors { field message }
  }
}
```

Boot: `restoreCart()` at module bottom.

## Risks / Trade-offs

- [`ensureCart` is unused until add-to-cart] → Deliberate. This change ships the create path without calling it, so QA of `cartCreate` is a console call or the next change.
- [A visitor with a stored id pays one extra `graphql.json` per page] → Accepted. The alternative is a stale id that `cartLinesAdd` would reject.
- [`unauthenticated_write_checkouts` missing on the token] → `createCart` fails closed: no id written. Restore still works on `read` scopes. Fix is a Headless app permission, not a code change.
- [Private mode / blocked `localStorage`] → Same as `rad-lights`: try/catch, no persist, next navigation looks like a first visit.

## Migration Plan

1. Implement `js/cart.js`; update the `README.md` `js/cart.js` row; commit and push to `main`.
2. In Webflow, add the `js/cart.js` tag at that commit SHA in Site Footer, immediately below `js/shopify.js`. Publish.
3. Hard-refresh with no `rad-cart-id`: confirm no cart `graphql.json` request.
4. Set a known-good cart gid in `rad-cart-id`, hard-refresh: confirm one `cart(id)` request and the key remains.
5. Set a garbage gid, hard-refresh: confirm the key is removed.
6. Rollback: remove the `js/cart.js` tag. The `rad-cart-id` key is inert without the script.
