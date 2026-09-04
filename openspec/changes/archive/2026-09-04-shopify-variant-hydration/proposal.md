## Why

Price and stock live in Webflow CMS (`eur-price`, `pln-price`, `sold-out` switch), so a sale never changes what the site shows — someone has to flip the switch by hand. Shopify now holds the products and variants, and it is the only source that knows `availableForSale`. The site needs to read that at runtime before any cart or checkout work can start.

## What Changes

- `js/shopify.js` gains a Storefront API client: `shopifyFetch(query, variables)` that POSTs GraphQL and returns `data`, throwing on `errors`.
- `js/shopify.js` gains variant hydration: collect every `[data-variant-id]` wrapper on the page, fetch `price` and `availableForSale` for all of them in one `nodes(ids:)` query, write the price into `[data-price]` and the state into `data-available` on the wrapper.
- Store domain and Storefront access token are read from `window.RAD_SHOPIFY`, set in the Webflow Site Footer embed. Nothing is committed to this repo.
- `css/global.css` gains `[data-when]` visibility rules driven by `data-available`, plus a pre-resolve rule that hides both branches until the fetch lands.
- `js/shopify.js` joins the site-wide Footer script list, before the per-page scripts.
- **BREAKING** for the Webflow side: conditional visibility bound to the CMS `sold-out` switch is removed. Sold-out state comes from Shopify from now on.

## Capabilities

### New Capabilities

- `shopify-variant-hydration`: Storefront API client, runtime price and availability hydration keyed on `data-variant-id`, and the DOM contract (role attributes, wrapper state, visibility branches) that Webflow markup must satisfy.

### Modified Capabilities

- None. No existing spec in `openspec/specs/` describes price or stock.

## Impact

- `js/shopify.js` — currently a 4-line stub, becomes the client plus hydration.
- `css/global.css` — two new rules for `[data-when]`.
- `README.md` — env var table replaced by the `window.RAD_SHOPIFY` config shape.
- `rad-workflow-scripts.md` — `js/shopify.js` added to the site-wide Footer table.
- `js/cart.js` stays empty; cart, add to cart, and checkout are a later change.
- Webflow (manual): bind `data-variant-id`, add `data-price` / `data-add-to-cart` / `data-quantity` / `data-when`, drop the `sold-out` conditional visibility, add the config embed.
- New third-party runtime request to `https://{shop}.myshopify.com/api/{version}/graphql.json`. No new dependency, no new script tag beyond the config embed.
