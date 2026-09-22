## Purpose

Hides page content until it is laid out, then brings it in a short distance. The collection logo stays still.

## ADDED Requirements

### Requirement: Content rises in on every page

On every page that has `.main-wrapper`, that content SHALL start invisible and lowered by `0.625rem`. After the page's layout scripts have run, it SHALL move up and fade in. The rise SHALL run on the first visit and on each navigation. Navbar, second menu, and footer SHALL stay in place.

#### Scenario: First visit

- **WHEN** a visitor opens any page that has `.main-wrapper`
- **THEN** the page content is invisible and lowered, then moves up and fades in

#### Scenario: Shop grid

- **WHEN** a visitor opens `/shop`
- **THEN** the rise starts only after gallery column placement has run

#### Scenario: Merch grid

- **WHEN** a visitor opens `/merch`
- **THEN** the rise starts only after merch column placement has run

#### Scenario: Chrome stays

- **WHEN** the page content rises
- **THEN** the navbar, second menu, and footer do not move with it

### Requirement: Collection logo stays still

On `/`, `.collection-hero-logo` SHALL NOT move or fade with the page rise. It SHALL stay visible while the rest of the page content rises.

#### Scenario: Collection load

- **WHEN** a visitor opens `/`
- **THEN** `.collection-hero-logo` does not move or fade
- **AND** the other page content moves up and fades in

### Requirement: No leave animation

On a same-origin navigation, the outgoing page SHALL stay visible until the next document can render. The outgoing page SHALL NOT move or fade out. The incoming page SHALL use the rise from the first requirement.

#### Scenario: Shop to product

- **WHEN** the visitor follows a same-origin link from `/shop` to a product page
- **THEN** the shop page does not move or fade out
- **AND** the product page content then moves up and fades in

#### Scenario: FAQ and privacy

- **WHEN** the visitor navigates between `/faq` and `/privacy`
- **THEN** the outgoing page does not move or fade out
- **AND** the incoming page content moves up and fades in

### Requirement: Rise does not wait on prices or textures

The rise SHALL NOT wait for Shopify price or availability, and SHALL NOT wait for collection hero textures to decode.

#### Scenario: Product price arrives later

- **WHEN** a product page rises before the Storefront response
- **THEN** the page content is already visible
- **AND** price and availability may still appear afterward

#### Scenario: Collection textures arrive later

- **WHEN** `/` rises after the hero canvas is mounted
- **THEN** hero textures may still appear afterward

### Requirement: Reduced motion skips the move

When `prefers-reduced-motion: reduce` is set, page content SHALL NOT move. Content SHALL still stay invisible until it is ready, then appear immediately.

#### Scenario: Reduced motion enter

- **WHEN** `prefers-reduced-motion: reduce` is set and a page becomes ready
- **THEN** the page content appears without a move or a fade
