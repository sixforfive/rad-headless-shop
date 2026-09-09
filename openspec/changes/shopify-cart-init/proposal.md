## Why

`shopify-variant-hydration` made Shopify the source of price and stock, but nothing on the site can hold a cart. Every Storefront cart mutation — `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove` — takes a cart id, and checkout is a redirect to that cart's `checkoutUrl`. Without a cart id that survives a page navigation, a Webflow site of full page loads would start a new cart on every click. Shopify also expires carts (10 days idle, or after checkout completes), so a stored id is not automatically a usable one.

## What Changes

- `js/cart.js` stops being empty and gains cart identity: read and write the cart id in `localStorage` under `rad-cart-id`.
- `js/cart.js` gains `cartCreate`, called lazily — only when there is no valid cart id — so a visitor who never adds anything never creates a cart in Shopify.
- `js/cart.js` gains restore-and-validate on load: when a stored id exists, one `cart(id)` query confirms it still resolves. A `null` cart means expired or already checked out, and the key is removed.
- A failed request (network down, GraphQL error) leaves the stored id alone rather than discarding a cart that is probably still good.
- `js/cart.js` joins the site-wide Footer script list, after `js/shopify.js`, so `shopifyFetch` is already in scope.
- No UI changes. Nothing is rendered, no button is wired, no badge is updated.

## Capabilities

### New Capabilities

- `shopify-cart-init`: cart identity for the storefront — persistence of the Shopify cart id, lazy creation, and validation of a stored id against the Storefront API, including what happens when the cart has expired or the request fails.

### Modified Capabilities

- None. `shopify-variant-hydration` keeps its requirements; this change only reuses `shopifyFetch` from `js/shopify.js` without changing it.

## Impact

- `js/cart.js` — currently empty, becomes cart id storage plus the two cart operations.
- `README.md` — the `js/cart.js` row describes cart init, and the `localStorage` key is documented.
- `js/shopify.js` — unchanged; `shopifyFetch`, `SHOPIFY`, and `API_VERSION` are read from the shared global scope.
- Webflow (manual): one `<script src>` for `js/cart.js` in Site Footer, below the `js/shopify.js` tag.
- Adds a second Storefront API request on pages loaded by a visitor who already has a cart id. Visitors without one make no extra request.
- Later changes (add to cart, drawer, badge, checkout) build on `ensureCart` and the stored id; none of them are in this change.
