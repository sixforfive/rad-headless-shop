## Purpose

Moves `[menu-reveal]` copy inside `.menu-drawer` in attribute order when the menu opens, and plays that motion backward when the menu closes or a menu link leaves the page.

## ADDED Requirements

### Requirement: Open plays the attribute sequence

When `.menu-drawer` opens, each `[menu-reveal]` inside it SHALL move into its resting position. The attribute value SHALL be `{order}-up`, `{order}-down`, `{order}-stagger-up`, or `{order}-stagger-down`, where `{order}` is a positive integer. `up` SHALL travel upward from `1.25rem` below the resting position. `down` SHALL travel downward from `1.25rem` above the resting position. Nodes that share an order SHALL start together. A lower order SHALL start before a higher order. The last motion SHALL end at `0.45s`. The ease SHALL be `ease-out`. The rested position SHALL NOT be painted on the first frame of the open.

#### Scenario: Menu opens

- **WHEN** the visitor opens the menu
- **THEN** `[menu-reveal="1-up"]` moves up with no fade
- **AND** `[menu-reveal="2-stagger-up"]` follows it
- **AND** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` start together after that
- **AND** the last of those motions ends at `0.45s`

#### Scenario: No rested flash

- **WHEN** the menu becomes visible
- **THEN** the attributed nodes are already at their from-position on that first frame

### Requirement: Only order 3 and above fades

A `[menu-reveal]` whose order is `1` or `2` SHALL NOT change opacity. A `[menu-reveal]` whose order is `3` or greater SHALL fade from transparent to opaque while it moves.

#### Scenario: Tagline and about

- **WHEN** the menu opens
- **THEN** `[menu-reveal="1-up"]` and `[menu-reveal="2-stagger-up"]` stay fully opaque

#### Scenario: Nav and bottom links

- **WHEN** the menu opens
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` fade in while they move

### Requirement: Stagger splits wrapped lines

A `[menu-reveal]` value that contains `stagger` SHALL reveal each wrapped line of that node's text on its own, in reading order, through a mask. The node itself SHALL NOT move. Each line SHALL use that attribute's direction. The line motions SHALL end by `0.45s` with the rest of the sequence. Orders `1` and `2` SHALL still not fade when the value contains `stagger`.

#### Scenario: About copy

- **WHEN** the menu opens
- **THEN** each wrapped line of `[menu-reveal="2-stagger-up"]` moves up inside its own mask
- **AND** the heading node itself does not move
- **AND** those lines do not fade

### Requirement: Close and backdrop play the sequence backward

`#menu-close` and a click on the drawer backdrop SHALL play the open sequence backward over `0.45s` and fade `.drawer-wrapper` out over `0.45s`. Higher orders SHALL leave before lower orders. The drawer SHALL be hidden after that fade.

#### Scenario: Close button

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` leave first
- **AND** `[menu-reveal="1-up"]` leaves last
- **AND** `.drawer-wrapper` finishes fading out at `0.45s`

#### Scenario: Backdrop

- **WHEN** the visitor clicks the drawer backdrop while the menu is open
- **THEN** the same reverse and the same fade run

### Requirement: A menu link reverses without hiding the drawer

When a click inside `.menu-drawer` starts a same-origin page leave, the open sequence SHALL play backward over `0.45s` in parallel with the page sink. `.drawer-wrapper` SHALL stay visible for the whole leave. A click that does not start a page leave SHALL NOT reverse the sequence.

#### Scenario: Shop link

- **WHEN** the menu is open and the visitor clicks the shop link
- **THEN** the attributed nodes play backward
- **AND** the drawer stays on screen while the page content sinks behind it

#### Scenario: External menu link

- **WHEN** the visitor clicks a menu link that opens another tab or a mail client
- **THEN** the attributed nodes do not reverse
- **AND** the drawer stays open

### Requirement: Drawer shell fade is 0.45s

`.drawer-wrapper` SHALL fade in and out over `0.45s` for both `.menu-drawer` and `.cart-drawer`.

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the overlay fades in over `0.45s` and fades out over `0.45s`

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the overlay fades in over `0.45s` while the attribute sequence runs

### Requirement: Reduced motion snaps

When `prefers-reduced-motion: reduce` is set, `[menu-reveal]` nodes SHALL appear at rest when the menu opens and SHALL disappear with the drawer when it closes, with no move, no fade, and no line split. The drawer shell fade SHALL NOT run.

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens the menu
- **THEN** the attributed text is at rest on the first frame
- **AND** the about copy is not split into lines

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes the menu
- **THEN** the drawer hides with no reverse move
