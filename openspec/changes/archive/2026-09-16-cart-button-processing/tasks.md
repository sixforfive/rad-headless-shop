## 1. Labels

- [x] 1.1 In `js/cart.js` `setCartBusy`, for `[data-add-to-cart]` and `#checkout-btn` only: on `true`, store idle `textContent` in `data-cart-idle-label` if missing then set text to `PROCESSING`; on `false`, restore from that attribute and remove it
- [x] 1.2 In `js/cart.js`, extend the FUNCTIONS EXPLAINER `setCartBusy` line to cover the PROCESSING swap

## 2. Spinner

- [x] 2.1 In `css/global.css`, add `@keyframes` rotate and `[data-add-to-cart][aria-busy="true"]::before, #checkout-btn[aria-busy="true"]::before` — `1em` `currentColor` ring, `inline-block`, `margin-inline-end`, infinite spin
- [x] 2.2 In `css/global.css`, under `prefers-reduced-motion: reduce`, set `animation: none` on those `::before` selectors

## 3. Docs

- [x] 3.1 In `README.md`, update the `js/cart.js` row to cover PROCESSING + spinner on add and checkout while busy
- [x] 3.2 In `openspec/specs/shopify-cart-errors/spec.md`, add the delta requirement (processing label + spinner while a request is in flight)

## 4. Webflow (manual, outside this repo)

- [x] 4.1 Point the Footer `js/cart.js` and `css/global.css` tags at the new commit SHAs and publish

## 5. Verify

- [x] 5.1 On `/product/{slug}`, click add: both add controls show spinner + `PROCESSING` until the drawer opens, then the published label returns
- [x] 5.2 With lines, change qty: `#checkout-btn` shows spinner + `PROCESSING` until the line updates, then the published label returns
- [x] 5.3 Click `#checkout-btn` with a URL and no mutation in flight: immediate redirect, no PROCESSING
