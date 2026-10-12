## MODIFIED Requirements

### Requirement: Rise does not wait on prices or textures

The rise SHALL NOT wait for Shopify price or availability, and SHALL NOT wait for collection hero textures to decode. On `/`, the hero canvas SHALL be visible while images are still decoding. Each decoded hero image SHALL fade in on its own.

#### Scenario: Product price arrives later

- **WHEN** a product page rises before the Storefront response
- **THEN** the page content is already visible
- **AND** price and availability may still appear afterward

#### Scenario: A hero image arrives on its own

- **WHEN** `/` is showing and one hero image's file has decoded
- **THEN** that image fades in
- **AND** images that have not decoded stay invisible

### Requirement: Collection logo is excluded

On `/`, the motion SHALL apply to the siblings of `.collection-hero-logo`, not to its ancestors. `.collection-hero-logo` SHALL be visible on first paint and SHALL NOT fade or move on enter or on leave, and it SHALL stay on screen for the whole visit.

#### Scenario: Collection load

- **WHEN** a visitor opens `/`
- **THEN** `.collection-hero-logo` is visible and still
- **AND** the hero gallery beside it does not rise

#### Scenario: Leaving the collection

- **WHEN** the visitor follows a link from `/` to another page
- **THEN** the hero gallery fades out
- **AND** `.collection-hero-logo` stays in place until the leave ends

#### Scenario: Collection content is not frozen

- **WHEN** a visitor opens `/`
- **THEN** the content between `.main-wrapper` and the logo's parent does not hold the page still
