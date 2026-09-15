## Purpose

Maps Storefront cart failures to four published error nodes, shows them on the surface that fired, hides them on success, and keeps cart controls inert while a request is in flight.

## ADDED Requirements

### Requirement: A failed cart request shows the mapped error node

When a Storefront cart mutation fails, the site SHALL show exactly one published error node inside the wrapper for that action and SHALL NOT change cart line markup. Copy inside those nodes SHALL stay as published. Throw, a missing cart payload, a failed cart create, or an unknown `userErrors` code SHALL show `#error-no-reach`. An add whose merchandise is unavailable, unpublished, or `INVALID` on merchandise SHALL show `#error-soldout`. An add or quantity update rejected for stock or quantity SHALL show `#error-stock`. `INVALID_MERCHANDISE_LINE` SHALL show `#error-no-item`.

#### Scenario: Network or GraphQL throw on add

- **WHEN** add to cart runs and the Storefront request throws or no cart can be created
- **THEN** `#error-no-reach` inside `.layer-cta` has class `is-visible` and no line is added

#### Scenario: Sold out add

- **WHEN** `cartLinesAdd` returns `userErrors` for unavailable or unpublished merchandise
- **THEN** `#error-soldout` inside `.layer-cta` has class `is-visible` and no line is added

#### Scenario: Not enough stock on add or quantity change

- **WHEN** `cartLinesAdd` or `cartLinesUpdate` returns `userErrors` for quantity or stock
- **THEN** `#error-stock` inside the wrapper for that action has class `is-visible` and the cart markup is unchanged

#### Scenario: Line or cart gone

- **WHEN** a mutation returns `INVALID_MERCHANDISE_LINE`
- **THEN** `#error-no-item` inside the wrapper for that action has class `is-visible` and the cart markup is unchanged

#### Scenario: Unknown userErrors code

- **WHEN** a mutation returns `userErrors` whose code is not sold-out, stock, or `INVALID_MERCHANDISE_LINE`
- **THEN** `#error-no-reach` inside the wrapper for that action has class `is-visible`

### Requirement: Add errors show in the product CTA and line errors show in the drawer

An add failure SHALL show its node inside `.layer-cta .error-wrapper`. A quantity or remove failure SHALL show its node inside `.cart-drawer .error-wrapper`. The site SHALL query those ids inside that wrapper, not as document-unique ids. The site SHALL remove `is-visible` from the other three nodes in that wrapper before showing the mapped one.

#### Scenario: Add failure stays on the product page

- **WHEN** add to cart fails
- **THEN** the visible error is inside `.layer-cta` and `.cart-drawer` error nodes do not gain `is-visible`

#### Scenario: Quantity failure stays in the drawer

- **WHEN** `cartLinesUpdate` fails
- **THEN** the visible error is inside `.cart-drawer` and `.layer-cta` error nodes do not gain `is-visible`

### Requirement: A successful cart mutation hides the error nodes

When a cart mutation succeeds, the site SHALL remove `is-visible` from all four error nodes in the wrapper for that action.

#### Scenario: Successful add after a failure

- **WHEN** a later add to cart succeeds after `#error-no-reach` was shown in `.layer-cta`
- **THEN** none of the four `.layer-cta` error nodes have class `is-visible`

### Requirement: Error nodes fade in and move up

When an error node receives `is-visible`, it SHALL fade in and move up. When `prefers-reduced-motion: reduce` is set, it SHALL change opacity only.

#### Scenario: Error appears

- **WHEN** an error node gains class `is-visible`
- **THEN** it becomes visible with a fade and an upward move

### Requirement: Cart controls are inert while a request is in flight

While `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, or `cartLinesRemove` is in flight, a second activation of `[data-add-to-cart]`, `[data-cart-quantity]`, or `[data-cart-remove]` SHALL NOT start another Storefront mutation. Those controls SHALL have `aria-busy="true"` for the duration of the request.

#### Scenario: Double-click add

- **WHEN** the visitor clicks `[data-add-to-cart]` twice before the first request returns
- **THEN** only one Storefront add mutation is made

#### Scenario: Busy attribute

- **WHEN** add to cart is waiting on Storefront
- **THEN** `[data-add-to-cart]` has `aria-busy="true"`
