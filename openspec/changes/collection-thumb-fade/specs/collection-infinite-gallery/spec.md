## ADDED Requirements

### Requirement: Each hero image fades in when decoded

On `/`, each unique hero image SHALL start invisible. When that image's file has decoded, it SHALL fade to opaque after a random delay of at most 0.5s. The fade SHALL take 0.45s. The three period copies of that image SHALL fade together. An image that has not decoded SHALL stay invisible and SHALL NOT block images that have. `.collection-hero-logo` SHALL stay visible and SHALL NOT fade with the tiles. The canvas SHALL be visible while tiles are still arriving.

#### Scenario: One image arrives

- **WHEN** one hero image's file has decoded and others have not
- **THEN** that image fades in
- **AND** the images that have not decoded stay invisible

#### Scenario: Copies fade together

- **WHEN** a hero image fades in
- **THEN** every period copy of that same image fades with it

#### Scenario: A stuck file does not block the rest

- **WHEN** one hero file never decodes
- **THEN** the images that did decode still fade in

#### Scenario: Logo stays put

- **WHEN** hero images fade in
- **THEN** `.collection-hero-logo` stays visible and does not fade

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and a hero image's file has decoded
- **THEN** that image appears immediately
