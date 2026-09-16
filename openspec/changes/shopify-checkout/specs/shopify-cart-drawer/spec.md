## ADDED Requirements

### Requirement: Checkout navigates to the cart checkout URL

When the visitor activates `#checkout-btn` and the current cart has a `checkoutUrl`, the site SHALL navigate to that URL in the same window. The site SHALL use the URL already on the current cart and SHALL NOT fetch a new cart for that click. The site SHALL NOT remove the stored cart identifier on that click.

#### Scenario: Checkout with a URL

- **WHEN** the cart has a `checkoutUrl` and the visitor clicks `#checkout-btn`
- **THEN** the browser navigates to that URL in the same window

#### Scenario: Cart id kept on checkout click

- **WHEN** the visitor clicks `#checkout-btn`
- **THEN** `rad-cart-id` is unchanged
