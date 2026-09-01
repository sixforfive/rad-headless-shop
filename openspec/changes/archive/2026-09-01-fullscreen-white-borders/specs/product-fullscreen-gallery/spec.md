## MODIFIED Requirements

### Requirement: Open gallery forces white body text

When the gallery is open at any viewport, `body` SHALL have class `is-full-screen`, `color` SHALL be `#fff`, and `border-color` SHALL be `#fff` on `body` and descendants. When the gallery is closed, `body` SHALL NOT have `is-full-screen`, so text color and border color SHALL return to the theme tokens.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens
- **THEN** `body` has `is-full-screen` and `color` is `#fff`

#### Scenario: Open sets white borders

- **WHEN** the gallery opens
- **THEN** `body` has `is-full-screen` and `border-color` on `body` and descendants is `#fff`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes
- **THEN** `body` does not have `is-full-screen`
