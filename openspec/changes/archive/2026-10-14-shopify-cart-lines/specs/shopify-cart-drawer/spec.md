## ADDED Requirements

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

When `cartLinesRemove` or `cartLinesUpdate` returns user errors, throws, or the row has no cart line id, the site SHALL NOT change the drawer line markup. The drawer open state SHALL NOT change.

#### Scenario: Remove or update user errors or throw

- **WHEN** `cartLinesRemove` or `cartLinesUpdate` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was

#### Scenario: Missing line id

- **WHEN** the activated control's row has no cart line id
- **THEN** no Storefront line mutation is made

### Requirement: The template row does not mutate the cart

Clicks and changes inside `[data-cart-line-template]` SHALL NOT call `cartLinesRemove` or `cartLinesUpdate`.

#### Scenario: Template control

- **WHEN** the visitor activates `[data-cart-remove]` or `[data-cart-quantity]` on the template row
- **THEN** no Storefront line mutation is made
