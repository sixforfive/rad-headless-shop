## Purpose

Hides page content until it is laid out, then brings it in, and takes it out on the way to the next route.

## ADDED Requirements

### Requirement: Content rises in on every page

On every page that has `.main-wrapper`, that element SHALL start invisible and lowered. After the page's layout scripts have run, it SHALL move up and fade in. The rise SHALL run on the first visit and on each navigation. Navbar, second menu, and footer SHALL stay in place.

#### Scenario: First visit

- **WHEN** a visitor opens any page that has `.main-wrapper`
- **THEN** `.main-wrapper` is invisible and lowered, then moves up and fades in

#### Scenario: Shop grid

- **WHEN** a visitor opens `/shop`
- **THEN** the rise starts only after gallery column placement has run

#### Scenario: Merch grid

- **WHEN** a visitor opens `/merch`
- **THEN** the rise starts only after merch column placement has run

#### Scenario: Chrome stays

- **WHEN** `.main-wrapper` rises
- **THEN** the navbar, second menu, and footer do not move with it

### Requirement: Content sinks on leave

On a same-origin navigation, the outgoing `.main-wrapper` SHALL stay visible while the next document loads, then move down and fade out. The incoming page SHALL use the rise from the previous requirement. Navbar, second menu, and footer SHALL stay in place.

#### Scenario: Shop to product

- **WHEN** the visitor follows a same-origin link from `/shop` to a product page
- **THEN** the shop `.main-wrapper` moves down and fades out while the product document loads
- **AND** the product `.main-wrapper` then moves up and fades in

#### Scenario: FAQ and privacy

- **WHEN** the visitor navigates between `/faq` and `/privacy`
- **THEN** the same leave and rise run

### Requirement: Rise does not wait on prices or textures

The rise SHALL NOT wait for Shopify price or availability, and SHALL NOT wait for collection hero textures to decode.

#### Scenario: Product price arrives later

- **WHEN** a product page rises before the Storefront response
- **THEN** `.main-wrapper` is already visible
- **AND** price and availability may still appear afterward

#### Scenario: Collection textures arrive later

- **WHEN** `/` rises after the hero canvas is mounted
- **THEN** hero textures may still appear afterward

### Requirement: Reduced motion skips the move

When `prefers-reduced-motion: reduce` is set, `.main-wrapper` SHALL NOT move, and the leave animation SHALL NOT run. Content SHALL still stay invisible until it is ready, then appear immediately.

#### Scenario: Reduced motion enter

- **WHEN** `prefers-reduced-motion: reduce` is set and a page becomes ready
- **THEN** `.main-wrapper` appears without a move or a fade

#### Scenario: Reduced motion leave

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor follows a same-origin link
- **THEN** the outgoing `.main-wrapper` does not move down or fade out
