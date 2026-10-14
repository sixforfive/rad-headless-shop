## ADDED Requirements

### Requirement: Rise plays in Chrome, Safari, and Arc

The enter rise SHALL play in Chrome, Safari, and Arc. On every page other than `/`, the visitor SHALL see `.main-wrapper` start invisible and lowered, then move up and fade in. The page SHALL NOT appear already settled. `.second-menu` and `.footer` SHALL fade in with that rise. On `/`, `.collection-hero-logo` SHALL fade in and SHALL NOT move, and the page SHALL NOT rise. The shop Gallery/List switch SHALL sink and rise in those same browsers. Reduced motion SHALL still show the settled page immediately, with no move and no fade.

#### Scenario: Shop enter

- **WHEN** a visitor opens `/shop` in Chrome, Safari, or Arc
- **THEN** the page content starts invisible and lowered, then moves up and fades in
- **AND** it does not appear already settled

#### Scenario: Product enter

- **WHEN** a visitor opens a product page in Chrome, Safari, or Arc
- **THEN** the page content starts invisible and lowered, then moves up and fades in

#### Scenario: Collection does not rise

- **WHEN** a visitor opens `/` in Chrome, Safari, or Arc
- **THEN** `.collection-hero-logo` fades in and does not move
- **AND** the page does not rise

#### Scenario: Gallery to list

- **WHEN** the visitor switches between Gallery and List on `/shop` in Chrome, Safari, or Arc
- **THEN** the product grid moves down and fades out, then moves up and fades in

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and a page becomes ready in Chrome, Safari, or Arc
- **THEN** the page content appears immediately, with no move and no fade
