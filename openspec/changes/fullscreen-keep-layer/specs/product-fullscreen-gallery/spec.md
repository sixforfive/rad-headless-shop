## Purpose

Opens the product full-screen image gallery on `/product/{slug}` while leaving page chrome visible, hiding only the in-page gallery, and blending that chrome with difference except the purchase CTA.

## ADDED Requirements

### Requirement: Full-screen gallery opens and closes on breakpoint triggers

On viewports wider than 767px, clicking `.layer .product-gallery-list` SHALL open the gallery and clicking `.gallery-full-screen .product-gallery-list` SHALL close it. On viewports 767px wide and narrower, clicking `#full-screen-open` SHALL open the gallery and clicking `#full-screen-close` SHALL close it. Viewport SHALL be read at click time.

#### Scenario: Desktop open

- **WHEN** the viewport is wider than 767px and the user clicks `.layer .product-gallery-list`
- **THEN** the gallery is open

#### Scenario: Desktop close

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user clicks `.gallery-full-screen .product-gallery-list`
- **THEN** the gallery is closed

#### Scenario: Mobile open

- **WHEN** the viewport is 767px wide or narrower and the user clicks `#full-screen-open`
- **THEN** the gallery is open

#### Scenario: Mobile close

- **WHEN** the gallery is open, the viewport is 767px wide or narrower, and the user clicks `#full-screen-close`
- **THEN** the gallery is closed

### Requirement: Open state shows full-screen images and hides the in-page collection

When the gallery is open, `.gallery-full-screen` SHALL NOT have class `is-none`. `.product-gallery-collection.is-default` SHALL have class `is-none`. `.layer` SHALL NOT receive class `is-none` for this open/close.

When the gallery is closed, `.gallery-full-screen` SHALL have class `is-none`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`.

#### Scenario: Open hides default collection, keeps layer

- **WHEN** the gallery opens
- **THEN** `.gallery-full-screen` does not have `is-none`, `.product-gallery-collection.is-default` has `is-none`, and `.layer` does not have `is-none`

#### Scenario: Close restores default collection

- **WHEN** the gallery closes
- **THEN** `.gallery-full-screen` has `is-none` and `.product-gallery-collection.is-default` does not have `is-none`

### Requirement: Open state blends layer except the CTA

When the gallery is open, `.layer` SHALL use `mix-blend-mode: difference`. `.cta-wrapper` inside that layer SHALL use `mix-blend-mode: normal`. When the gallery is closed, `.layer` SHALL NOT keep that open-state difference blend.

#### Scenario: Open blends layer, CTA stays normal

- **WHEN** the gallery opens
- **THEN** `.layer` is blended with `difference` and `.cta-wrapper` is blended with `normal`

#### Scenario: Close removes layer difference

- **WHEN** the gallery closes
- **THEN** `.layer` no longer uses the open-state `difference` blend
