## ADDED Requirements

### Requirement: Add and checkout show processing while a request is in flight

While `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, or `cartLinesRemove` is in flight, `[data-add-to-cart]` and `#checkout-btn` SHALL display the text `PROCESSING` with a spinner whose height is the control's font size, placed immediately before that text. Those controls SHALL restore their previous visible text when the request ends. `[data-cart-quantity]` and `[data-cart-remove]` SHALL NOT change their visible text for that wait. Activating `#checkout-btn` when a `checkoutUrl` exists and no request is in flight SHALL navigate without showing `PROCESSING`.

#### Scenario: Add shows processing

- **WHEN** add to cart is waiting on Storefront
- **THEN** `[data-add-to-cart]` shows `PROCESSING` with a `1em` spinner before the text

#### Scenario: Checkout shows processing during a mutation

- **WHEN** a cart mutation is in flight
- **THEN** `#checkout-btn` shows `PROCESSING` with a `1em` spinner before the text

#### Scenario: Labels restore

- **WHEN** the in-flight request finishes
- **THEN** `[data-add-to-cart]` and `#checkout-btn` show the text they had before the wait

#### Scenario: Checkout click with a URL is not a wait

- **WHEN** the cart has a `checkoutUrl` and no mutation is in flight and the visitor clicks `#checkout-btn`
- **THEN** `#checkout-btn` does not show `PROCESSING` and the browser navigates to that URL
