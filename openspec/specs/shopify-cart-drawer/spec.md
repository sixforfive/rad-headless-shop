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

### Requirement: Clicking remove deletes that cart line

When the visitor activates `[data-cart-remove]` on a cloned cart row, the site SHALL remove that line from the Shopify cart with `cartLinesRemove`. The line SHALL be the one identified by the row's cart line id. On success the site SHALL render the returned cart into `.cart-drawer`. The drawer SHALL stay open. When the returned cart has no lines, the site SHALL show the empty state.

#### Scenario: Remove one of two lines

- **WHEN** the cart has two lines and the visitor clicks `[data-cart-remove]` on one cloned row
- **THEN** that line is removed, the drawer still shows the other line, and `.cart-drawer` stays open

#### Scenario: Remove the last line

- **WHEN** the cart has one line and the visitor clicks `[data-cart-remove]` on that row
- **THEN** `.empty-cart` is visible, `.cart-list` is hidden, and `.cart-drawer` stays open

### Requirement: Changing the quantity select updates that cart line

When the visitor changes `[data-cart-quantity]` on a cloned cart row, the site SHALL update that line's quantity with `cartLinesUpdate`. The quantity SHALL be the selected option's value. On success the site SHALL render the returned cart into `.cart-drawer`. The drawer SHALL stay open.

#### Scenario: Quantity change

- **WHEN** a cloned row's `[data-cart-quantity]` select changes from `1` to `3`
- **THEN** that line's quantity becomes `3`, the row amount and `[data-cart-subtotal]` match the returned cart, and `.cart-drawer` stays open

### Requirement: A failed line change does not rewrite the drawer

When `cartLinesRemove` or `cartLinesUpdate` returns user errors, throws, or the row has no cart line id, the site SHALL NOT change the drawer line markup. The drawer open state SHALL NOT change. User errors or a thrown request SHALL show the mapped error node inside `.cart-drawer`. A missing line id SHALL NOT show an error.

#### Scenario: Remove or update user errors or throw

- **WHEN** `cartLinesRemove` or `cartLinesUpdate` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was and the mapped error node inside `.cart-drawer` has class `is-visible`

#### Scenario: Missing line id

- **WHEN** the activated control's row has no cart line id
- **THEN** no Storefront line mutation is made and no error node is shown

### Requirement: The template row does not mutate the cart

Clicks and changes inside `[data-cart-line-template]` SHALL NOT call `cartLinesRemove` or `cartLinesUpdate`.

#### Scenario: Template control

- **WHEN** the visitor activates `[data-cart-remove]` or `[data-cart-quantity]` on the template row
- **THEN** no Storefront line mutation is made
