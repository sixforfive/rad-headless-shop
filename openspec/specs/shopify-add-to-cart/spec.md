# shopify-add-to-cart Specification

## Purpose

Lets a visitor add the current product variant to the Shopify cart from the published add-to-cart controls, using the quantity shown on the page.

## Requirements

### Requirement: Clicking add to cart adds a merchandise line

When the visitor activates an element marked `data-add-to-cart`, the site SHALL add one line to the current Shopify cart. The line's merchandise SHALL be the ProductVariant identified by the nearest ancestor that carries `data-variant-id`. The line's quantity SHALL be the quantity shown on the page for that product. The add SHALL use the Storefront `cartLinesAdd` mutation.

#### Scenario: In-stock product add

- **WHEN** the visitor clicks `[data-add-to-cart]` inside a wrapper whose `data-variant-id` identifies an available variant
- **THEN** the Storefront API receives `cartLinesAdd` for that variant and the chosen quantity

#### Scenario: Either add-to-cart control

- **WHEN** the visitor clicks `#add-to-cart-landscape` or `#add-to-cart-desktop` on a product or merch detail page
- **THEN** the same variant and quantity are sent

### Requirement: Quantity comes from the quantity control

The quantity SHALL be read from the `[data-quantity]` element inside the variant wrapper when that element exists. When it does not, the quantity SHALL be read from `#quantity` inside the wrapper. When that control is a native `select`, or contains one, the quantity SHALL be the selected option's value. Otherwise the quantity SHALL be the control's displayed positive integer. When the control is missing or its value is not a positive integer, the quantity SHALL be `1`.

#### Scenario: Native select

- **WHEN** the wrapper contains a `<select data-quantity>` whose selected option has value `3`
- **THEN** the line quantity is `3`

#### Scenario: Published dropdown without data-quantity

- **WHEN** the wrapper contains `#quantity` showing a numeric child and no `[data-quantity]` element and no native `select`
- **THEN** that number is the line quantity

#### Scenario: Unreadable quantity

- **WHEN** the wrapper has no `#quantity` and no `[data-quantity]`, or the control's value is not a positive integer
- **THEN** the line quantity is `1`

### Requirement: A cart exists before the line is added

The site SHALL obtain a valid cart id before calling `cartLinesAdd`. When no valid stored cart exists, a cart SHALL be created first. The new line SHALL be added to that cart, not to a different cart.

#### Scenario: First add on a new visit

- **WHEN** the visitor clicks add to cart and `rad-cart-id` is empty
- **THEN** a cart is created and `cartLinesAdd` uses the new cart id

#### Scenario: Existing cart

- **WHEN** the visitor clicks add to cart and a valid cart id is already stored
- **THEN** `cartLinesAdd` uses that cart id and no new cart is created

### Requirement: A failed add does not change the page

When the variant id is missing, the cart cannot be obtained, `cartLinesAdd` returns user errors, or the request throws, the site SHALL NOT add a line and SHALL NOT show an error. The stored cart id SHALL be left unchanged except as already required by cart restore and create. Default navigation of the add-to-cart control SHALL be prevented.

#### Scenario: Missing variant id

- **WHEN** the clicked control has no ancestor with a non-empty `data-variant-id`
- **THEN** no Storefront `cartLinesAdd` request is made

#### Scenario: Cart create failed

- **WHEN** add to cart runs and no valid cart id can be obtained
- **THEN** no `cartLinesAdd` request is made

#### Scenario: Add user errors or throw

- **WHEN** `cartLinesAdd` returns `userErrors` or the request throws
- **THEN** the page markup is unchanged and no error message is shown

#### Scenario: Anchor default

- **WHEN** the visitor clicks an add-to-cart control that is an `href="#"` link
- **THEN** the page does not jump to the top

### Requirement: Pages without add-to-cart stay inert

When a page contains no `[data-add-to-cart]` element, the site SHALL NOT call `cartLinesAdd`.

#### Scenario: Listing page

- **WHEN** a visitor loads `/shop` or `/merch`
- **THEN** no `cartLinesAdd` request is made
