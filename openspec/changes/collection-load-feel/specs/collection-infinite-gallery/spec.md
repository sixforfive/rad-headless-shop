## MODIFIED Requirements

### Requirement: Each hero image fades in when decoded

On `/`, each unique hero image SHALL start invisible and at `0.98` of its fitted size. When that image's file has decoded, it SHALL fade to opaque and scale to its fitted size after a delay of `250ms` plus a random amount of at most `1200ms`. The fade and the scale SHALL take `600ms` and SHALL run together. The three period copies of that image SHALL fade and scale together. An image that has not decoded SHALL stay invisible and SHALL NOT block images that have. `.collection-hero-logo` SHALL be visible on first paint and SHALL NOT fade or move on enter or leave. The canvas SHALL be visible while tiles are still arriving.

#### Scenario: One image arrives

- **WHEN** one hero image's file has decoded and others have not
- **THEN** that image fades in and scales from `0.98` to its fitted size
- **AND** the images that have not decoded stay invisible

#### Scenario: Copies fade together

- **WHEN** a hero image fades in
- **THEN** every period copy of that same image fades and scales with it

#### Scenario: A stuck file does not block the rest

- **WHEN** one hero file never decodes
- **THEN** the images that did decode still fade in and scale to their fitted size

#### Scenario: Logo stays put

- **WHEN** hero images fade in
- **THEN** `.collection-hero-logo` stays visible and does not fade or move

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and a hero image's file has decoded
- **THEN** that image appears immediately at its fitted size
