## MODIFIED Requirements

### Requirement: Collection logo is excluded

On `/`, the rise SHALL apply to the siblings of `.collection-hero-logo`, not to its ancestors. `.collection-hero-logo` SHALL be visible on first paint and SHALL NOT fade or move on enter. On leave it SHALL fade out with the hero gallery and SHALL NOT move. It SHALL stay on screen for the whole visit.

#### Scenario: Collection load

- **WHEN** a visitor opens `/`
- **THEN** `.collection-hero-logo` is visible and still
- **AND** the hero gallery beside it does not rise

#### Scenario: Leaving the collection

- **WHEN** the visitor follows a link from `/` to another page
- **THEN** the hero gallery fades out
- **AND** `.collection-hero-logo` fades out with it and does not move

#### Scenario: Collection content is not frozen

- **WHEN** a visitor opens `/`
- **THEN** the content between `.main-wrapper` and the logo's parent does not hold the page still
