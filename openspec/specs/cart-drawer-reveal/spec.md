# cart-drawer-reveal Specification

## Purpose

Reveals `.cart-drawer` in stages when it opens, plays that motion backward when it closes, and shrinks one row when a line is removed. Timings and eases match the menu drawer.

## Requirements

### Requirement: Opening a cart with lines reveals in stages

When `.cart-drawer` opens and the cart has one or more lines, the overlay SHALL blur and fade in the same way the menu overlay does. `.cart-list-titles` SHALL fade in and move down `4px` over `0.3s` with ease `ease-out`, starting with the blur. Each product row SHALL then grow its image from nothing to its full size over `1.47s` with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`. That row's SKU, line price, and remove control SHALL rise into view on the same `1.47s` and the same ease, from below their own line, and SHALL NOT hold the row open before they are visible. The quantity control SHALL be visible from the start of that row. The next row SHALL start when the previous row's `1.47s` ends. The summary border SHALL move down as each image grows. `[SUBTOTAL]` and the subtotal amount SHALL rise the same way, together, when the last row's `1.47s` ends. `.cart-bottom` SHALL fade in and move up `4px` over `0.3s` with ease `ease-out`, starting `0.75s` after the subtotal text starts. The rested cart SHALL NOT be painted on the first frame of the open.

#### Scenario: Two lines

- **WHEN** the cart has two lines and the visitor opens the cart
- **THEN** the overlay blurs in
- **AND** the column titles fade in and drop `4px`
- **AND** the first image grows while its SKU, price, and remove rise
- **AND** the second row starts only after the first row's `1.47s` ends
- **AND** the subtotal text rises after the second row ends
- **AND** the bottom bar fades and slides up `4px`, starting `0.75s` after the subtotal text starts

#### Scenario: Quantity stays visible

- **WHEN** a product row is growing
- **THEN** its quantity control is visible before the SKU and price read as in

### Requirement: An empty cart only blurs

When `.cart-drawer` opens and the cart has no lines, the overlay SHALL blur and fade in, and the title drop, product grow, subtotal rise, and bottom slide SHALL NOT run.

#### Scenario: Empty open

- **WHEN** the cart has no lines and the visitor opens the cart
- **THEN** the overlay blurs in
- **AND** the column titles do not drop in
- **AND** the bottom bar does not slide in

### Requirement: Closing reverses the open, then fades the shell

`#cart-close`, `#keep-shopping`, and a click on the drawer backdrop SHALL play the open stages backward while the cart has lines. `.cart-bottom` SHALL leave first. The subtotal text SHALL leave next. Product rows SHALL leave from last to first. `.cart-list-titles` SHALL leave last. Each stage SHALL use the same duration and ease it used on open. `.drawer-wrapper` SHALL start fading out `0.6s` before that reverse ends, over `0.45s`. The drawer SHALL be hidden after the overlay fade. Closing an empty cart SHALL fade the overlay immediately over `0.45s`.

#### Scenario: Close with lines

- **WHEN** the cart has lines and the visitor clicks `#cart-close`
- **THEN** the bottom bar leaves first
- **AND** the subtotal text leaves before the product rows
- **AND** the last product row leaves before the first
- **AND** the column titles leave last
- **AND** the overlay fade starts `0.6s` before the reverse ends

#### Scenario: Backdrop and keep shopping

- **WHEN** the visitor clicks the drawer backdrop or `#keep-shopping` while the cart is open with lines
- **THEN** the same reverse and the same fade run

#### Scenario: Empty close

- **WHEN** the cart has no lines and the visitor closes the cart
- **THEN** the overlay fades out over `0.45s` with no reverse

### Requirement: Removing a line shrinks that row, then renders

When the visitor activates `[data-cart-remove]` on a cloned row and the cart update succeeds, that row's image SHALL shrink to nothing over `1.47s` with ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)`. Its SKU, price, and remove control SHALL hide on that same move. The row's padding and quantity height SHALL go to `0` on that same move so the rows below and the summary border move up. The returned cart SHALL be rendered when that move ends. `.cart-drawer` SHALL stay open. The subtotal text SHALL stay visible. Its amount SHALL update when the row is gone. A failed remove SHALL leave the row in place.

#### Scenario: One of two lines

- **WHEN** the cart has two lines and the visitor removes one
- **THEN** that row shrinks away
- **AND** the other row and the summary border move up
- **AND** the drawer stays open
- **AND** the remaining line is shown when the shrink ends

#### Scenario: Failed remove

- **WHEN** the remove request fails
- **THEN** the row stays at full size

### Requirement: An already-open cart does not replay the open

When a line is added or a quantity changes while `.cart-drawer` is already open, the list SHALL update at rest. The open sequence SHALL NOT run again.

#### Scenario: Quantity change while open

- **WHEN** the cart drawer is open and the visitor changes a line quantity
- **THEN** the row updates at its full size
- **AND** the titles, subtotal, and bottom bar stay at rest

### Requirement: Reduced motion snaps the cart

When `prefers-reduced-motion: reduce` is set, opening the cart SHALL show the list at rest with no move and no staged fade. Closing SHALL hide the drawer with no reverse. Removing a line SHALL render the returned cart immediately.

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens a cart with lines
- **THEN** the lines, subtotal, and bottom bar are at rest on the first frame

#### Scenario: Reduced motion remove

- **WHEN** `prefers-reduced-motion: reduce` is set and a remove succeeds
- **THEN** the row is gone without a shrink
