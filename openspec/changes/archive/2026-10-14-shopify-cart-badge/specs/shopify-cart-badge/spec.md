## Purpose

Shows the Shopify cart's total item count on the marked navbar control after restore and after a successful cart mutation.

## ADDED Requirements

### Requirement: The navbar count shows the cart total quantity

When a cart is rendered after restore or after a successful add, update, or remove, every element marked `data-cart-count` SHALL show that cart's `totalQuantity` as text. When there is no cart or the cart has no lines, the text SHALL be `0`.

#### Scenario: Returning visitor with lines

- **WHEN** a page loads with `rad-cart-id` and the cart has `totalQuantity` `3`
- **THEN** `[data-cart-count]` shows `3`

#### Scenario: First visit

- **WHEN** a page loads with no `rad-cart-id` value
- **THEN** `[data-cart-count]` shows `0`

#### Scenario: Successful add

- **WHEN** the visitor adds a line and `cartLinesAdd` returns a cart with `totalQuantity` `2`
- **THEN** `[data-cart-count]` shows `2`

#### Scenario: Successful quantity change

- **WHEN** a line quantity change returns a cart with `totalQuantity` `4`
- **THEN** `[data-cart-count]` shows `4`

#### Scenario: Last line removed

- **WHEN** the last line is removed and the returned cart has `totalQuantity` `0`
- **THEN** `[data-cart-count]` shows `0`

### Requirement: A failed mutation does not rewrite the count

When add, update, or remove does not return a cart, the site SHALL NOT change `[data-cart-count]`.

#### Scenario: Mutation user errors or throw

- **WHEN** `cartLinesAdd`, `cartLinesUpdate`, or `cartLinesRemove` returns `userErrors` or the request throws
- **THEN** `[data-cart-count]` stays as it was

### Requirement: A missing count node is a no-op

When the page has no `[data-cart-count]`, rendering the cart SHALL still complete.

#### Scenario: Attribute not published

- **WHEN** the page has no `[data-cart-count]`
- **THEN** the drawer still renders and no error is thrown
