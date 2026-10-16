## Purpose

Holds the menu and the cart on one open clock and one close clock, so the shell and the content start and finish with the same gaps.

## ADDED Requirements

### Requirement: Blur, dim, and overlay start together

When a drawer opens and the overlay was closed, the backdrop blur, the page dim, and the overlay opacity SHALL start in the same turn. The blur SHALL move from `0px` to `32px`. `.main-wrapper` opacity SHALL move from `1` to `0.3`. When `.gallery-full-screen` is in the document, its opacity SHALL move from `1` to `0.2`. The overlay opacity SHALL move from `0` to `1`. Each of those SHALL take `0.45s` with ease `ease-out`. The same shell SHALL run for `.menu-drawer` and `.cart-drawer`. Swapping from one open drawer to the other SHALL NOT restart the blur, the dim, or the overlay fade.

#### Scenario: Menu open

- **WHEN** the overlay is closed and the visitor opens the menu
- **THEN** the blur, the page dim, and the overlay opacity start together
- **AND** each takes `0.45s` with ease `ease-out`

#### Scenario: Cart open

- **WHEN** the overlay is closed and the visitor opens the cart
- **THEN** the blur, the page dim, and the overlay opacity start together
- **AND** each takes `0.45s` with ease `ease-out`

#### Scenario: Swap does not restart the shell

- **WHEN** the menu is open and the visitor opens the cart
- **THEN** the blur, the dim, and the overlay opacity do not restart

### Requirement: Content starts after the open gap

When `.menu-drawer` opens, its reveal stages SHALL start `0.3s` after the open. When `.cart-drawer` opens and the cart has one or more lines, its title, row, subtotal, and bottom sequence SHALL start `0.3s` after the open. During that `0.3s` the content SHALL stay in its from-state. An empty cart SHALL fade the shell only. Opening one drawer while the other is already open SHALL still wait `0.3s` before the newly shown content starts. Reduced motion SHALL show the content at rest on the first frame, with no pause.

#### Scenario: Menu content waits

- **WHEN** the visitor opens the menu
- **THEN** the first menu line starts `0.3s` after the open
- **AND** the lines are still in their from-state during that pause

#### Scenario: Cart content waits

- **WHEN** the cart has lines and the visitor opens the cart
- **THEN** the column titles start `0.3s` after the open

#### Scenario: Empty cart

- **WHEN** the cart has no lines and the visitor opens the cart
- **THEN** the overlay fades in
- **AND** no title, row, subtotal, or bottom sequence runs

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens the menu
- **THEN** the menu text is at rest on the first frame
- **AND** it does not wait `0.3s`

### Requirement: The shell waits after the reverse

When the menu or a cart with lines closes from `#menu-close`, `#cart-close`, `#keep-shopping`, or a click on the drawer backdrop, the reverse sequence SHALL finish, then `.drawer-wrapper` SHALL start fading `0.3s` later. The fade SHALL NOT start before the last stage ends. An empty cart SHALL fade the overlay immediately. Reduced motion SHALL hide the drawer with no reverse and no pause. A menu link that starts a page leave SHALL NOT use this pause.

#### Scenario: Menu close

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** the reverse sequence finishes
- **AND** the overlay fade starts `0.3s` after that

#### Scenario: Cart close

- **WHEN** the cart has lines and the visitor clicks `#cart-close`
- **THEN** the reverse sequence finishes
- **AND** the overlay fade starts `0.3s` after that

#### Scenario: Empty cart close

- **WHEN** the cart has no lines and the visitor closes the cart
- **THEN** the overlay fades out immediately

#### Scenario: Menu link leave

- **WHEN** the menu is open and the visitor clicks a menu link that starts a page leave
- **THEN** the drawer fade does not wait `0.3s` after the reverse

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes a drawer
- **THEN** the drawer hides with no reverse and no pause
