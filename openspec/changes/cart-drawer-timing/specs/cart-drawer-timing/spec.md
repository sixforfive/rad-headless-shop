## Purpose

Sets the wait before the cart sequence and the wait after it, and keeps every cart duration on one clock so open, close, and remove stay in step.

## ADDED Requirements

### Requirement: The shell opens, then the sequence waits

When `.cart-drawer` opens and the cart has one or more lines, `.drawer-wrapper` SHALL start its opacity fade and blur in the same turn. The title, product, subtotal, and bottom sequence SHALL start after that, following a pause of `0s`. An empty cart SHALL still only fade the shell, with no sequence.

#### Scenario: Open with lines

- **WHEN** the cart has lines and the visitor opens the cart
- **THEN** the overlay fade and blur start immediately
- **AND** the column titles start in that same turn

#### Scenario: Empty open

- **WHEN** the cart has no lines and the visitor opens the cart
- **THEN** the overlay fades in
- **AND** no title, row, subtotal, or bottom sequence runs

### Requirement: The sequence ends, then the shell waits

When the cart has lines and the visitor closes it, the reverse sequence SHALL finish, then `.drawer-wrapper` SHALL start fading after a pause of `0s`. The fade SHALL NOT start before the last stage ends. The overlay opacity fade SHALL stay `0.45s` and the blur SHALL stay `0.9s`. An empty cart SHALL fade the overlay immediately. Reduced motion SHALL hide the drawer with no reverse and no pause.

#### Scenario: Close with lines

- **WHEN** the cart has lines and the visitor clicks `#cart-close`
- **THEN** the reverse sequence runs
- **AND** the overlay fade starts as the last stage ends

#### Scenario: Empty close

- **WHEN** the cart has no lines and the visitor closes the cart
- **THEN** the overlay fades out immediately

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes a cart with lines
- **THEN** the drawer hides with no reverse and no pause

### Requirement: One duration for each cart stage

A product row SHALL grow, leave, and shrink on remove over the same `0.375s`. That row's SKU, line price, and remove control SHALL use that same `0.375s` on open, on close, and on remove. `.cart-list-titles` and `.cart-bottom` SHALL each move over `0.15s` on open and on close. On open, `.cart-bottom` SHALL start `0.375s` after the subtotal text starts. The menu line time, the menu stagger, and the menu leave tail SHALL NOT change these cart times.

#### Scenario: Remove matches the row

- **WHEN** the visitor removes a line and the update succeeds
- **THEN** that row's height, SKU, price, and remove control finish shrinking together
- **AND** that shrink takes the same time as one row in the open sequence

#### Scenario: Titles match on the way out

- **WHEN** the cart has lines and the visitor closes the cart
- **THEN** the column titles leave over the same time they used on open
- **AND** the bottom bar leaves over that same time
