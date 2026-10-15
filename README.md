# rad-headless-shop

This repo is the CSS and JavaScript that runs on the published Webflow site, because Webflow does not hold that code.

## Files

| Path | Role |
|---|---|
| `css/global.css` | Site-wide styles |
| `js/global.js` | Drawers, lights, favicon, cursor label, page enter and leave |
| `js/smooth-scroll.js` | Smooth scroll on the window and the product gallery column |
| `js/shop.js` | Shop grid placement and the Gallery/List switch |
| `js/collection.js` | Home page only: infinite hero canvas from the hero gallery images (`type="module"`, imports `three@0.182.0`) |
| `js/product.js` | Product and merch detail: fullscreen gallery, snap, ticks |
| `js/merch.js` | Merch listing grid column |
| `js/faq.js` | Empty |
| `js/cart.js` | Cart stored in the browser, add and edit lines, drawer contents, checkout |
| `js/shopify.js` | Asks Shopify for price and stock and writes them onto the page |

## How the Shopify keys get onto the page

`js/shopify.js` reads the store domain and Storefront token from `window.RAD_SHOPIFY`. That object is set in Webflow under Site Settings, Custom Code, Footer, above the `shopify.js` tag. The keys stay there because this repo is public, and a committed token would stay in git history after every rotation.

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
| `apiVersion` | no | Defaults to `2026-07` |

If that object is missing, the page keeps its static markup and does not call Shopify.

## Limits

- Prices and stock come from Shopify when the page loads. Copy, images, and grid placement come from Webflow.
- The CMS sold-out switch is retired. Availability is `data-available` on the variant wrapper.
- EUR and PLN are not both loaded in one request. The second currency is not wired yet.
- If the Shopify request fails, nothing is marked available, so the page does not offer a product for sale.

## Security

The Storefront token is public and fine in the browser. Never commit an Admin API token or a private key.
