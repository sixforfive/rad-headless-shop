## RENAMED Requirements

- FROM: `### Requirement: A menu link reverses without hiding the drawer`
- TO: `### Requirement: A menu link reverses, then fades out, then leaves`

## MODIFIED Requirements

### Requirement: Close and backdrop play the stages backward

`#menu-close` and a click on the drawer backdrop SHALL play the open stages backward and fade `.drawer-wrapper` out over `0.45s`. Order `3` SHALL leave first. Order `1` SHALL leave last. Within a line node, the last line SHALL leave first. The shell fade SHALL start when the last line is visually out, `0.45s` before its transition ends. The drawer SHALL NOT sit still with no motion between the reverse and the fade. The drawer SHALL be hidden after the overlay fade.

#### Scenario: Close button

- **WHEN** the visitor clicks `#menu-close` while the menu is open
- **THEN** `[menu-reveal="3-down"]` and `[menu-reveal="3-up"]` leave first
- **AND** the about lines leave before the tagline lines
- **AND** `.drawer-wrapper` finishes fading out `0.45s` after its fade starts

#### Scenario: No dead time on close

- **WHEN** the last menu line is visually out after `#menu-close` or a backdrop click
- **THEN** the drawer fade has already started

#### Scenario: Backdrop

- **WHEN** the visitor clicks the drawer backdrop while the menu is open
- **THEN** the same reverse and the same fade run

### Requirement: A menu link reverses, then fades out, then leaves

When a click inside `.menu-drawer` starts a same-origin page leave, the open stages SHALL play backward first while the dimmed page content stays still. When the last line is visually out, `0.45s` before its transition ends, `.drawer-wrapper` and the dimmed page content SHALL fade out together over `0.45s`. The next document SHALL be requested only after that fade ends. The drawer SHALL NOT sit still with no motion between the reverse and the fade. A click that does not start a page leave SHALL NOT reverse the sequence.

#### Scenario: Shop link

- **WHEN** the menu is open and the visitor clicks the shop link
- **THEN** the stages play backward while the page content stays dimmed and still
- **AND** the drawer and the page content start fading as the last line visually finishes
- **AND** the shop page is requested after the fade ends

#### Scenario: No dead time

- **WHEN** the last menu line is visually out
- **THEN** the drawer fade has already started

#### Scenario: External menu link

- **WHEN** the visitor clicks a menu link that opens another tab or a mail client
- **THEN** the stages do not reverse
- **AND** the drawer stays open

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor clicks a menu link
- **THEN** the next page is requested immediately with no reverse and no fade
