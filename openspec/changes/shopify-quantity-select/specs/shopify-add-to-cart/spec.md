## MODIFIED Requirements

### Requirement: Quantity comes from the quantity control

The quantity SHALL be read from the `[data-quantity]` element inside the variant wrapper when that element exists. When it does not, the quantity SHALL be read from `#quantity` inside the wrapper. When that control is a native `select`, or contains one, the quantity SHALL be the selected option's value. Otherwise the quantity SHALL be the control's displayed positive integer. When the control is missing or its value is not a positive integer, the quantity SHALL be `1`.

#### Scenario: Native select

- **WHEN** the wrapper contains a `<select data-quantity>` whose selected option has value `3`
- **THEN** the line quantity is `3`

#### Scenario: Published dropdown without data-quantity

- **WHEN** the wrapper contains `#quantity` showing a numeric child and no `[data-quantity]` element and no native `select`
- **THEN** that number is the line quantity

#### Scenario: Unreadable quantity

- **WHEN** the wrapper has no `#quantity` and no `[data-quantity]`, or the control's value is not a positive integer
- **THEN** the line quantity is `1`
