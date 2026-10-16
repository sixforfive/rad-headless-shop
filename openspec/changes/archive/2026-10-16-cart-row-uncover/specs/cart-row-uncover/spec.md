## Purpose

Uncovers each cart product from a zero-height row. The image stays full size and is clipped by the row, and the Webflow bottom padding does not hold the row open.

## ADDED Requirements

### Requirement: A product row uncovers from height zero

When `.cart-drawer` opens with one or more lines, each `.cart-product` SHALL start at height `0`, including `padding-bottom` of `0`, with overflow hidden. The row SHALL then grow to its full height, and its Webflow `padding-bottom` SHALL return, on the same clock as that row’s text. The quantity box SHALL NOT hold the row open before that growth. The first frame SHALL show the row at height `0`.

#### Scenario: Open with a line

- **WHEN** the cart has a line and the visitor opens the cart
- **THEN** that product row starts at height `0` with no bottom padding
- **AND** the quantity box does not leave a gap above the next border
- **AND** the row grows to its full height with the bottom padding restored

### Requirement: The image is uncovered, not scaled

The product image SHALL stay at its full layout size while the row opens, closes, or is removed. The row’s clipping SHALL uncover and cover the image. The image SHALL NOT change width or height for the reveal.

#### Scenario: Open

- **WHEN** a product row is growing from height `0`
- **THEN** the image inside it is already its full size
- **AND** only the visible slice of that image grows with the row

#### Scenario: Remove

- **WHEN** a remove succeeds and the row shrinks away
- **THEN** the image stays full size while the row height covers it

### Requirement: No Webflow padding edit

The closed-state padding SHALL be overridden in this repo. The published Webflow `padding-bottom` on `.cart-product` SHALL stay as it is.

#### Scenario: Closed row

- **WHEN** a product row is not revealed
- **THEN** its used bottom padding is `0`
- **AND** the Webflow rule on `.cart-product` is unchanged
