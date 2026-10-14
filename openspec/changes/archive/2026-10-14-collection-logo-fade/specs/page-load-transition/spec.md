## MODIFIED Requirements

### Requirement: Collection logo is excluded

On `/`, the rise SHALL apply to the siblings of `.collection-hero-logo`, not to its ancestors. `.collection-hero-logo` SHALL start invisible. When the page becomes ready it SHALL fade to opaque over `0.3s` ease-out, the same enter fade as `.second-menu`, and SHALL NOT move. On leave it SHALL fade out with the hero gallery and SHALL NOT move. After the enter fade it SHALL stay on screen until that leave.

#### Scenario: Collection load

- **WHEN** a visitor opens `/`
- **THEN** `.collection-hero-logo` starts invisible, fades in, and does not move
- **AND** the hero gallery beside it does not rise

#### Scenario: Leaving the collection

- **WHEN** the visitor follows a link from `/` to another page
- **THEN** the hero gallery fades out
- **AND** `.collection-hero-logo` fades out with it and does not move

#### Scenario: Collection content is not frozen

- **WHEN** a visitor opens `/`
- **THEN** the content between `.main-wrapper` and the logo's parent does not hold the page still

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and `/` becomes ready
- **THEN** `.collection-hero-logo` appears immediately and does not fade
