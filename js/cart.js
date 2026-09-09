/**
 * cart.js — Shopify cart identity for the storefront.
 * readCartId — rad-cart-id from localStorage, or ""
 * writeCartId — persist a cart gid under rad-cart-id
 * clearCartId — remove rad-cart-id
 * fetchCart — cart(id) → cart or null
 * createCart — cartCreate with no lines → cart id or ""
 * restoreCart — validate a stored id; clear if expired; keep the key on throw
 * ensureCart — restore if valid, otherwise create and persist
 */

const CART_KEY = "rad-cart-id";

/** readCartId — rad-cart-id from localStorage, or "" */
function readCartId() {
  try {
    return localStorage.getItem(CART_KEY) || "";
  } catch (e) {
    return "";
  }
}

/** writeCartId — persist a cart gid under rad-cart-id */
function writeCartId(id) {
  try {
    localStorage.setItem(CART_KEY, id);
  } catch (e) {}
}

/** clearCartId — remove rad-cart-id */
function clearCartId() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (e) {}
}

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
    }
  }
`;

const CART_CREATE = `
  mutation cartCreate {
    cartCreate {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/** fetchCart — cart(id) answers null when the cart expired or checkout finished */
async function fetchCart(id) {
  const data = await shopifyFetch(CART_QUERY, { id });
  return data?.cart ?? null;
}

/** createCart — userErrors come back in data, not as GraphQL errors */
async function createCart() {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  let data;
  try {
    data = await shopifyFetch(CART_CREATE);
  } catch (e) {
    return "";
  }
  const payload = data?.cartCreate;
  if (!payload?.cart?.id) return "";
  if (payload.userErrors?.length) return "";
  return payload.cart.id;
}

/** restoreCart — one query when a stored id exists; no request on a first visit */
async function restoreCart() {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  const id = readCartId();
  if (!id) return "";
  try {
    const cart = await fetchCart(id);
    if (cart?.id) return cart.id;
    clearCartId();
    return "";
  } catch (e) {
    return id;
  }
}

/** ensureCart — create only when restore left nothing usable */
async function ensureCart() {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  const restored = await restoreCart();
  if (restored) return restored;
  const id = await createCart();
  if (id) writeCartId(id);
  return id;
}

restoreCart();
