## Purpose

Loops the Shop gallery so scrolling past the last original row continues from the first, and shows how far through the original set the visitor has gone.

## ADDED Requirements

### Requirement: Gallery wraps at the last original row

When `.product-list` has class `is-gallery` on `/shop`, scrolling down past the last original row SHALL continue from the first original row without a visible jump. The wrap SHALL be downward only. Scrolling up at the first original row SHALL stop there.

The loop SHALL NOT run when `.product-list` does not have `is-gallery`. The merch list SHALL NOT loop.

#### Scenario: Wrap at the last row

- **WHEN** the shop gallery is showing and the visitor scrolls past the last original row
- **THEN** the first original row is in the same viewport position the last original row just left, with no blank gap

#### Scenario: Top is a hard stop

- **WHEN** the shop gallery is showing and the visitor scrolls up at the first original row
- **THEN** the page does not wrap to the last row

#### Scenario: List view does not wrap

- **WHEN** `.product-list` does not have `is-gallery` and the visitor scrolls to the last item
- **THEN** the page does not jump to the first item

#### Scenario: Merch is unchanged

- **WHEN** the visitor scrolls the merch listing
- **THEN** that list does not wrap

### Requirement: Clones are copies of the original thumbs

The shop gallery SHALL contain one cloned `.product-thumb` per original `.product-thumb`, marked so it is not treated as a second CMS item. Each clone SHALL be hidden from assistive tech. Clones SHALL NOT appear in list view.

#### Scenario: Clone count matches originals

- **WHEN** the shop gallery has N original thumbs
- **THEN** the list also contains N cloned thumbs

#### Scenario: Clones hidden in list view

- **WHEN** the visitor switches to list view
- **THEN** cloned thumbs are not visible

#### Scenario: Clones hidden from assistive tech

- **WHEN** a cloned thumb is in the DOM
- **THEN** that clone is hidden from assistive tech

### Requirement: Footer counter shows original-set percent

`#gallery-scroll-counter` SHALL show an integer from 0 through 100 for how far the visitor has scrolled through the original gallery set (not including clones). At the first original row the value SHALL be 0. Immediately before the wrap the value SHALL be 100. After the wrap the value SHALL return to 0.

When the shop list is not gallery, `#gallery-scroll-counter` SHALL NOT be visible.

#### Scenario: Start of the set

- **WHEN** the shop gallery is at the first original row
- **THEN** `#gallery-scroll-counter` shows 0

#### Scenario: End of the set before wrap

- **WHEN** the shop gallery is at the last original row, immediately before wrap
- **THEN** `#gallery-scroll-counter` shows 100

#### Scenario: After wrap

- **WHEN** the gallery has just wrapped to the first original row
- **THEN** `#gallery-scroll-counter` shows 0

#### Scenario: Hidden in list view

- **WHEN** the shop list is not gallery
- **THEN** `#gallery-scroll-counter` is not visible
