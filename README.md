# rad-headless-shop

Headless storefront for RAD. Webflow holds CMS content and design reference; this repo holds CSS, page scripts, and Shopify checkout logic wired into the published Webflow site via custom code embeds.

## Why separate from Webflow

Webflow runs the pages and CMS. Shopify handles cart and payment. This repo is the glue — no framework, vanilla JS and CSS only, loaded as static assets.

## Files

| Path | Role |
|---|---|
| `css/global.css` | Site-wide styles |
| `js/global.js` | Cross-page behavior (nav, drawer, currency) |
| `js/shop.js` | Shop grid placement and Gallery/List switch |
| `js/product.js` | Product and merch detail (fullscreen gallery, snap, ticks) |
| `js/merch.js` | Merch listing grid (`merch-column`) |
| `js/faq.js` | FAQ accordion/list |
| `js/cart.js` | Cart state and UI |
| `js/shopify.js` | Storefront API client; hydrates price and availability onto `[data-variant-id]` wrappers |
| `scripts/purge.sh` | CSS purge after markup changes |

## Why the Shopify config is not in this repo

`js/shopify.js` reads the store domain and Storefront token off `window.RAD_SHOPIFY`, set in the Webflow **Site Settings > Custom Code > Footer** above the `shopify.js` tag:

```html
<script>
  window.RAD_SHOPIFY = {
    domain: "your-store.myshopify.com",
    token: "xxxxxxxx",
    apiVersion: "2026-07",
  };
</script>
```

| Key | Required | Purpose |
|---|---|---|
| `domain` | yes | Storefront API host |
| `token` | yes | Public Storefront access token |
| `apiVersion` | no | Defaults to `2026-07` in the repo |

The token is publishable, so having it in the browser is fine — that is not why it lives in Webflow. This repo is public and git history is permanent, so a committed token would outlive every rotation and follow every fork. Keeping it in the embed also means a Shopify quarterly version bump is a Webflow edit and a publish, not a commit and a new jsDelivr URL.

When the object is missing, `hydrateVariants` returns without a request, so pages that never got the embed just render their static markup.

## Limits

- Prices and `availableForSale` come from Shopify at runtime; everything else (copy, images, grid placement) still comes from Webflow CMS.
- The CMS `sold-out` switch is retired. State is `data-available` on the `[data-variant-id]` wrapper.
- One currency per request — `@inContext` is scoped to the whole GraphQL operation, so dual EUR/PLN needs one request per market. Not wired yet; `formatPrice` is the swap point.
- On a failed request no wrapper gets `data-available`, so both branches stay hidden and nothing is offered for sale against unknown stock.

## Security

Storefront tokens are publishable and safe client-side. Never commit Admin API tokens or private keys.
