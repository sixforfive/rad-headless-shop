/**
 * shopify.js — Shopify Storefront API client and variant hydration.
 * shopifyFetch — POST GraphQL to the Storefront API; returns data, throws on errors
 * toGid — bare variant id or gid string → gid://shopify/ProductVariant/<id>
 * formatPrice — MoneyV2 amount + currencyCode → "1 200 EUR"
 * fetchVariants — one nodes(ids:) call → Map keyed by variant gid
 * applyVariant — price into [data-price], availability into data-available on the wrapper
 * hydrateVariants — collect [data-variant-id], one fetch, apply per wrapper
 */

/* Domain and token come from the Webflow footer embed; this repo is public. */
const SHOPIFY = window.RAD_SHOPIFY || {};
const API_VERSION = SHOPIFY.apiVersion || "2026-07";

/** shopifyFetch — POST GraphQL to the Storefront API; returns data, throws on errors */
async function shopifyFetch(query, variables = {}) {
  const res = await fetch(
    `https://${SHOPIFY.domain}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY.token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

/** toGid — the CMS field holds either a bare numeric id or a full gid */
function toGid(id) {
  const value = (id || "").trim();
  if (!value) return "";
  return value.startsWith("gid://")
    ? value
    : `gid://shopify/ProductVariant/${value}`;
}

const VARIANTS_QUERY = `
  query variants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

/** formatPrice — "1 200 EUR"; Shopify prices are rounded, so no cents. Spaces are
 *  U+00A0 so a price never wraps mid-number or before the currency code. */
function formatPrice(amount, currencyCode) {
  const value = Number(amount);
  if (!Number.isFinite(value) || !currencyCode) return "";
  const grouped = String(Math.round(value)).replace(
    /\B(?=(\d{3})+$)/g,
    "\u00a0",
  );
  return `${grouped}\u00a0${currencyCode}`;
}

/** fetchVariants — nodes() answers any Node type, so ids without a variant come back empty */
async function fetchVariants(gids) {
  const data = await shopifyFetch(VARIANTS_QUERY, { ids: gids });
  const variants = new Map();
  (data?.nodes || []).forEach((node) => {
    if (node?.id) variants.set(node.id, node);
  });
  return variants;
}

/** applyVariant — lookups stay inside the wrapper; a document lookup would cross products */
function applyVariant(wrapper, variant) {
  const price = formatPrice(variant.price?.amount, variant.price?.currencyCode);
  if (price) {
    wrapper.querySelectorAll("[data-price]").forEach((el) => {
      el.textContent = price;
    });
  }
  wrapper.dataset.available = String(variant.availableForSale === true);
}

/** hydrateVariants — one request per page; on failure no wrapper gets data-available */
async function hydrateVariants() {
  if (!SHOPIFY.domain || !SHOPIFY.token) return;

  const wrappers = document.querySelectorAll("[data-variant-id]");
  if (wrappers.length === 0) return;

  const gids = [
    ...new Set(
      Array.from(wrappers, (el) => toGid(el.dataset.variantId)).filter(Boolean),
    ),
  ];
  if (gids.length === 0) return;

  let variants;
  try {
    variants = await fetchVariants(gids);
  } catch (e) {
    return;
  }

  wrappers.forEach((wrapper) => {
    const variant = variants.get(toGid(wrapper.dataset.variantId));
    if (variant) applyVariant(wrapper, variant);
  });
}

hydrateVariants();
