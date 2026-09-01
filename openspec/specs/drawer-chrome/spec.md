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

When both drawers are closed, `#lights-switch-btn`, `#menu-open`, and `#cart-open` SHALL NOT have class `is-none`. `#cart-title` and `#currency-btn` SHALL have class `is-none`.

#### Scenario: Menu closes

- **WHEN** the visitor closes the menu drawer
- **THEN** `#lights-switch-btn` and `#cart-open` do not have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`

#### Scenario: Cart closes

- **WHEN** the visitor closes the cart drawer
- **THEN** `#lights-switch-btn` and `#menu-open` do not have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`

### Requirement: Lights hide with `.is-none` on the button

`#lights-switch-btn` with class `is-none` SHALL not be displayed. Adding `is-none` to `#lights-switch-btn` SHALL NOT change `.is-none` on its inner `.meta-link.is-plus` / `.is-minus` glyphs.

#### Scenario: Lights button hidden while a drawer is open

- **WHEN** either drawer is open
- **THEN** `#lights-switch-btn` is not displayed
