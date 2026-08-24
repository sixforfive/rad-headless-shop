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
| `js/shopify.js` | Shopify Storefront API |
| `scripts/purge.sh` | CSS purge after markup changes |

## Env vars

| Variable | Where | Purpose |
|---|---|---|
| `SHOPIFY_STORE_DOMAIN` | Webflow embed / runtime | Storefront API host |
| `SHOPIFY_STOREFRONT_TOKEN` | Webflow embed / runtime | Public Storefront access token |

## Limits

- Product content and prices come from Webflow CMS at runtime, not this repo.
- `sold-out` is a CMS switch — cart logic must respect it before checkout.

## Security

Storefront tokens are publishable and safe client-side. Never commit Admin API tokens or private keys.
