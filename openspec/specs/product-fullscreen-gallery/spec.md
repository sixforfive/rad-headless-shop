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

When the gallery is open and the viewport is wider than 767px, after a user-driven chrome fade has settled, `.gallery-full-screen` SHALL NOT have class `is-none`. `.product-gallery-collection.is-default` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-blend`. These classes are not required on the first frame of that open. A breakpoint change while open, and an already-open first paint, SHALL apply them in the same turn.

#### Scenario: Desktop open hides default collection

- **WHEN** the gallery opens on a viewport wider than 767px and the chrome fade has settled
- **THEN** `.gallery-full-screen` does not have `is-none`, `.product-gallery-collection.is-default` has `is-none`, `.layer` does not have `is-none`, and `.layer` has `is-blend`

### Requirement: Mobile open hides layer

When the gallery is open and the viewport is 767px wide or narrower, `.gallery-full-screen` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`.

#### Scenario: Mobile open hides layer

- **WHEN** the gallery opens on a viewport 767px wide or narrower
- **THEN** `.gallery-full-screen` does not have `is-none`, `.layer` has `is-none`, `.layer` does not have `is-blend`, and `.product-gallery-collection.is-default` does not have `is-none`

### Requirement: Closed state restores both modes

When the gallery is closed, after a user-driven desktop chrome fade has settled, `.gallery-full-screen` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none` or `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`. `html` and `body` SHALL NOT have class `is-full-screen`. These classes are not required on the first frame of that close. A mobile close, a breakpoint change, and an already-open first paint SHALL apply the matching classes in the same turn.

#### Scenario: Close restores chrome

- **WHEN** the gallery closes and any desktop chrome fade has settled
- **THEN** `.gallery-full-screen` has `is-none`, `.layer` does not have `is-none` or `is-blend`, `.product-gallery-collection.is-default` does not have `is-none`, and `html` and `body` do not have `is-full-screen`

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

When `.layer` has class `is-blend`, pointer events SHALL pass through `.layer` except `.navbar`, `.cta-wrapper`, `.footer`, `.close-product`, `#download-spec`, `#add-to-cart`, `#quantity`, and `.next-product`, which SHALL receive clicks. The add-to-cart control in `.layer-cta` SHALL live outside `.layer` and SHALL receive clicks. `#full-screen-close` SHALL receive clicks while the gallery is open. Clicks on the full-screen image list that are not captured by those controls SHALL close the gallery.

#### Scenario: Nav stays usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks a control in `.navbar`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Product controls stay usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks `.close-product`, `#download-spec`, `#add-to-cart`, `#quantity`, or `.next-product`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Desktop add to cart stays usable

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks `[data-add-to-cart]` in `.layer-cta`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Click through chrome closes

- **WHEN** the gallery is open on a viewport wider than 767px and the user clicks blended chrome that is not `.navbar`, `.cta-wrapper`, `.footer`, `.close-product`, `#download-spec`, `#add-to-cart`, `#quantity`, or `.next-product`
- **THEN** the gallery closes

### Requirement: Open gallery forces white body text

When the gallery is open at any viewport, after a user-driven desktop chrome fade has settled, `html` and `body` SHALL have class `is-full-screen`. Descendants of `.layer` SHALL have `color` `#fff` and `border-color` `#fff`. Nodes that are not descendants of `.layer` SHALL keep theme `color` and `border-color`. When the gallery is closed, after that fade has settled, `html` and `body` SHALL NOT have `is-full-screen`, so layer text and borders SHALL return to the theme tokens. On mobile, on a breakpoint change, and on an already-open first paint, those classes SHALL apply in the same turn.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens and any desktop chrome fade has settled
- **THEN** `html` and `body` have `is-full-screen`
- **AND** descendants of `.layer` have `color` `#fff`

#### Scenario: Open sets white borders

- **WHEN** the gallery opens and any desktop chrome fade has settled
- **THEN** descendants of `.layer` have `border-color` `#fff`

#### Scenario: Chrome outside the layer keeps theme tokens

- **WHEN** the gallery opens and any desktop chrome fade has settled
- **THEN** nodes that are not descendants of `.layer` keep their theme `color` and `border-color`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes and any desktop chrome fade has settled
- **THEN** `html` and `body` do not have `is-full-screen`

### Requirement: Next-product keeps gallery open or closed

Clicking `.next-product` SHALL carry the current gallery open/closed state to the next `/product/{slug}` or `/merch/{slug}` page as a one-shot flag. The next detail page SHALL open the gallery if it was open, and SHALL leave it closed if it was closed. Arriving by any other navigation SHALL leave the gallery closed. The flag SHALL be consumed on that next detail load so a later refresh or shop visit does not reopen it.

#### Scenario: Next while open

- **WHEN** the gallery is open and the user clicks `.next-product`
- **THEN** the next product or merch detail page loads with the gallery open

#### Scenario: Next while closed

- **WHEN** the gallery is closed and the user clicks `.next-product`
- **THEN** the next product or merch detail page loads with the gallery closed

#### Scenario: Other navigation stays closed

- **WHEN** the user opens a product or merch detail page by any means other than `.next-product`
- **THEN** the gallery is closed

### Requirement: Incoming open gallery paints before script

When the one-shot flag is set, the Product template Head SHALL add class `is-full-screen` on `html` before first paint. While `html` has `is-full-screen`, `.gallery-full-screen` SHALL be visible, white layer chrome SHALL apply, and desktop vs mobile open classes SHALL match the open-gallery rules (desktop keep-chrome / mobile hide-layer) without waiting for `product.js`.

#### Scenario: First paint is open

- **WHEN** the next detail page loads with the persist flag set
- **THEN** first paint shows the full-screen gallery open at the current breakpoint

### Requirement: Full-screen images cover the viewport height

When the gallery is open, each `.product-gallery-img.is-full` SHALL be `width: 100%` and `min-height: 100dvh` with `object-fit: cover`. This SHALL live in Webflow, not in `css/global.css`.

#### Scenario: Single image shorter than the viewport

- **WHEN** the gallery is open and the list contains one image whose intrinsic height at `width: 100%` is shorter than the viewport
- **THEN** that image is at least `100dvh` tall and covers the viewport

#### Scenario: Multiple images

- **WHEN** the gallery is open and the list contains two or more images
- **THEN** each `.product-gallery-img.is-full` is at least `100dvh` tall

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

- **WHEN** the next detail page loads with the persist flag set
- **THEN** the open gallery paints with settled chrome and those three nodes do not fade

#### Scenario: Reduced motion chrome switch

- **WHEN** the visitor prefers reduced motion and opens or closes the gallery on a viewport wider than 767px
- **THEN** the settled open or closed classes apply with no fade
