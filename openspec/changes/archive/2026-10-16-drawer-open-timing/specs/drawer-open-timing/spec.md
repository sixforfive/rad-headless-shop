## Purpose

Fades one veil behind the menu and the cart, then starts each drawer's content when that veil has finished, and brings the veil back when the content has left.

## ADDED Requirements

### Requirement: The veil and the dim start together

When a drawer opens and the overlay was closed, the veil and the page dim SHALL start in the same turn. `.drawer-wrapper::before` SHALL stay at a backdrop blur of `32px` and its opacity SHALL move from `0` to `1`. `.drawer-wrapper` opacity SHALL snap to `1` and SHALL NOT ease. `.main-wrapper` opacity SHALL move from `1` to `0.3`. When `.gallery-full-screen` is in the document, its opacity SHALL move from `1` to `0.2`. The veil and the dim SHALL each take `0.45s` with ease `ease-out`. The same shell SHALL run for `.menu-drawer` and `.cart-drawer`. Swapping from one open drawer to the other SHALL NOT restart the veil or the dim.

#### Scenario: Menu open

- **WHEN** the overlay is closed and the visitor opens the menu
- **THEN** the veil and the page dim start together
- **AND** each takes `0.45s` with ease `ease-out`
- **AND** the blur radius does not change

#### Scenario: Cart open

- **WHEN** the overlay is closed and the visitor opens the cart
- **THEN** the veil and the page dim start together
- **AND** each takes `0.45s` with ease `ease-out`

#### Scenario: Swap does not restart the shell

- **WHEN** the menu is open and the visitor opens the cart
- **THEN** the veil and the dim do not restart

### Requirement: Content starts after the shell

When `.menu-drawer` opens, its reveal stages SHALL start `0.3s` after the open. When `.cart-drawer` opens and the cart has one or more lines, its title, row, subtotal, and bottom sequence SHALL start `0.45s` after the open. When the cart has no lines, `.empty-cart` and `.cart-bottom` SHALL fade in over `0.3s` with ease `ease-out`, starting `0.45s` after the open. During that wait the content SHALL stay in its from-state. Opening one drawer while the other is already open SHALL still wait before the newly shown content starts: `0.3s` for the menu, `0.45s` for the cart. Reduced motion SHALL show the content at rest on the first frame, with no pause.

#### Scenario: Menu content waits

- **WHEN** the visitor opens the menu
- **THEN** the first menu line starts `0.3s` after the open
- **AND** the lines are still in their from-state during that pause

#### Scenario: Cart content waits

- **WHEN** the cart has lines and the visitor opens the cart
- **THEN** the column titles start `0.45s` after the open
- **AND** the veil and the dim have finished

#### Scenario: Empty cart

- **WHEN** the cart has no lines and the visitor opens the cart
- **THEN** `.empty-cart` starts fading in `0.45s` after the open
- **AND** that fade takes `0.3s` with ease `ease-out`

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens the menu
- **THEN** the menu text is at rest on the first frame
- **AND** it does not wait `0.3s`

### Requirement: Each close meets the end of its content

When the menu closes from `#menu-close` or a click on the drawer backdrop, the veil SHALL start fading `0.6s` before the last line's transition ends. When a cart with lines closes from `#cart-close`, `#keep-shopping`, or a click on the drawer backdrop, the reverse sequence SHALL finish, then the veil SHALL start fading `0.3s` later. When an empty cart closes, `.empty-cart` SHALL fade out over `0.3s` with ease `ease-out`, and the veil SHALL start when that fade ends. Reduced motion SHALL hide the drawer with no reverse and no pause. A menu link that starts a page leave SHALL fade the veil `0.6s` before the last line's transition ends.

#### Scenario: Menu close

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** the veil starts fading `0.6s` before the last line's transition ends

#### Scenario: Cart close

- **WHEN** the cart has lines and the visitor clicks `#cart-close`
- **THEN** the reverse sequence finishes
- **AND** the veil starts fading `0.3s` after that

#### Scenario: Empty cart close

- **WHEN** the cart has no lines and the visitor closes the cart
- **THEN** `.empty-cart` fades out over `0.3s` with ease `ease-out`
- **AND** the veil starts when that fade ends

#### Scenario: Menu link leave

- **WHEN** the menu is open and the visitor clicks a menu link that starts a page leave
- **THEN** the veil starts fading `0.6s` before the last line's transition ends

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes a drawer
- **THEN** the drawer hides with no reverse and no pause
