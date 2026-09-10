/**
 * cart.js — Shopify cart identity, add to cart, and drawer render.
 * readCartId — rad-cart-id from localStorage, or ""
 * writeCartId — persist a cart gid under rad-cart-id
 * clearCartId — remove rad-cart-id
 * fetchCart — cart(id) → cart or null
 * createCart — cartCreate with no lines → cart id or ""
 * restoreCart — validate a stored id; set restoredCart; clear if expired; keep the key on throw
 * ensureCart — restore if valid, otherwise create and persist
 * readQuantity — quantity from select.value, [data-quantity] or #quantity, or 1
 * addCartLines — cartLinesAdd → cart or ""
 * fillLine — sku, image, line id, qty, line price into a cloned row
 * renderCart — empty state or cloned lines + subtotal in .cart-drawer
 * onAddToCart — click → variant + qty → ensureCart → addCartLines → renderCart → openDrawer
 * bindAddToCart — document click on [data-add-to-cart]
 * updateCartLine — cartLinesUpdate → cart or ""
 * removeCartLine — cartLinesRemove → cart or ""
 * onCartQuantityChange — change → line id + qty → updateCartLine → renderCart
 * onCartRemove — click → line id → removeCartLine → renderCart
 * bindLineControls — document click on [data-cart-remove], change on [data-cart-quantity]
 */

const CART_KEY = "rad-cart-id";
let restoredCart = null;

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

const CART_FIELDS = `
      id
      totalQuantity
      cost {
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        nodes {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              sku
              product {
                title
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
`;

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
${CART_FIELDS}
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
${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
${CART_FIELDS}
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
    if (cart?.id) {
      restoredCart = cart;
      return cart.id;
    }
    restoredCart = null;
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

/** readQuantity — [data-quantity] else #quantity; select.value, or 1 */
function readQuantity(wrapper) {
  const el =
    wrapper.querySelector("[data-quantity]") ||
    wrapper.querySelector("#quantity");
  if (!el) return 1;

  const select = el.tagName === "SELECT" ? el : el.querySelector("select");
  if (select) {
    const n = parseInt(select.value, 10);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

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
  return payload.cart;
}

/** updateCartLine — userErrors come back in data, not as GraphQL errors */
async function updateCartLine(lineId, quantity) {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  const cartId = readCartId();
  if (!cartId || !lineId) return "";
  let data;
  try {
    data = await shopifyFetch(CART_LINES_UPDATE, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });
  } catch (e) {
    return "";
  }
  const payload = data?.cartLinesUpdate;
  if (!payload?.cart?.id) return "";
  if (payload.userErrors?.length) return "";
  return payload.cart;
}

/** removeCartLine — userErrors come back in data, not as GraphQL errors */
async function removeCartLine(lineId) {
  if (!SHOPIFY.domain || !SHOPIFY.token) return "";
  const cartId = readCartId();
  if (!cartId || !lineId) return "";
  let data;
  try {
    data = await shopifyFetch(CART_LINES_REMOVE, {
      cartId,
      lineIds: [lineId],
    });
  } catch (e) {
    return "";
  }
  const payload = data?.cartLinesRemove;
  if (!payload?.cart?.id) return "";
  if (payload.userErrors?.length) return "";
  return payload.cart;
}

/** fillLine — sku, image, line id, qty, line price into a cloned row */
function fillLine(el, line) {
  const merch = line.merchandise || {};
  const sku = merch.sku || merch.product?.title || "";
  const skuEl = el.querySelector("[data-cart-sku]");
  if (skuEl) skuEl.textContent = sku;

  if (line.id) el.dataset.cartLineId = line.id;
  else el.removeAttribute("data-cart-line-id");

  const img = el.querySelector("[data-cart-image]");
  if (img) {
    const url = merch.image?.url || "";
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    if (url) {
      img.src = url;
      img.alt = merch.image?.altText || sku;
    } else {
      img.removeAttribute("src");
      img.alt = sku;
    }
  }

  const qtyEl = el.querySelector("[data-cart-quantity]");
  if (qtyEl) {
    const qty = String(line.quantity ?? "");
    if (qtyEl.tagName === "SELECT") qtyEl.value = qty;
    else qtyEl.textContent = qty;
  }

  const priceEl = el.querySelector("[data-cart-line-price]");
  if (priceEl) {
    priceEl.textContent = formatPrice(
      line.cost?.totalAmount?.amount,
      line.cost?.totalAmount?.currencyCode,
    );
  }
}

/** renderCart — empty state or cloned lines + subtotal in .cart-drawer */
function renderCart(cart) {
  const list = document.querySelector(".cart-list");
  const empty = document.querySelector(".empty-cart");
  const template = document.querySelector("[data-cart-line-template]");
  const summary = list?.querySelector(".cart-summary");

  list
    ?.querySelectorAll(".cart-product:not([data-cart-line-template])")
    .forEach((row) => row.remove());
  if (template) template.style.display = "none";

  const lines = cart?.lines?.nodes || [];
  if (!lines.length) {
    if (empty) empty.style.display = "flex";
    if (list) list.style.display = "none";
    return;
  }

  if (empty) empty.style.display = "none";
  if (list) list.style.display = "flex";
  if (!template || !list) return;

  const anchor = list.querySelector(".spacer-tiny") || summary;
  lines.forEach((line) => {
    const clone = template.cloneNode(true);
    clone.removeAttribute("data-cart-line-template");
    clone.style.display = "";
    fillLine(clone, line);
    if (anchor) list.insertBefore(clone, anchor);
    else list.appendChild(clone);
  });

  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  if (subtotalEl) {
    subtotalEl.textContent = formatPrice(
      cart.cost?.subtotalAmount?.amount,
      cart.cost?.subtotalAmount?.currencyCode,
    );
  }
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
  const cart = await addCartLines(
    cartId,
    merchandiseId,
    readQuantity(wrapper),
  );
  if (!cart) return;
  renderCart(cart);
  openDrawer("cart", event);
}

/** bindAddToCart — one listener; listings with no buttons never fire it */
function bindAddToCart() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-add-to-cart]")) return;
    onAddToCart(event);
  });
}

/** onCartQuantityChange — no request when the row has no line id */
async function onCartQuantityChange(event) {
  const control = event.target.closest("[data-cart-quantity]");
  if (!control) return;
  if (control.closest("[data-cart-line-template]")) return;
  const row = control.closest(".cart-product");
  const lineId = row?.dataset.cartLineId;
  if (!lineId) return;
  const n = parseInt(control.value, 10);
  if (!Number.isFinite(n) || n <= 0) return;
  const cart = await updateCartLine(lineId, n);
  if (!cart) return;
  renderCart(cart);
}

/** onCartRemove — no request when the row has no line id */
async function onCartRemove(event) {
  const control = event.target.closest("[data-cart-remove]");
  if (!control) return;
  if (control.closest("[data-cart-line-template]")) return;
  const row = control.closest(".cart-product");
  const lineId = row?.dataset.cartLineId;
  if (!lineId) return;
  const cart = await removeCartLine(lineId);
  if (!cart) return;
  renderCart(cart);
}

/** bindLineControls — one listener each; the hidden template never fires a mutation */
function bindLineControls() {
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-cart-remove]")) return;
    onCartRemove(event);
  });
  document.addEventListener("change", (event) => {
    if (!event.target.closest("[data-cart-quantity]")) return;
    onCartQuantityChange(event);
  });
}

restoreCart().then(() => renderCart(restoredCart));
bindAddToCart();
bindLineControls();
