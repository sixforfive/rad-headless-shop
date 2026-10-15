## MODIFIED Requirements

### Requirement: Closed navbar chrome

When the visitor closes the menu or cart without leaving the page, the navbar SHALL keep that drawer's open chrome until `.drawer-wrapper` is hidden. Open chrome for the menu is `#menu-close` visible, `#lights-switch-btn` and `#menu-open` with class `is-none`, and `.navbar` with class `is-normal`. Open chrome for the cart is `#cart-close`, `#cart-title`, and `#currency-btn` visible, `#lights-switch-btn` and `#cart-open` with class `is-none`, and `.navbar` with class `is-normal`. When the overlay is hidden and no drawer is open, `#lights-switch-btn`, `#menu-open`, and `#cart-open` SHALL NOT have class `is-none`. `#menu-close`, `#cart-close`, `#cart-title`, and `#currency-btn` SHALL have class `is-none`. `.navbar` SHALL NOT have class `is-normal`.

#### Scenario: Menu stays in open chrome while it closes

- **WHEN** the visitor closes the menu drawer without leaving the page and `.drawer-wrapper` is still shown
- **THEN** `#menu-close` does not have class `is-none`
- **AND** `#lights-switch-btn` and `#menu-open` have class `is-none`
- **AND** `.navbar` has class `is-normal`

#### Scenario: Menu closes

- **WHEN** the menu drawer overlay has finished hiding and no drawer is open
- **THEN** `#lights-switch-btn`, `#menu-open`, and `#cart-open` do not have class `is-none`
- **AND** `#menu-close` and `#cart-close` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`
- **AND** `.navbar` does not have class `is-normal`

#### Scenario: Cart stays in open chrome while it closes

- **WHEN** the visitor closes the cart drawer without leaving the page and `.drawer-wrapper` is still shown
- **THEN** `#cart-close`, `#cart-title`, and `#currency-btn` do not have class `is-none`
- **AND** `#lights-switch-btn` and `#cart-open` have class `is-none`
- **AND** `.navbar` has class `is-normal`

#### Scenario: Cart closes

- **WHEN** the cart drawer overlay has finished hiding and no drawer is open
- **THEN** `#lights-switch-btn`, `#menu-open`, and `#cart-open` do not have class `is-none`
- **AND** `#menu-close` and `#cart-close` have class `is-none`
- **AND** `#cart-title` and `#currency-btn` have class `is-none`
- **AND** `.navbar` does not have class `is-normal`
