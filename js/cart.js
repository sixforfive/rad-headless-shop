/**
 * cart.js — Shopify cart identity and add to cart.
 * readCartId — rad-cart-id from localStorage, or ""
 * writeCartId — persist a cart gid under rad-cart-id
 * clearCartId — remove rad-cart-id
 * fetchCart — cart(id) → cart or null
 * createCart — cartCreate with no lines → cart id or ""
 * restoreCart — validate a stored id; clear if expired; keep the key on throw
 * ensureCart — restore if valid, otherwise create and persist
 * readQuantity — quantity from [data-quantity] or #quantity, or 1
 * addCartLines — cartLinesAdd → cart id or ""
 * onAddToCart — click → variant + qty → ensureCart → addCartLines
 * bindAddToCart — document click on [data-add-to-cart]
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

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
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

/** readQuantity — [data-quantity] else #quantity; positive int or 1 */
function readQuantity(wrapper) {
  const el =
    wrapper.querySelector("[data-quantity]") ||
    wrapper.querySelector("#quantity");
  if (!el) return 1;

  const toggle = el.querySelector(".w-dropdown-toggle");
  if (toggle) {
    const n = parseInt(toggle.textContent.trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  for (let i = el.children.length - 1; i >= 0; i--) {
    const text = el.children[i].textContent.trim();
    if (!/^\d+$/.test(text)) continue;
    const n = parseInt(text, 10);
    if (n > 0) return n;
  }
  return 1;
}

/** addCartLines — userErrors come back in data, not as GraphQL errors */
async function addCartLines(cartId, merchandiseId, quantity) {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  let data;
  try {
    data = await shopifyFetch(CART_LINES_ADD, {
      cartId,
      lines: [{ merchandiseId, quantity }],
    });
  } catch (e) {
    return "";
  }
  const payload = data?.cartLinesAdd;
  if (!payload?.cart?.id) return "";
  if (payload.userErrors?.length) return "";
  return payload.cart.id;
}

/** onAddToCart — no request when the wrapper has no usable variant id */
async function onAddToCart(event) {
  event.preventDefault();
  const control = event.target.closest("[data-add-to-cart]");
  if (!control) return;
  const wrapper = control.closest("[data-variant-id]");
  if (!wrapper) return;
  const merchandiseId = toGid(wrapper.dataset.variantId);
  if (!merchandiseId) return;
  const cartId = await ensureCart();
  if (!cartId) return;
  await addCartLines(cartId, merchandiseId, readQuantity(wrapper));
}

/** bindAddToCart — one listener; listings with no buttons never fire it */
function bindAddToCart() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-add-to-cart]")) return;
    onAddToCart(event);
  });
}

restoreCart();
bindAddToCart();
