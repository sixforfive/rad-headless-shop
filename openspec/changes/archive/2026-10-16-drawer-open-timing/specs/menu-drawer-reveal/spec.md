## MODIFIED Requirements

### Requirement: Close and backdrop play the stages backward

`#menu-close` and a click on the drawer backdrop SHALL play the open stages backward and fade the veil out over `0.45s` with ease `ease-out`. Order `3` SHALL leave first. Order `1` SHALL leave last. Within a line node, the last line SHALL leave first. The veil SHALL start fading `0.6s` before the last line's transition ends. The drawer SHALL be hidden after the veil fade.

#### Scenario: Close button

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` leave first
- **AND** the about lines leave before the tagline lines
- **AND** the veil starts fading `0.6s` before the last line's transition ends
- **AND** the veil finishes fading `0.45s` after it starts

#### Scenario: No dead time on close

- **WHEN** the last menu line is out of sight after `#menu-close` or a backdrop click
- **THEN** the veil fade has already started

#### Scenario: Backdrop

- **WHEN** the visitor clicks the drawer backdrop while the menu is open
- **THEN** the same reverse and the same fade run

### Requirement: Drawer shell fade is 0.45s

The veil SHALL fade in and out over `0.45s` with ease `ease-out` for both `.menu-drawer` and `.cart-drawer`. `.drawer-wrapper` opacity SHALL NOT ease.

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the veil fades in over `0.45s` with ease `ease-out` and fades out over `0.45s` with ease `ease-out`
- **AND** the cart titles start `0.45s` after the open

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the veil fade starts immediately and takes `0.45s` with ease `ease-out`
- **AND** the line stages start `0.3s` after that fade starts
