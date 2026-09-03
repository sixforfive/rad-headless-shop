# product-fullscreen-gallery Specification

## Purpose

Opens the product full-screen image gallery on `/product/{slug}` with different chrome at desktop vs mobile, difference blend on the layer itself, and click-through so actions and [close] still work.

## Requirements

### Requirement: Full-screen gallery opens and closes on breakpoint triggers

On viewports wider than 767px, clicking `.layer .product-gallery-list` SHALL open the gallery and clicking `.gallery-full-screen .product-gallery-list` SHALL close it. On viewports 767px wide and narrower, clicking `#full-screen-open` SHALL open the gallery. Clicking `#full-screen-close` SHALL close the gallery at every viewport. Viewport SHALL be read at click time.

#### Scenario: Desktop open

- **WHEN** the viewport is wider than 767px and the user clicks `.layer .product-gallery-list`
- **THEN** the gallery is open

#### Scenario: Desktop close via images

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user clicks `.gallery-full-screen .product-gallery-list`
- **THEN** the gallery is closed

#### Scenario: Mobile open

- **WHEN** the viewport is 767px wide or narrower and the user clicks `#full-screen-open`
- **THEN** the gallery is open

#### Scenario: Close via [close]

- **WHEN** the gallery is open and the user clicks `#full-screen-close`
- **THEN** the gallery is closed

### Requirement: Desktop open keeps layer chrome

When the gallery is open and the viewport is wider than 767px, `.gallery-full-screen` SHALL NOT have class `is-none`. `.product-gallery-collection.is-default` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-blend`.

#### Scenario: Desktop open hides default collection

- **WHEN** the gallery opens on a viewport wider than 767px
- **THEN** `.gallery-full-screen` does not have `is-none`, `.product-gallery-collection.is-default` has `is-none`, `.layer` does not have `is-none`, and `.layer` has `is-blend`

### Requirement: Mobile open hides layer

When the gallery is open and the viewport is 767px wide or narrower, `.gallery-full-screen` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`.

#### Scenario: Mobile open hides layer

- **WHEN** the gallery opens on a viewport 767px wide or narrower
- **THEN** `.gallery-full-screen` does not have `is-none`, `.layer` has `is-none`, `.layer` does not have `is-blend`, and `.product-gallery-collection.is-default` does not have `is-none`

### Requirement: Closed state restores both modes

When the gallery is closed, `.gallery-full-screen` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none` or `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`. `body` SHALL NOT have class `is-full-screen`.

#### Scenario: Close restores chrome

- **WHEN** the gallery closes
- **THEN** `.gallery-full-screen` has `is-none`, `.layer` does not have `is-none` or `is-blend`, `.product-gallery-collection.is-default` does not have `is-none`, and `body` does not have `is-full-screen`

### Requirement: Crossing 767px while open switches mode

If the gallery is open and the viewport crosses 767px, the open classes SHALL match the new breakpoint (desktop keep-chrome vs mobile hide-layer) without a further click.

#### Scenario: Resize while open

- **WHEN** the gallery is open and the viewport changes between wider than 767px and 767px or narrower
- **THEN** the open classes match the new breakpoint

### Requirement: Desktop open blends the layer

When `.layer` has class `is-blend`, `.layer` SHALL use `mix-blend-mode: difference`. No element inside that layer SHALL set its own `mix-blend-mode`.

#### Scenario: Layer blends

- **WHEN** the gallery is open on a viewport wider than 767px
- **THEN** `.layer` uses `difference` and `.product-info-col`, `.price-tag`, `.product-details-wrapper`, and `.footer` do not set their own blend mode

#### Scenario: CTA inverts with the layer

- **WHEN** the gallery is open on a viewport wider than 767px
- **THEN** `.cta-wrapper` composites inside the layer's blend group and inverts with it

### Requirement: Desktop open keeps actions clickable

When `.layer` has class `is-blend`, pointer events SHALL pass through `.layer` except `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#download-spec`, `#add-to-cart-landscape`, and `#quantity`, which SHALL receive clicks. `#add-to-cart-desktop` SHALL live in `.layer-cta` outside `.layer` and SHALL receive clicks. `#full-screen-close` SHALL receive clicks while the gallery is open. Clicks on the full-screen image list that are not captured by those controls SHALL close the gallery.

#### Scenario: Nav stays usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks a control in `.navbar`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Product controls stay usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks `#close-product`, `#download-spec`, `#add-to-cart-landscape`, or `#quantity`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Desktop add to cart stays usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks `#add-to-cart-desktop`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Click through chrome closes

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks blended chrome that is not `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#download-spec`, `#add-to-cart-landscape`, or `#quantity`
- **THEN** the gallery closes

### Requirement: Open gallery forces white body text

When the gallery is open at any viewport, `body` SHALL have class `is-full-screen` and `color` SHALL be `#fff`. When the gallery is closed, `body` SHALL NOT have `is-full-screen`, so text color SHALL return to the theme token.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens
- **THEN** `body` has `is-full-screen` and `color` is `#fff`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes
- **THEN** `body` does not have `is-full-screen`

### Requirement: Full-screen images cover the viewport height

When the gallery is open, each `.product-gallery-img.is-full` SHALL be `width: 100%` and `min-height: 100dvh` with `object-fit: cover`. This SHALL live in Webflow, not in `css/global.css`.

#### Scenario: Single image shorter than the viewport

- **WHEN** the gallery is open and the list contains one image whose intrinsic height at `width: 100%` is shorter than the viewport
- **THEN** that image is at least `100dvh` tall and covers the viewport

#### Scenario: Multiple images

- **WHEN** the gallery is open and the list contains two or more images
- **THEN** each `.product-gallery-img.is-full` is at least `100dvh` tall
