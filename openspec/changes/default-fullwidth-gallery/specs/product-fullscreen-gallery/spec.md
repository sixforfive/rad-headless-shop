## ADDED Requirements

### Requirement: Detail load starts full width

A `/product/{slug}` load SHALL start with the full-width gallery open at the current breakpoint when no one-shot closed flag is set. Zooming out SHALL use the existing close gestures and SHALL show the column gallery. Zooming back in SHALL use the existing open gestures.

#### Scenario: Opening a product starts full width

- **WHEN** the user opens a product detail page and no one-shot closed flag is set
- **THEN** the gallery is open

#### Scenario: Zoom out shows the column gallery

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user clicks `.gallery-full-screen .product-gallery-list`
- **THEN** the gallery is closed and `.product-gallery-collection.is-default` is visible

#### Scenario: Zoom back in

- **WHEN** the gallery is closed, the viewport is wider than 767px, and the user clicks `.layer .product-gallery-list`
- **THEN** the gallery is open

## MODIFIED Requirements

### Requirement: Next-product keeps gallery open or closed

Clicking `.next-product` SHALL carry a zoomed-out gallery to the next `/product/{slug}` or `/merch/{slug}` page as a one-shot closed flag. The next detail page SHALL open the gallery when that flag is absent, and SHALL leave it closed when the flag is set. The flag SHALL be consumed on that next detail load so a later refresh returns to the full-width gallery.

#### Scenario: Next while open

- **WHEN** the gallery is open and the user clicks `.next-product`
- **THEN** the next product or merch detail page loads with the gallery open

#### Scenario: Next while zoomed out

- **WHEN** the gallery is closed and the user clicks `.next-product`
- **THEN** the next product or merch detail page loads with the gallery closed

#### Scenario: Refresh returns to full width

- **WHEN** the gallery is closed and the user reloads the detail page
- **THEN** the gallery is open

### Requirement: Incoming open gallery paints before script

On a product detail load, the Product template Head SHALL add class `is-full-screen` on `html` before first paint unless a one-shot closed flag is set. While `html` has `is-full-screen`, `.gallery-full-screen` SHALL be visible, white layer chrome SHALL apply, and desktop vs mobile open classes SHALL match the open-gallery rules (desktop keep-chrome / mobile hide-layer) without waiting for `product.js`. When the closed flag is set, the Head SHALL NOT add `is-full-screen`, and first paint SHALL show the gallery closed.

#### Scenario: First paint is open

- **WHEN** a product detail page loads and no one-shot closed flag is set
- **THEN** first paint shows the full-screen gallery open at the current breakpoint

#### Scenario: Zoomed-out next paints closed

- **WHEN** the next detail page loads with the one-shot closed flag set
- **THEN** first paint shows the gallery closed

### Requirement: Desktop chrome fades across the blend snap

On a viewport wider than 767px, a user-driven open or close SHALL fade `.layer`, `.layer-cta`, `.product-nav-tab`, and `.gallery-full-screen` to opacity 0, then apply the blend and white-chrome change, then fade `.layer`, `.layer-cta`, and `.product-nav-tab` back to opacity 1. On open, `.gallery-full-screen` SHALL fade from opacity 0 to 1 with that fade-in. On close, `.gallery-full-screen` SHALL be hidden at opacity 0 and SHALL NOT fade back in. The fade-in SHALL NOT start until the fade-out has ended. Each fade SHALL be opacity `0.3s ease`. The blend mode and the white text and border color SHALL change only while those chrome nodes are at opacity 0. Drawer dim opacity timing on `.gallery-full-screen` SHALL stay `0.45s ease-out`.

On a viewport 767px wide or narrower, opening and closing SHALL NOT run this fade. `.layer` SHALL still receive `is-none` in the same turn.

An already-open gallery on first paint SHALL NOT run this fade. A viewport change across 767px while the gallery is open SHALL NOT run this fade.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run. Open and close SHALL reach the settled classes in the same turn.

#### Scenario: Desktop open fades chrome out then in

- **WHEN** the viewport is wider than 767px and the user opens the gallery
- **THEN** `.layer`, `.layer-cta`, `.product-nav-tab`, and `.gallery-full-screen` fade to opacity 0 over `0.3s ease`, the blend and white chrome apply only after that, `.gallery-full-screen` fades to opacity 1 over `0.3s ease`, and those three chrome nodes fade to opacity 1 over `0.3s ease`

#### Scenario: Desktop close fades chrome out then in

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user closes the gallery
- **THEN** `.layer`, `.layer-cta`, `.product-nav-tab`, and `.gallery-full-screen` fade to opacity 0 over `0.3s ease`, the blend and white chrome clear only after that, `.gallery-full-screen` stays hidden, and those three chrome nodes fade to opacity 1 over `0.3s ease`

#### Scenario: Mobile does not fade chrome

- **WHEN** the viewport is 767px wide or narrower and the user opens or closes the gallery
- **THEN** `.layer`, `.layer-cta`, and `.product-nav-tab` do not fade, and `.layer` receives or loses `is-none` in the same turn

#### Scenario: First paint does not fade chrome

- **WHEN** a product detail page loads with the gallery already open
- **THEN** the open gallery paints with settled chrome and those three nodes do not fade

#### Scenario: Reduced motion chrome switch

- **WHEN** the visitor prefers reduced motion and opens or closes the gallery on a viewport wider than 767px
- **THEN** the settled open or closed classes apply with no fade
