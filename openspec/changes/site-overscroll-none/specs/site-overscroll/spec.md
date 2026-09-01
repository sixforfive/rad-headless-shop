## Purpose

Turns off document rubber-band on every page and drops Collection-only overflow lock plus the bounce-only blend backdrop.

## ADDED Requirements

### Requirement: Document overscroll is off

The document root SHALL NOT perform elastic overscroll (rubber-band) on any page. `html` and `body` SHALL both carry `overscroll-behavior: none`.

Nested scrollers (product gallery, drawers) SHALL keep their own scroll. Drawer open SHALL still lock page scroll via `body.is-scroll-locked`.

#### Scenario: Pull past the top or bottom

- **WHEN** the visitor pulls past the start or end of page scroll
- **THEN** the document does not rubber-band

#### Scenario: Nested gallery still scrolls

- **WHEN** the visitor scrolls a nested scroller such as a product gallery
- **THEN** that scroller still scrolls

#### Scenario: Drawer still locks the page

- **WHEN** a drawer is open and `body` has `is-scroll-locked`
- **THEN** the page does not scroll behind the drawer

### Requirement: Collection is not a special overflow case

Pages that contain `.section_home-page` SHALL NOT get a dedicated `html`/`body` height or `overflow: hidden` lock. Collection viewport height SHALL come from Webflow `.layout` and `.section_home-page` at `100dvh`. Shop, product, merch, FAQ, and privacy pages SHALL still scroll when content is taller than the viewport.

#### Scenario: Collection matches the visual viewport

- **WHEN** Collection (`/`) is shown
- **THEN** the page does not reveal a strip of canvas below the hero from extra document scroll

#### Scenario: Shop still scrolls

- **WHEN** `/shop` content is taller than the viewport
- **THEN** the page scrolls

### Requirement: Difference blend has no bounce-only backdrop

`body` SHALL NOT use a `::before` paint layer whose only job is a blend backdrop during elastic overscroll. Navbar and `.layer.is-blend` SHALL keep `mix-blend-mode: difference` against the html theme canvas.

`html` SHALL keep `background-color: var(--_theme---background--primary)`.

#### Scenario: Chrome still inverts

- **WHEN** the page is at rest (no overscroll)
- **THEN** navbar and `.layer.is-blend` still invert against the theme canvas

#### Scenario: No bounce backdrop node

- **WHEN** `css/global.css` is loaded
- **THEN** it does not define `body::before`
