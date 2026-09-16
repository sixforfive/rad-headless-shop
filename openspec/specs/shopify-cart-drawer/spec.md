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

### Requirement: Checkout navigates to the cart checkout URL

When the visitor activates `#checkout-btn` and the current cart has a `checkoutUrl`, the site SHALL navigate to that URL in the same window. The site SHALL use the URL already on the current cart and SHALL NOT fetch a new cart for that click. The site SHALL NOT remove the stored cart identifier on that click.

#### Scenario: Checkout with a URL

- **WHEN** the cart has a `checkoutUrl` and the visitor clicks `#checkout-btn`
- **THEN** the browser navigates to that URL in the same window

#### Scenario: Cart id kept on checkout click

- **WHEN** the visitor clicks `#checkout-btn`
- **THEN** `rad-cart-id` is unchanged

### Requirement: A failed line change shows an error in the drawer

When `cartLinesRemove` or `cartLinesUpdate` returns user errors or the request throws, the site SHALL NOT change the drawer line markup and SHALL show the mapped error node inside `.cart-drawer`. The drawer open state SHALL NOT change. When the row has no cart line id, the site SHALL NOT call Storefront and SHALL NOT show an error.

#### Scenario: Remove or update user errors or throw

- **WHEN** `cartLinesRemove` or `cartLinesUpdate` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was and the mapped error node inside `.cart-drawer` has class `is-visible`

#### Scenario: Missing line id

- **WHEN** the activated control's row has no cart line id
- **THEN** no Storefront line mutation is made and no error node is shown
