## MODIFIED Requirements

### Requirement: Close and backdrop play the stages backward

`#menu-close` and a click on the drawer backdrop SHALL play the open stages backward and fade `.drawer-wrapper` out over `0.45s` with ease `ease-out`. Order `3` SHALL leave first. Order `1` SHALL leave last. Within a line node, the last line SHALL leave first. The shell fade SHALL start `0.3s` after the last line's transition ends. The drawer SHALL be hidden after the overlay fade.

#### Scenario: Close button

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` leave first
- **AND** the about lines leave before the tagline lines
- **AND** the overlay fade starts `0.3s` after the last line's transition ends
- **AND** `.drawer-wrapper` finishes fading out `0.45s` after its fade starts

#### Scenario: Pause after the reverse

- **WHEN** the last menu line's transition has ended after `#menu-close` or a backdrop click
- **THEN** the drawer fade has not started
- **AND** it starts `0.3s` later

#### Scenario: Backdrop

- **WHEN** the visitor clicks the drawer backdrop while the menu is open
- **THEN** the same reverse and the same fade run

### Requirement: Drawer shell fade is 0.45s

`.drawer-wrapper` SHALL fade in and out over `0.45s` with ease `ease-out` for both `.menu-drawer` and `.cart-drawer`.

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the overlay fades in over `0.45s` with ease `ease-out` and fades out over `0.45s` with ease `ease-out`

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the overlay fade starts immediately and takes `0.45s` with ease `ease-out`
- **AND** the line stages start `0.3s` after that fade starts
