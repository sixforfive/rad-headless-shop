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
