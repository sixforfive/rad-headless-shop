## ADDED Requirements

### Requirement: The last line fades the empty state in

When the visitor removes the last line, that row finishes shrinking, and `.cart-drawer` stays open, `.empty-cart` SHALL fade in the same way it does when an empty cart opens. It SHALL stay at opacity `0` until `0.45s` after the empty state is shown. It SHALL then fade to opacity `1` over `0.3s` with ease `ease-out`. `.cart-bottom` SHALL stay at rest. The title, row, and subtotal sequence SHALL NOT run again. When `prefers-reduced-motion: reduce` is set, `.empty-cart` SHALL be at rest when the row is gone, with no wait. Closing the cart during that wait SHALL NOT fade `.empty-cart` in afterward.

#### Scenario: Last line

- **WHEN** the cart drawer is open with one line and the visitor removes that line
- **THEN** that row shrinks away
- **AND** `.empty-cart` stays at opacity `0` until `0.45s` after the empty state is shown
- **AND** it then fades to full opacity over `0.3s` with ease `ease-out`
- **AND** `.cart-bottom` does not leave and return
- **AND** the drawer stays open

#### Scenario: Not the last line

- **WHEN** the cart has two lines and the visitor removes one
- **THEN** the remaining line is shown when the shrink ends
- **AND** `.empty-cart` does not fade in

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor removes the last line
- **THEN** `.empty-cart` is at rest when the row is gone
- **AND** it does not wait `0.45s`

#### Scenario: Close during the wait

- **WHEN** the last line has just been removed and the visitor closes the cart before `.empty-cart` fades in
- **THEN** `.empty-cart` does not fade in
