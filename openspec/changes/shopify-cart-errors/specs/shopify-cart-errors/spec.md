## Purpose

Maps Storefront cart failures to four published error nodes, shows them on the surface that fired, hides them on success, and keeps cart controls inert while a request is in flight.

## ADDED Requirements

### Requirement: A failed cart request shows the mapped error node

When a Storefront cart mutation fails, the site SHALL show exactly one published error node inside the wrapper for that action and SHALL NOT change cart line markup. Copy inside those nodes SHALL stay as published. Throw, a missing cart payload, a failed cart create, or an unknown `userErrors` code SHALL show `#error-no-reach`. An add whose merchandise is unavailable, unpublished, or `INVALID` on merchandise SHALL show `#error-soldout`. An add or quantity update rejected for stock or quantity SHALL show `#error-stock`. `INVALID_MERCHANDISE_LINE` SHALL show `#error-no-item`.

#### Scenario: Network or GraphQL throw on add

- **WHEN** add to cart runs and the Storefront request throws or no cart can be created
- **THEN** `#error-no-reach` inside the clicked `.cta-wrapper` has class `is-visible` and no line is added

#### Scenario: Sold out add

- **WHEN** `cartLinesAdd` returns `userErrors` for unavailable or unpublished merchandise
- **THEN** `#error-soldout` inside the clicked `.cta-wrapper` has class `is-visible` and no line is added

#### Scenario: Not enough stock on add or quantity change

- **WHEN** `cartLinesAdd` or `cartLinesUpdate` returns `userErrors` for quantity or stock
- **THEN** `#error-stock` inside the wrapper for that action has class `is-visible` and the cart markup is unchanged

#### Scenario: Line or cart gone

- **WHEN** a mutation returns `INVALID_MERCHANDISE_LINE`
- **THEN** `#error-no-item` inside the wrapper for that action has class `is-visible` and the cart markup is unchanged

#### Scenario: Unknown userErrors code

- **WHEN** a mutation returns `userErrors` whose code is not sold-out, stock, or `INVALID_MERCHANDISE_LINE`
- **THEN** `#error-no-reach` inside the wrapper for that action has class `is-visible`

#### Scenario: Quantity or remove merch unavailable

- **WHEN** `cartLinesUpdate` or `cartLinesRemove` returns `userErrors` for unavailable merchandise
- **THEN** `#error-soldout` inside `.cart-drawer` has class `is-visible`

### Requirement: Drawer sold-out and missing-item errors name the SKUs

When `#error-soldout` or `#error-no-item` is shown inside `.cart-drawer`, the site SHALL write the affected lines' SKUs into `.error-item-select` inside that node. Multiple SKUs SHALL be joined by `", "`. Add errors inside `.cta-wrapper` SHALL NOT change `.error-item-select`.

#### Scenario: One line sold out in the drawer

- **WHEN** quantity update fails as sold out on a cloned row whose `[data-cart-sku]` is `EX-001`
- **THEN** `.error-item-select` inside `#error-soldout` in `.cart-drawer` is `EX-001`

#### Scenario: One line gone from the drawer

- **WHEN** remove fails with `INVALID_MERCHANDISE_LINE` on a cloned row whose `[data-cart-sku]` is `EX-002`
- **THEN** `.error-item-select` inside `#error-no-item` in `.cart-drawer` is `EX-002`

#### Scenario: Product page sold-out copy unchanged

- **WHEN** add to cart fails as sold out
- **THEN** `.error-item-select` inside the clicked `.cta-wrapper` is unchanged

### Requirement: Add errors show in the product CTA and line errors show in the drawer

An add failure SHALL show its node inside the clicked control's `.cta-wrapper .error-wrapper`. A quantity or remove failure SHALL show its node inside `.cart-drawer .error-wrapper`. The site SHALL query those ids inside that wrapper, not as document-unique ids. The site SHALL remove `is-visible` from the other three nodes in that wrapper before showing the mapped one. The other breakpoint's `.cta-wrapper` SHALL NOT gain `is-visible` error nodes.

#### Scenario: Add failure stays on the clicked CTA

- **WHEN** add to cart fails
- **THEN** the visible error is inside the clicked `.cta-wrapper` and `.cart-drawer` error nodes do not gain `is-visible`

#### Scenario: Quantity failure stays in the drawer

- **WHEN** `cartLinesUpdate` fails
- **THEN** the visible error is inside `.cart-drawer` and `.cta-wrapper` error nodes do not gain `is-visible`

### Requirement: A successful cart mutation hides the error nodes

When a cart mutation succeeds, the site SHALL remove `is-visible` from all four error nodes in the wrapper for that action.

#### Scenario: Successful add after a failure

- **WHEN** a later add to cart succeeds after `#error-no-reach` was shown in that `.cta-wrapper`
- **THEN** none of the four error nodes in that `.cta-wrapper` have class `is-visible`

### Requirement: Error nodes fade in and move up

When an error node receives `is-visible`, it SHALL fade in and move up. When `is-visible` is removed, it SHALL fade out and move down, then that `.error-wrapper` SHALL gain `is-none` after 0.3s. When `prefers-reduced-motion: reduce` is set, it SHALL change opacity only. Repo CSS SHALL NOT set `position`, inset, or `width` on `.error-wrapper` or `.cta-error_massage`.

#### Scenario: Error appears

- **WHEN** an error node gains class `is-visible`
- **THEN** it becomes visible with a fade and an upward move

#### Scenario: Error disappears

- **WHEN** an error node loses class `is-visible`
- **THEN** it fades and moves down, and its `.error-wrapper` has class `is-none` after 0.3s

### Requirement: Shown errors hide after eight seconds

When an error node is shown, the site SHALL hide that wrapper's error nodes after 8 seconds. A new show or a successful mutation SHALL cancel that timer.

#### Scenario: Auto-hide

- **WHEN** `#error-no-reach` is shown and 8 seconds pass with no new cart mutation
- **THEN** that error node does not have `is-visible` and that `.error-wrapper` has class `is-none` after the hide fade

### Requirement: Cart controls are inert while a request is in flight

While `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, or `cartLinesRemove` is in flight, a second activation of `[data-add-to-cart]`, `[data-cart-quantity]`, or `[data-cart-remove]` SHALL NOT start another Storefront mutation. Those controls SHALL have `aria-busy="true"` for the duration of the request.

#### Scenario: Double-click add

- **WHEN** the visitor clicks `[data-add-to-cart]` twice before the first request returns
- **THEN** only one Storefront add mutation is made

#### Scenario: Busy attribute

- **WHEN** add to cart is waiting on Storefront
- **THEN** `[data-add-to-cart]` has `aria-busy="true"`
