## Purpose

Holds the outgoing page, sinks it, and rises the next one, so content is never seen mid-layout. The collection logo fades on leave and does not move. An open drawer stays still through it.

## Requirements

### Requirement: Content rises in on every page

On every page, the content of `.main-wrapper` SHALL start invisible and lowered by `1.25rem`. After the page's layout scripts have run, it SHALL move up and fade in. The rise SHALL run on the first visit and on each navigation. `.second-menu` SHALL fade in with the page and SHALL NOT move. Navbar and footer SHALL stay in place.

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
- **THEN** `.second-menu` fades in with it and does not move
- **AND** the navbar and footer do not move with it

### Requirement: Content sinks on leave

On a same-origin navigation, the outgoing content SHALL stay visible while the next document loads, then move down `1.25rem` and fade out. The incoming page SHALL use the rise from the first requirement.

#### Scenario: Shop to product

- **WHEN** the visitor follows a same-origin link from `/shop` to a product page
- **THEN** the shop content moves down and fades out
- **AND** the product content then moves up and fades in

#### Scenario: FAQ and privacy

- **WHEN** the visitor navigates between `/faq` and `/privacy`
- **THEN** the same leave and rise run

#### Scenario: Second menu fades out

- **WHEN** the page content sinks on leave
- **THEN** `.second-menu` fades out with it
- **AND** `.second-menu` does not move

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

### Requirement: Open drawer stays through the leave

When a drawer is open and the visitor follows a same-origin link, the drawer SHALL stay on screen for the whole leave. The dimmed page content SHALL run its leave underneath the drawer.

#### Scenario: Navigating from the open menu

- **WHEN** the menu drawer is open and the visitor clicks a menu link
- **THEN** the drawer stays on screen while the page content moves down and fades out behind it

#### Scenario: Drawer closed

- **WHEN** no drawer is open and the visitor follows a link
- **THEN** the leave runs with no drawer on screen

### Requirement: Gallery view switch uses the same motion

On `/shop`, switching between Gallery and List SHALL move the product grid down and fade it out, apply the new view, then move it up and fade it in. Distance and duration SHALL match the page rise. The scroll position SHALL reset while the grid is not visible.

#### Scenario: Gallery to list

- **WHEN** the visitor clicks the List switch while in Gallery
- **THEN** the product grid moves down and fades out, the list view is applied, and the grid moves up and fades in

#### Scenario: No visible relayout

- **WHEN** the view switches
- **THEN** the column change and the jump to top happen while the grid is not visible

#### Scenario: Chrome does not move

- **WHEN** the view switches
- **THEN** the navbar, second menu, and footer stay in place

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

#### Scenario: Collection textures arrive later

- **WHEN** `/` rises after the hero canvas is mounted
- **THEN** hero textures may still appear afterward

### Requirement: Reduced motion skips the move

When `prefers-reduced-motion: reduce` is set, content SHALL NOT move, and the leave SHALL NOT run. Content SHALL still stay invisible until it is ready, then appear immediately. The view switch SHALL apply the new view immediately.

#### Scenario: Reduced motion enter

- **WHEN** `prefers-reduced-motion: reduce` is set and a page becomes ready
- **THEN** the page content appears without a move or a fade

#### Scenario: Reduced motion leave

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor follows a same-origin link
- **THEN** the outgoing content does not move down or fade out

#### Scenario: Reduced motion view switch

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor switches view on `/shop`
- **THEN** the new view is applied with no sink and no rise
