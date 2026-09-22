## Purpose

Keeps menu and cart drawer lists scrollable while the page behind an open drawer stays locked.

## ADDED Requirements

### Requirement: Drawer lists keep their own scroll

While `.menu-drawer` or `.cart-drawer` is open, that drawer's list SHALL still scroll when its content is taller than the viewport. `html` SHALL NOT use `overflow: clip` while smooth-scroll is stopped.

#### Scenario: Menu list scrolls

- **WHEN** `.menu-drawer` is open and `.menu-list` is taller than the viewport
- **THEN** `.menu-list` scrolls

#### Scenario: Cart list scrolls

- **WHEN** `.cart-drawer` is open and `.cart-list` is taller than the viewport
- **THEN** `.cart-list` scrolls

### Requirement: Page stays locked behind the drawer

When a drawer is open and `body` has `is-scroll-locked`, the page SHALL NOT scroll behind the drawer.

#### Scenario: Page does not scroll behind menu

- **WHEN** `.menu-drawer` is open and `body` has `is-scroll-locked`
- **THEN** the page does not scroll behind the drawer
