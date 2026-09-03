## ADDED Requirements

### Requirement: Next-product keeps gallery open or closed

Clicking `#next-product` on `/merch/{slug}` SHALL carry the current gallery open/closed state to the next `/product/{slug}` or `/merch/{slug}` page as a one-shot flag. The next detail page SHALL open the gallery if it was open, and SHALL leave it closed if it was closed. Arriving by any other navigation SHALL leave the gallery closed. The flag SHALL be consumed on that next detail load so a later refresh or shop visit does not reopen it.

#### Scenario: Next while open

- **WHEN** the gallery is open on `/merch/{slug}` and the user clicks `#next-product`
- **THEN** the next product or merch detail page loads with the gallery open

#### Scenario: Next while closed

- **WHEN** the gallery is closed on `/merch/{slug}` and the user clicks `#next-product`
- **THEN** the next product or merch detail page loads with the gallery closed

#### Scenario: Other navigation stays closed

- **WHEN** the user opens a merch or product detail page by any means other than `#next-product`
- **THEN** the gallery is closed

### Requirement: Incoming open gallery paints before script

When the one-shot flag is set, the Merch template Head SHALL add class `is-full-screen` on `html` before first paint. While `html` has `is-full-screen`, `.gallery-full-screen` SHALL be visible, white layer chrome SHALL apply, and desktop vs mobile open classes SHALL match the open-gallery rules (desktop keep-chrome / mobile hide-layer) without waiting for `product.js`.

#### Scenario: First paint is open

- **WHEN** the next merch or product detail page loads with the persist flag set
- **THEN** first paint shows the full-screen gallery open at the current breakpoint

## MODIFIED Requirements

### Requirement: Closed state restores both modes

When the gallery is closed on `/merch/{slug}`, `.gallery-full-screen` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none` or `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`. `html` and `body` SHALL NOT have class `is-full-screen`.

#### Scenario: Close restores chrome

- **WHEN** the gallery closes on `/merch/{slug}`
- **THEN** `.gallery-full-screen` has `is-none`, `.layer` does not have `is-none` or `is-blend`, `.product-gallery-collection.is-default` does not have `is-none`, and `html` and `body` do not have `is-full-screen`

### Requirement: Desktop open keeps actions clickable

When `.layer` has class `is-blend` on `/merch/{slug}`, pointer events SHALL pass through `.layer` except `.navbar`, `.cta-wrapper`, `.footer`, `.close-product`, `#add-to-cart-landscape`, `#quantity`, and `#next-product`, which SHALL receive clicks. `#add-to-cart-desktop` SHALL live in `.layer-cta` outside `.layer` and SHALL receive clicks. `#full-screen-close` SHALL receive clicks while the gallery is open. Clicks on the full-screen image list that are not captured by those controls SHALL close the gallery.

#### Scenario: Nav stays usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks a control in `.navbar`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Merch controls stay usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks `.close-product`, `#add-to-cart-landscape`, `#quantity`, or `#next-product`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Desktop add to cart stays usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks `#add-to-cart-desktop`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Click through chrome closes

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks blended chrome that is not `.navbar`, `.cta-wrapper`, `.footer`, `.close-product`, `#add-to-cart-landscape`, `#quantity`, or `#next-product`
- **THEN** the gallery closes

### Requirement: Open gallery forces white body text

When the merch gallery is open at any viewport, `html` and `body` SHALL have class `is-full-screen` and `color` SHALL be `#fff`. When the gallery is closed, `html` and `body` SHALL NOT have `is-full-screen`, so text color SHALL return to the theme token.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens on `/merch/{slug}`
- **THEN** `html` and `body` have `is-full-screen` and `color` is `#fff`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes on `/merch/{slug}`
- **THEN** `html` and `body` do not have `is-full-screen`
