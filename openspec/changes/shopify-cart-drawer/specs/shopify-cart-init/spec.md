## MODIFIED Requirements

### Requirement: A stored id is validated on load

When a page loads with a `rad-cart-id` value, the site SHALL query that cart from the Storefront API. The query SHALL request the cart `id`, `totalQuantity`, `cost` (subtotal amount), and `lines` (merchandise, quantity, and line cost). When the API returns a cart with an id, the stored value SHALL be kept.

#### Scenario: Stored cart still exists

- **WHEN** `rad-cart-id` holds a gid and `cart(id)` returns a cart
- **THEN** the key is left unchanged

#### Scenario: No stored id

- **WHEN** a page loads with no `rad-cart-id` value
- **THEN** no Storefront cart request is made and no cart is created

#### Scenario: Query includes lines and cost

- **WHEN** a page loads with a `rad-cart-id` value
- **THEN** the Storefront cart query requests `id`, `totalQuantity`, `cost`, and `lines`
