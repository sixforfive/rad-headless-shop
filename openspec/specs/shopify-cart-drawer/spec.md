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

### Requirement: A failed line change shows an error in the drawer

When `cartLinesRemove` or `cartLinesUpdate` returns user errors or the request throws, the site SHALL NOT change the drawer line markup and SHALL show the mapped error node inside `.cart-drawer`. The drawer open state SHALL NOT change. When the row has no cart line id, the site SHALL NOT call Storefront and SHALL NOT show an error.

#### Scenario: Remove or update user errors or throw

- **WHEN** `cartLinesRemove` or `cartLinesUpdate` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was and the mapped error node inside `.cart-drawer` has class `is-visible`

#### Scenario: Missing line id

- **WHEN** the activated control's row has no cart line id
- **THEN** no Storefront line mutation is made and no error node is shown
