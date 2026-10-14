## MODIFIED Requirements

### Requirement: Open gallery forces white body text

When the merch gallery is open at any viewport, `body` SHALL have class `is-full-screen`. Descendants of `.layer` SHALL have `color` `#fff` and `border-color` `#fff`. `body` and nodes that are not descendants of `.layer` SHALL keep theme `color` and `border-color`. When the gallery is closed, `body` SHALL NOT have `is-full-screen`, so layer text and borders SHALL return to the theme tokens.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens on `/merch/{slug}`
- **THEN** `body` has `is-full-screen`
- **AND** descendants of `.layer` have `color` `#fff`

#### Scenario: Open sets white borders

- **WHEN** the gallery opens on `/merch/{slug}`
- **THEN** descendants of `.layer` have `border-color` `#fff`

#### Scenario: Chrome outside the layer keeps theme tokens

- **WHEN** the gallery opens on `/merch/{slug}`
- **THEN** nodes that are not descendants of `.layer` keep their theme `color` and `border-color`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes on `/merch/{slug}`
- **THEN** `body` does not have `is-full-screen`
