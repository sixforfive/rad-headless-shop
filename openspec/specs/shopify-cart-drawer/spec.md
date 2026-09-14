# shopify-cart-drawer Specification

## Purpose

Controls Keep shopping and Checkout in the published `.cart-drawer`: Keep shopping closes the drawer, and Checkout is hidden when the cart has no lines.

## Requirements

### Requirement: Keep shopping closes the cart drawer

When the visitor activates `#keep-shopping`, the site SHALL close `.cart-drawer` the same way `#cart-close` closes it.

#### Scenario: Keep shopping while the cart is open

- **WHEN** `.cart-drawer` is open and the visitor clicks `#keep-shopping`
- **THEN** `.cart-drawer` closes the same way a `#cart-close` click closes it

### Requirement: Checkout is hidden when the cart has no lines

When the cart has no lines, the site SHALL hide `#checkout-btn`. When the cart has one or more lines, the site SHALL show `#checkout-btn`. Hiding Checkout SHALL NOT close `.cart-drawer`.

#### Scenario: Empty cart

- **WHEN** the cart has no lines
- **THEN** `#checkout-btn` is hidden

#### Scenario: Cart with lines

- **WHEN** the cart has one or more lines
- **THEN** `#checkout-btn` is visible

#### Scenario: Last line removed

- **WHEN** the visitor removes the last cart line
- **THEN** `#checkout-btn` is hidden and `.cart-drawer` stays open
