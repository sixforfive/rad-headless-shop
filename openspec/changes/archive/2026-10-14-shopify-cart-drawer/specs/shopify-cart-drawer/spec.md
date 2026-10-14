## Purpose

Shows the current Shopify cart inside the published `.cart-drawer`: real line items after restore and after a successful add, and the empty state when there are no lines.

## ADDED Requirements

### Requirement: The drawer renders each cart line

When a cart with one or more lines is available, the site SHALL show one row per line in `.cart-drawer` by cloning the element marked `data-cart-line-template`. Each clone SHALL display the line's SKU, image, quantity, and line amount. SKU SHALL be the variant `sku` when it is present, otherwise the product title. The line amount SHALL be the line's `cost.totalAmount`, formatted the same way product prices are formatted. The cart subtotal SHALL be written to `[data-cart-subtotal]` from `cost.subtotalAmount`. `.cart-list` SHALL be visible. `.empty-cart` SHALL be hidden. The template row SHALL NOT be visible.

#### Scenario: Cart with two lines

- **WHEN** the cart has two merchandise lines
- **THEN** `.cart-list` is visible, `.empty-cart` is hidden, two cloned rows besides the template show those lines' SKU, image, quantity, and amount, and `[data-cart-subtotal]` shows the cart subtotal

### Requirement: An empty cart shows the empty state

When there is no stored cart id, the cart has no lines, or the stored cart was discarded as expired, the site SHALL show `.empty-cart` and hide `.cart-list`. No cloned line rows SHALL remain. `.cart-product` rows that are not the template SHALL NOT remain.

#### Scenario: First visit

- **WHEN** a page loads with no `rad-cart-id` value
- **THEN** no Storefront cart request is made, `.empty-cart` is visible, `.cart-list` is hidden, and no dummy product rows remain

#### Scenario: Cart with no lines

- **WHEN** `rad-cart-id` exists and `cart(id)` returns a cart with no lines
- **THEN** `.empty-cart` is visible, `.cart-list` is hidden, and no cloned rows remain

#### Scenario: Expired cart

- **WHEN** `rad-cart-id` holds a gid and `cart(id)` returns null
- **THEN** `.empty-cart` is visible, `.cart-list` is hidden, and no dummy product rows remain

### Requirement: A stored cart fills the drawer on load without opening it

When a page loads with a `rad-cart-id` value and the restore query returns a cart, the site SHALL render that cart into `.cart-drawer`. The cart drawer SHALL NOT open as a result of that load.

#### Scenario: Returning visitor with lines

- **WHEN** a page loads with `rad-cart-id` and the cart has lines
- **THEN** the drawer list shows those lines and `.cart-drawer` stays closed

#### Scenario: Restore query throws

- **WHEN** a stored id exists and the cart query throws
- **THEN** the drawer shows the empty state with no dummy product rows and `.cart-drawer` stays closed

### Requirement: A successful add renders the cart and opens the drawer

When `cartLinesAdd` succeeds, the site SHALL render the returned cart into `.cart-drawer` and SHALL open `.cart-drawer` through the existing cart `openDrawer` path. The site SHALL NOT use a second open mechanism.

#### Scenario: Add succeeds

- **WHEN** the visitor adds a line and `cartLinesAdd` returns a cart
- **THEN** the drawer shows the updated lines and `.cart-drawer` is open the same way a `#cart-open` click opens it

### Requirement: A failed add does not open or rewrite the drawer

When add to cart does not add a line, the site SHALL NOT open the drawer and SHALL NOT change the drawer line markup.

#### Scenario: Add user errors or throw

- **WHEN** `cartLinesAdd` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was and does not open
