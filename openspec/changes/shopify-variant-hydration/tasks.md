## 1. Storefront client

- [x] 1.1 In `js/shopify.js`, replace the stub docstring with the FUNCTIONS EXPLAINER box listing `shopifyFetch`, `toGid`, `fetchVariants`, `applyVariant`, `hydrateVariants`
- [x] 1.2 In `js/shopify.js`, read `window.RAD_SHOPIFY` into `SHOPIFY` and resolve `API_VERSION` from `SHOPIFY.apiVersion` with a `"2026-07"` default
- [x] 1.3 In `js/shopify.js`, add `async shopifyFetch(query, variables)` — POST to `https://${SHOPIFY.domain}/api/${API_VERSION}/graphql.json` with `Content-Type` and `X-Shopify-Storefront-Access-Token`, return `json.data`, throw `json.errors[0].message`

## 2. Variant hydration

- [x] 2.1 In `js/shopify.js`, add `toGid(id)` — pass through a `gid://` string, otherwise wrap as `gid://shopify/ProductVariant/<id>`
- [x] 2.2 In `js/shopify.js`, add the `VARIANTS_QUERY` GraphQL document — `nodes(ids: $ids)` with `... on ProductVariant { id availableForSale price { amount currencyCode } }`
- [x] 2.3 In `js/shopify.js`, add `fetchVariants(gids)` — one `shopifyFetch` call, return a `Map` keyed by variant gid, skipping null nodes
- [x] 2.4 In `js/shopify.js`, add `applyVariant(wrapper, variant)` — write the price into every `[data-price]` inside the wrapper and set `wrapper.dataset.available`, all lookups scoped to `wrapper`
- [x] 2.5 In `js/shopify.js`, add `hydrateVariants()` — return early when domain or token is missing or no `[data-variant-id]` exists, dedupe the gids, one fetch, `applyVariant` per wrapper, catch failures so no `data-available` is written
- [x] 2.6 In `js/shopify.js`, call `hydrateVariants()` at module bottom, matching the boot style of `js/shop.js` and `js/merch.js`
- [x] 2.7 In `js/shopify.js`, add `formatPrice(amount, currencyCode)` — `Intl.NumberFormat` currency style, cents dropped when the amount is whole

## 3. Visibility CSS

- [x] 3.1 In `css/global.css`, add `[data-variant-id]:not([data-available]) [data-when] { display: none }` so neither branch shows before the response lands
- [x] 3.2 In `css/global.css`, add `[data-available="true"] [data-when="sold-out"], [data-available="false"] [data-when="available"] { display: none }`

## 4. Docs

- [x] 4.1 In `README.md`, replace the `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_TOKEN` env var table with the `window.RAD_SHOPIFY` config shape and why it is not committed
- [x] 4.2 In `README.md`, update the `js/shopify.js` row to cover hydration, and correct the Limits section — price and availability now come from Shopify, not CMS `sold-out`
- [x] 4.3 In `rad-workflow-scripts.md`, add `js/shopify.js` to the site-wide Footer table, noting it loads before the per-page scripts

## 5. Webflow (manual, outside this repo)

- [ ] 5.1 Add the `window.RAD_SHOPIFY` embed to Site Footer, above the `js/shopify.js` tag
- [ ] 5.2 Register `js/shopify.js` in Site Footer at the commit SHA, above the per-page script tags
- [ ] 5.3 Add a `variantId` PlainText field to the Products and Merch collections and fill it for every item
- [ ] 5.4 On `/product/{slug}`, bind `data-variant-id` on `page-wrapper` and mark `data-price`, both add-to-cart buttons with `data-add-to-cart`, `data-quantity` on the dropdown, and `data-when` on the available and sold-out branches
- [ ] 5.5 On `/merch/{slug}`, apply the same markup
- [ ] 5.6 On `/shop` and `/merch`, bind `data-variant-id` on each Collection Item and mark `data-price` plus the `data-when` branches inside it
- [ ] 5.7 Remove the conditional visibility bound to the CMS `sold-out` switch on every page that uses it

## 6. Verify

- [ ] 6.1 Publish and hard-refresh; confirm exactly one `graphql.json` request per page in the network panel
- [ ] 6.2 Confirm an in-stock variant shows its Shopify price with the add-to-cart branch visible, and a sold-out variant shows the sold-out branch only
- [ ] 6.3 On `/shop`, confirm each Collection Item shows its own price and state, not the first item's
- [ ] 6.4 Block the Shopify domain in devtools and confirm both branches stay hidden with no console error storm
