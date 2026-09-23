## Purpose

Moves `[menu-reveal]` copy inside `.menu-drawer` in three stages when the menu opens, and plays that motion backward when the menu closes or a menu link leaves the page.

## ADDED Requirements

### Requirement: Orders 1 and 2 reveal as masked lines

When `.menu-drawer` opens, order `1` SHALL reveal before order `2`. Each of those nodes SHALL split into the wrapped rows of its text at the drawer width. Each row SHALL be one line that does not wrap again. Each line SHALL move from `yPercent: 100` to `0` over `1.47s`, staggered `0.07s` in reading order, with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`. The node itself SHALL NOT move or fade. Order `2` SHALL start when order `1`'s last line ends. The rested position SHALL NOT be painted on the first frame of the open.

#### Scenario: Tagline then about

- **WHEN** the visitor opens the menu
- **THEN** each line of `[menu-reveal="1-up"]` rises inside its own mask
- **AND** each line of `[menu-reveal="2-stagger-up"]` starts only after the tagline's last line ends
- **AND** neither node fades
- **AND** neither host moves

#### Scenario: A line does not rebreak

- **WHEN** the about copy is split
- **THEN** each mask holds one wrapped row
- **AND** that row does not wrap again inside the mask

#### Scenario: No rested flash

- **WHEN** the menu becomes visible
- **THEN** the lines are already at their from-position on that first frame

### Requirement: Both order 3 nodes enter together after the lines

Both order `3` nodes SHALL start together when order `2`'s last line ends. `down` SHALL travel from above the node. `up` SHALL travel from below the node. Each SHALL move over `1.47s` with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)` and fade from transparent to opaque. Orders `1` and `2` SHALL NOT fade.

#### Scenario: Nav and bottom links

- **WHEN** order `2`'s last line ends
- **THEN** `[menu-reveal="3-down"]` moves down from above and fades in
- **AND** `[menu-reveal="3-up"]` moves up from below and fades in
- **AND** those two start together

### Requirement: Close and backdrop play the stages backward

`#menu-close` and a click on the drawer backdrop SHALL play the open stages backward and fade `.drawer-wrapper` out over `0.45s`. Order `3` SHALL leave first. Order `1` SHALL leave last. Within a line node, the last line SHALL leave first. The drawer SHALL be hidden after the overlay fade.

#### Scenario: Close button

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` leave first
- **AND** the about lines leave before the tagline lines
- **AND** `.drawer-wrapper` finishes fading out at `0.45s`

#### Scenario: Backdrop

- **WHEN** the visitor clicks the drawer backdrop while the menu is open
- **THEN** the same reverse and the same fade run

### Requirement: A menu link reverses without hiding the drawer

When a click inside `.menu-drawer` starts a same-origin page leave, the open stages SHALL play backward in parallel with the page sink. `.drawer-wrapper` SHALL stay visible for the whole leave. The reverse SHALL be longer than the `0.45s` page sink. A click that does not start a page leave SHALL NOT reverse the sequence.

#### Scenario: Shop link

- **WHEN** the menu is open and the visitor clicks the shop link
- **THEN** the stages play backward
- **AND** the drawer stays on screen while the page content sinks behind it

#### Scenario: External menu link

- **WHEN** the visitor clicks a menu link that opens another tab or a mail client
- **THEN** the stages do not reverse
- **AND** the drawer stays open

### Requirement: Drawer shell fade is 0.45s

`.drawer-wrapper` SHALL fade in and out over `0.45s` for both `.menu-drawer` and `.cart-drawer`.

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the overlay fades in over `0.45s` and fades out over `0.45s`

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the overlay fades in over `0.45s` while the line stages run

### Requirement: Reduced motion snaps

When `prefers-reduced-motion: reduce` is set, `[menu-reveal]` nodes SHALL appear at rest when the menu opens and SHALL disappear with the drawer when it closes, with no move, no fade, and no line split. The drawer shell fade SHALL NOT run.

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens the menu
- **THEN** the attributed text is at rest on the first frame
- **AND** the about copy is not split into lines

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes the menu
- **THEN** the drawer hides with no reverse move
