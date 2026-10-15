# drawer-chrome Specification

## Purpose

Controls which navbar elements are visible while the menu or cart drawer is open, and restores the closed set when the drawer closes.

## Requirements

### Requirement: Menu-open navbar chrome

While `.menu-drawer` is open, `#lights-switch-btn` and `#cart-open` SHALL have class `is-none`. `#cart-title` and `#currency-btn` SHALL keep class `is-none`.

#### Scenario: Menu opens

- **WHEN** the visitor opens the menu drawer
- **THEN** `#lights-switch-btn` and `#cart-open` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`

### Requirement: Cart-open navbar chrome

While `.cart-drawer` is open, `#lights-switch-btn` and `#menu-open` SHALL have class `is-none`. `#cart-title` and `#currency-btn` SHALL NOT have class `is-none`.

#### Scenario: Cart opens

- **WHEN** the visitor opens the cart drawer
- **THEN** `#lights-switch-btn` and `#menu-open` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` do not have class `is-none`

### Requirement: Closed navbar chrome

When the visitor closes the menu or cart without leaving the page, the navbar SHALL keep that drawer's open chrome while `.drawer-wrapper` has class `is-visible`. Open chrome for the menu is `#menu-close` visible, `#lights-switch-btn` and `#menu-open` with class `is-none`, and `.navbar` with class `is-normal`. Open chrome for the cart is `#cart-close`, `#cart-title`, and `#currency-btn` visible, `#lights-switch-btn` and `#cart-open` with class `is-none`, and `.navbar` with class `is-normal`. In the same turn `is-visible` is removed, `#lights-switch-btn`, `#menu-open`, and `#cart-open` SHALL NOT have class `is-none`. `#menu-close`, `#cart-close`, `#cart-title`, and `#currency-btn` SHALL have class `is-none`. `.navbar` SHALL NOT have class `is-normal`.

#### Scenario: Menu stays in open chrome while it reverses

- **WHEN** the visitor closes the menu drawer without leaving the page and `.drawer-wrapper` has class `is-visible`
- **THEN** `#menu-close` does not have class `is-none`
- **AND** `#lights-switch-btn` and `#menu-open` have class `is-none`
- **AND** `.navbar` has class `is-normal`

#### Scenario: Menu chrome returns as the blur starts

- **WHEN** the menu overlay drops class `is-visible`
- **THEN** `#lights-switch-btn`, `#menu-open`, and `#cart-open` do not have class `is-none`
- **AND** `#menu-close` and `#cart-close` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`
- **AND** `.navbar` does not have class `is-normal`

#### Scenario: Cart stays in open chrome while it reverses

- **WHEN** the visitor closes the cart drawer without leaving the page and `.drawer-wrapper` has class `is-visible`
- **THEN** `#cart-close`, `#cart-title`, and `#currency-btn` do not have class `is-none`
- **AND** `#lights-switch-btn` and `#cart-open` have class `is-none`
- **AND** `.navbar` has class `is-normal`

#### Scenario: Cart chrome returns as the blur starts

- **WHEN** the cart overlay drops class `is-visible`
- **THEN** `#lights-switch-btn`, `#menu-open`, and `#cart-open` do not have class `is-none`
- **AND** `#menu-close` and `#cart-close` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`
- **AND** `.navbar` does not have class `is-normal`

### Requirement: Lights hide with `.is-none` on the button

`#lights-switch-btn` with class `is-none` SHALL not be displayed. Adding `is-none` to `#lights-switch-btn` SHALL NOT change `.is-none` on its inner `.meta-link.is-plus` / `.is-minus` glyphs.

#### Scenario: Lights button hidden while a drawer is open

- **WHEN** either drawer is open
- **THEN** `#lights-switch-btn` is not displayed

### Requirement: Page dim while a drawer is open

While either drawer is open, `.main-wrapper` SHALL have class `is-dimmed`. When `.gallery-full-screen` is in the document, it SHALL also have class `is-dimmed`. When both drawers are closed, neither node SHALL have class `is-dimmed`.

#### Scenario: Drawer opens with gallery closed

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` has class `is-none`
- **THEN** `.main-wrapper` and `.gallery-full-screen` have class `is-dimmed`

#### Scenario: Drawer opens with gallery open

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` does not have class `is-none`
- **THEN** `.main-wrapper` and `.gallery-full-screen` have class `is-dimmed`

#### Scenario: Drawer closes

- **WHEN** the visitor closes the drawer
- **THEN** `.main-wrapper` does not have class `is-dimmed`
- **AND** `.gallery-full-screen` does not have class `is-dimmed`

#### Scenario: Drawer opens on a page without fullscreen gallery

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` is not in the document
- **THEN** `.main-wrapper` has class `is-dimmed`
