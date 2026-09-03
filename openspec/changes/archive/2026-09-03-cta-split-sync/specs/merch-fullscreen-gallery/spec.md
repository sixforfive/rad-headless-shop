## MODIFIED Requirements

### Requirement: Desktop open keeps actions clickable

When `.layer` has class `is-blend` on `/merch/{slug}`, pointer events SHALL pass through `.layer` except `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#add-to-cart-landscape`, and `#quantity`, which SHALL receive clicks. `#add-to-cart-desktop` SHALL live in `.layer-cta` outside `.layer` and SHALL receive clicks. `#full-screen-close` SHALL receive clicks while the gallery is open. Clicks on the full-screen image list that are not captured by those controls SHALL close the gallery.

#### Scenario: Nav stays usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks a control in `.navbar`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Merch controls stay usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks `#close-product`, `#add-to-cart-landscape`, or `#quantity`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Desktop add to cart stays usable

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks `#add-to-cart-desktop`
- **THEN** that control receives the click and the gallery does not close from that click

#### Scenario: Click through chrome closes

- **WHEN** the gallery is open on `/merch/{slug}` on a viewport wider than 767px and the user clicks blended chrome that is not `.navbar`, `.cta-wrapper`, `.footer`, `#close-product`, `#add-to-cart-landscape`, or `#quantity`
- **THEN** the gallery closes
