## Purpose

Places Shop product thumbs on the Collection List grid from CMS column attributes, and switches Gallery versus List by toggling a class on that list.

## ADDED Requirements

### Requirement: Gallery placement from inclusive column attributes

When `.product-list` has class `is-gallery`, each `.product-thumb` SHALL occupy the gallery columns given by attributes `gallery-column-start` and `gallery-column-end`. Both values are inclusive column numbers: start 1 and end 3 occupy columns 1, 2, and 3.

If either gallery attribute is missing on a thumb, that thumb SHALL use default grid auto-placement for the missing edge.

#### Scenario: Inclusive span

- **WHEN** a thumb has `gallery-column-start="1"` and `gallery-column-end="3"` and its parent `.product-list` has `is-gallery`
- **THEN** the thumb occupies gallery columns 1 through 3 inclusive

#### Scenario: Last column

- **WHEN** a thumb has `gallery-column-end="12"` and its parent `.product-list` has `is-gallery`
- **THEN** the thumb occupies through column 12 of the 12-column gallery grid

### Requirement: List placement from column attribute

When `.product-list` does not have class `is-gallery` and does not have class `is-merch`, each `.product-thumb` SHALL occupy the single column given by attribute `list-column`.

If `list-column` is missing on a thumb, that thumb SHALL use default grid auto-placement.

#### Scenario: List column

- **WHEN** a thumb has `list-column="4"` and its parent `.product-list` does not have `is-gallery`
- **THEN** the thumb occupies column 4 of the list grid, one cell wide

### Requirement: Placement resets when the grid collapses

Gallery column placement SHALL NOT apply at viewport widths of 479px and below. List column placement SHALL NOT apply at viewport widths of 767px and below. In those ranges thumbs SHALL use default grid auto-placement.

#### Scenario: Gallery on small screens

- **WHEN** the viewport is 479px wide or narrower and `.product-list` has `is-gallery`
- **THEN** thumbs are not forced onto the CMS gallery column span

#### Scenario: List on tablet and below

- **WHEN** the viewport is 767px wide or narrower and `.product-list` does not have `is-gallery`
- **THEN** thumbs are not forced onto the CMS list column

### Requirement: View switch toggles gallery class

Clicking `.switch-btn[data-view="gallery"]` SHALL add `is-gallery` to `.product-list`. Clicking `.switch-btn[data-view="list"]` SHALL remove `is-gallery` from `.product-list`. The script SHALL read `data-view`, not the button label text.

The clicked button SHALL receive class `is-active`. Other `.switch-btn[data-view]` buttons SHALL lose `is-active`.

On load, `is-active` SHALL match the current grid: `is-gallery` present → gallery button, otherwise → list button.

#### Scenario: Switch to list

- **WHEN** the user clicks `.switch-btn[data-view="list"]`
- **THEN** `.product-list` does not have `is-gallery`, the list button has `is-active`, and the gallery button does not

#### Scenario: Switch to gallery

- **WHEN** the user clicks `.switch-btn[data-view="gallery"]`
- **THEN** `.product-list` has `is-gallery`, the gallery button has `is-active`, and the list button does not
