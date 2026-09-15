## MODIFIED Requirements

### Requirement: A failed add does not change the page

When the variant id is missing, the site SHALL NOT add a line, SHALL NOT call Storefront, and SHALL NOT show an error. When the cart cannot be obtained, `cartLinesAdd` returns user errors, or the request throws, the site SHALL NOT add a line and SHALL show the mapped error node inside `.layer-cta`. The stored cart id SHALL be left unchanged except as already required by cart restore and create. Default navigation of the add-to-cart control SHALL be prevented.

#### Scenario: Missing variant id

- **WHEN** the clicked control has no ancestor with a non-empty `data-variant-id`
- **THEN** no Storefront `cartLinesAdd` request is made and no error node is shown

#### Scenario: Cart create failed

- **WHEN** add to cart runs and no valid cart id can be obtained
- **THEN** no `cartLinesAdd` request is made and `#error-no-reach` inside `.layer-cta` has class `is-visible`

#### Scenario: Add user errors or throw

- **WHEN** `cartLinesAdd` returns `userErrors` or the request throws
- **THEN** no line is added and the mapped error node inside `.layer-cta` has class `is-visible`

#### Scenario: Anchor default

- **WHEN** the visitor clicks an add-to-cart control that is an `href="#"` link
- **THEN** the page does not jump to the top
