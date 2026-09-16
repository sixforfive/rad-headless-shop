## ADDED Requirements

### Requirement: Missing checkout URL shows no-reach in the drawer

When the visitor activates `#checkout-btn` and the current cart has no `checkoutUrl`, the site SHALL show `#error-no-reach` inside `.cart-drawer` and SHALL NOT navigate. The site SHALL NOT show `#error-soldout`, `#error-stock`, or `#error-no-item` for that click.

#### Scenario: Checkout URL missing

- **WHEN** `#checkout-btn` is clicked and the cart has no `checkoutUrl`
- **THEN** `#error-no-reach` inside `.cart-drawer` has class `is-visible` and the page does not navigate

## MODIFIED Requirements

### Requirement: Cart controls are inert while a request is in flight

While `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, or `cartLinesRemove` is in flight, a second activation of `[data-add-to-cart]`, `[data-cart-quantity]`, or `[data-cart-remove]` SHALL NOT start another Storefront mutation, and an activation of `#checkout-btn` SHALL NOT navigate. Those controls and `#checkout-btn` SHALL have `aria-busy="true"` for the duration of the request.

#### Scenario: Double-click add

- **WHEN** the visitor clicks `[data-add-to-cart]` twice before the first request returns
- **THEN** only one Storefront add mutation is made

#### Scenario: Busy attribute

- **WHEN** add to cart is waiting on Storefront
- **THEN** `[data-add-to-cart]` has `aria-busy="true"`

#### Scenario: Checkout click while busy

- **WHEN** a cart mutation is in flight and the visitor clicks `#checkout-btn`
- **THEN** the page does not navigate
