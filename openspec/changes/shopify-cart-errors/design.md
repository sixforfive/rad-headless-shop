## Context

See proposal.md — Why. Constraints that shape the approach:

- Scripts are plain `<script src>` tags served from jsDelivr at a commit SHA, no bundler, no modules. Files share one global scope in load order: `js/global.js`, then `js/shopify.js`, then `js/cart.js`.
- Mutations already fail closed: throw or `userErrors` → `""`, callers `if (!cart) return`. Specs currently forbid showing an error.
- `userErrors` selections are `field` and `message` only. Shopify `CartUserError` also has `code`.
- Published markup: `.error-wrapper` in `.layer-cta` (product/merch templates) and in `.cart-drawer`, each with `#error-no-reach`, `#error-soldout`, `#error-stock`, `#error-no-item`. Duplicate ids. Copy is in Webflow.
- Add-to-cart controls are anchors (`href="#"`). Remove is a `div`. `.is-none` is a closed `display: none` list and cannot fade.
- Drawer overlay already uses `opacity` + 0.3s ease and `.is-visible`.

## Goals / Non-Goals

**Goals:**

- Map mutation failures to four kinds and toggle `.is-visible` on the matching node inside the firing wrapper.
- Ignore a second add/qty/remove while a request is in flight.
- CSS fade-in and `translateY` on those nodes, matching the 0.3s drawer ease.

**Non-Goals:**

- Writing copy in JS or reading Shopify `message`.
- Auto-dismiss timers.
- Checkout redirect.
- Cart warnings (`MERCHANDISE_NOT_ENOUGH_STOCK`) that still return a cart.
- Changing `js/shopify.js` or `js/global.js`.

## Decisions

**Stay in `js/cart.js`.** Error UI is cart behavior. Alternative considered: `js/global.js`. Rejected — mutations and handlers already live here.

**Query inside the wrapper, never `getElementById`.** Add uses `document.querySelector(".layer-cta")`. Qty/remove uses `document.querySelector(".cart-drawer")`. `root.querySelector("#error-" + kind)` finds the descendant despite duplicate ids. Alternative considered: unique ids per surface. Rejected — Webflow already shipped the four ids twice.

**Mutations return `{ cart, kind }`.** Success: `{ cart, kind: "" }`. Throw, missing payload, `userErrors`: `{ cart: "", kind }`. Callers render only on a truthy cart and show the kind otherwise. Alternative considered: keep returning `""` and parse errors in the handler. Rejected — each mutation would duplicate the kind map.

**`errorKind(userErrors, action)`.** First error's `code` and joined `field`. `INVALID_MERCHANDISE_LINE` → `no-item`. Quantity/stock codes (`NOT_ENOUGH_IN_STOCK`, `MERCHANDISE_NOT_ENOUGH_STOCK`, `INVALID_INCREMENT`) or a field containing `quantity` → `stock`. Add plus `INVALID` on merchandise, or remaining add errors → `soldout`. Empty list, throw path, unknown code → `no-reach`. `createCart` fail and `ensureCart` empty → `no-reach`. Alternative considered: show Shopify `message`. Rejected — gids leak into the page.

**`showCartError(root, kind)` / `hideCartErrors(root)`.** Hide all four `[id^="error-"]` in that root, then add `.is-visible` to `#error-${kind}` when kind is set. No-op when root is missing. Alternative considered: `display` toggle. Rejected — `display: none` cannot fade.

**`cartBusy` flag plus `aria-busy`.** Handlers return immediately when busy. Set busy before `ensureCart` / mutate, clear in `finally`. Set `aria-busy="true"` on `[data-add-to-cart]`, `[data-cart-quantity]`, `[data-cart-remove]` for the duration. Anchors and a remove `div` have no `disabled`. Alternative considered: `pointer-events: none` only. Rejected — `aria-busy` is the accessible lock; the flag is the real guard.

**CSS on `.error-wrapper [id^="error-"]`.** Default `opacity: 0; transform: translateY(0.5rem); pointer-events: none; transition: opacity 0.3s ease, transform 0.3s ease`. `.is-visible` → `opacity: 1; transform: none`. `.error-wrapper { position: relative }` and children `position: absolute` so the four overlay. Add the selector to the existing `prefers-reduced-motion` block (`transition-duration: 0s`) so motion drops with the rest of the site. Alternative considered: Webflow IX2. Rejected — JS already owns `.is-visible`.

**Webflow nodes stay in layout.** Repo CSS hides them. If Webflow uses `display: none`, the fade never runs.

Functions added or changed in `js/cart.js`:

- `CART_CREATE` / `CART_LINES_*` — `userErrors { code field message }`
- `errorKind(userErrors, action)` — `no-reach` | `soldout` | `stock` | `no-item`
- `createCart` / `addCartLines` / `updateCartLine` / `removeCartLine` — `{ cart, kind }`
- `showCartError` / `hideCartErrors` / `setCartBusy`
- `onAddToCart` / `onCartQuantityChange` / `onCartRemove` — busy lock; show or hide

## Risks / Trade-offs

- [Duplicate ids] → Scoped `querySelector` on `.layer-cta` / `.cart-drawer`.
- [Webflow `display: none` on the nodes] → Fade skipped. Nodes must occupy layout.
- [Stock as a Cart warning, not `userErrors`] → `#error-stock` does not show; mutation still succeeds and `renderCart` shows Shopify qty.
- [Failed qty leaves the select on the new value] → Accepted. Fail closed still does not rewrite markup; reload or a later success restores it.

## Migration Plan

1. Confirm `.error-wrapper` nodes in `.layer-cta` and `.cart-drawer` are not `display: none`.
2. Implement `js/cart.js`, `css/global.css`, and the `README.md` row; point the Footer `js/cart.js` and `css/global.css` tags at the new SHAs; publish.
3. On `/product/{slug}`, fail add (offline): `#error-no-reach` in `.layer-cta` fades in; drawer does not open; a second click while pending sends no extra request.
4. Add a line, open the drawer, fail qty/remove (offline): `#error-no-reach` in `.cart-drawer`; lines unchanged.
5. Successful add after a failure: `.layer-cta` error nodes lose `is-visible`.
6. Rollback: previous SHAs. Leftover `.error-wrapper` markup stays hidden by Webflow or by the previous CSS.
