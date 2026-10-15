## MODIFIED Requirements

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
