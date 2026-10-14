## Purpose

Holds the outgoing page, sinks it, and rises the next one, so content is never seen mid-layout. The collection logo fades on leave and does not move. An open drawer stays still through it.

## Requirements

### Requirement: Content rises in on every page

On every page, the content of `.main-wrapper` SHALL start invisible and lowered by `1.25rem`. After the page's layout scripts have run, it SHALL move up and fade in. The rise SHALL run on the first visit and on each navigation. `.second-menu` and `.footer` SHALL fade in with the page and SHALL NOT move. The navbar SHALL stay in place.

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
- **THEN** `.second-menu` and `.footer` fade in with it and do not move
- **AND** the navbar does not move with it

### Requirement: Content sinks on leave

On a same-origin navigation, the outgoing content SHALL stay visible while the next document loads, then move down `1.25rem` and fade out. The incoming page SHALL use the rise from the first requirement.

#### Scenario: Shop to product

- **WHEN** the visitor follows a same-origin link from `/shop` to a product page
- **THEN** the shop content moves down and fades out
- **AND** the product content then moves up and fades in

#### Scenario: FAQ and privacy

- **WHEN** the visitor navigates between `/faq` and `/privacy`
- **THEN** the same leave and rise run

#### Scenario: Second menu and footer fade out

- **WHEN** the page content sinks on leave
- **THEN** `.second-menu` and `.footer` fade out with it
- **AND** neither moves

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

### Requirement: Open drawer stays through the leave

When the cart drawer is open and the visitor follows a same-origin link, the drawer SHALL stay on screen for the whole leave. When the menu drawer is open and the visitor follows a same-origin menu link, the drawer and the dimmed page content SHALL fade out before the next document is requested. During any leave, dimmed page content SHALL fade to transparent in place and SHALL NOT move down.

#### Scenario: Navigating from the open menu

- **WHEN** the menu drawer is open and the visitor clicks a menu link
- **THEN** the menu copy leaves first
- **AND** then the dimmed page content fades out, then the drawer fades out
- **AND** the next page is requested only after that fade ends

#### Scenario: Navigating from the open cart

- **WHEN** the cart drawer is open and the visitor follows a same-origin link
- **THEN** the drawer stays on screen while the dimmed page content fades out behind it

#### Scenario: Dimmed content does not drop

- **WHEN** a leave starts while the page content is dimmed by an open drawer
- **THEN** the page content fades from its dimmed opacity to transparent
- **AND** it does not move down, not even for one frame

#### Scenario: Drawer closed

- **WHEN** no drawer is open and the visitor follows a link
- **THEN** the leave runs with no drawer on screen

### Requirement: Back restores a closed drawer

When a page is restored from the back/forward cache, every drawer SHALL be closed. The page content SHALL NOT be dimmed. Page scroll SHALL be unlocked. The navbar SHALL show its closed-drawer buttons. The notification bar SHALL be shown again if it has an item.

#### Scenario: Back after a menu link

- **WHEN** the visitor leaves a page through a menu link and then presses the browser back button
- **THEN** the restored page shows no drawer and no empty overlay
- **AND** the page content is at full opacity and scrolls

#### Scenario: Back after a cart link

- **WHEN** the visitor leaves a page from the open cart and then presses the browser back button
- **THEN** the restored page shows no drawer

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
