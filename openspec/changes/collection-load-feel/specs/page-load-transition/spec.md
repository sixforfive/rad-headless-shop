## MODIFIED Requirements

### Requirement: Collection logo is excluded

On `/`, the motion SHALL apply to the siblings of `.collection-hero-logo`, not to its ancestors. `.collection-hero-logo` SHALL be visible on first paint, SHALL start blurred, and SHALL sharpen when the page is ready. On leave it SHALL blur again. It SHALL NOT fade or move on enter or on leave, and it SHALL stay on screen for the whole visit. When `prefers-reduced-motion: reduce` is set, the logo SHALL stay sharp on enter and on leave.

#### Scenario: Collection load

- **WHEN** a visitor opens `/`
- **THEN** `.collection-hero-logo` is visible, blurred, and still, then sharpens when the page is ready
- **AND** the hero gallery beside it does not rise

#### Scenario: Leaving the collection

- **WHEN** the visitor follows a link from `/` to another page
- **THEN** the hero gallery fades out
- **AND** `.collection-hero-logo` blurs and stays in place until the leave ends

#### Scenario: Collection content is not frozen

- **WHEN** a visitor opens `/`
- **THEN** the content between `.main-wrapper` and the logo's parent does not hold the page still

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and a visitor opens `/` or leaves it
- **THEN** `.collection-hero-logo` stays sharp
