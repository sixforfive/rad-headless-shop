## MODIFIED Requirements

### Requirement: Availability drives which branch is visible

Elements marked `data-when="available"` SHALL be visible only inside a wrapper whose `data-available` is `"true"`. Elements marked `data-when="sold-out"` SHALL be visible only inside a wrapper whose `data-available` is `"false"`. Before a wrapper has any `data-available` value, neither branch SHALL be visible, so the two never appear at once. During that time the `data-when="available"` children SHALL keep their layout space and SHALL NOT receive clicks, and the `data-when="sold-out"` children SHALL take no space, so content around the wrapper does not move when an available variant resolves.

#### Scenario: Available product

- **WHEN** a wrapper carries `data-available="true"`
- **THEN** its `data-when="available"` children are visible and its `data-when="sold-out"` children are hidden

#### Scenario: Sold-out product

- **WHEN** a wrapper carries `data-available="false"`
- **THEN** its `data-when="sold-out"` children are visible and its `data-when="available"` children are hidden

#### Scenario: Before the response lands

- **WHEN** a wrapper has `data-variant-id` but no `data-available` yet
- **THEN** neither the `data-when="available"` nor the `data-when="sold-out"` children are visible

#### Scenario: Space held before the response

- **WHEN** a wrapper has `data-variant-id` but no `data-available` yet
- **THEN** its `data-when="available"` children occupy their layout space, cannot be clicked, and its `data-when="sold-out"` children occupy none

#### Scenario: Available variant resolves without shift

- **WHEN** a wrapper's variant resolves with `data-available="true"`
- **THEN** elements after the wrapper keep their position
