# shop-gallery-loop Specification

## Purpose

Loops the Shop gallery so scrolling past the last original row continues from the first, and shows how far through the original set the visitor has gone.

## Requirements

### Requirement: Gallery wraps at the last original row

When `.product-list` has class `is-gallery` on `/shop`, scrolling down past the last original row SHALL continue from the first original row without a visible jump. The wrap SHALL be downward only. Scrolling up at the first original row SHALL stop there.

The loop SHALL NOT run when `.product-list` does not have `is-gallery`. The merch list SHALL NOT loop.

#### Scenario: Wrap at the last row

- **WHEN** the shop gallery is showing and the last original row has scrolled out at the top
- **THEN** the first clone row is in the same viewport position the first original row had at load, with no visible jump

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

The shop gallery SHALL contain one cloned copy of every original `.product-thumb`, marked so it is not treated as a second CMS item. Cloned content SHALL be hidden from assistive tech and SHALL NOT be reachable by keyboard. Cloned content SHALL NOT carry duplicates of any `id` present on the originals. Clones SHALL NOT appear in list view.

#### Scenario: Clone count matches originals

- **WHEN** the shop gallery has N original thumbs
- **THEN** the gallery also contains N cloned thumbs

#### Scenario: Clones hidden in list view

- **WHEN** the visitor switches to list view
- **THEN** cloned thumbs are not visible

#### Scenario: Clones hidden from assistive tech

- **WHEN** a cloned thumb is in the DOM
- **THEN** that clone is hidden from assistive tech and its links are not in the tab order

#### Scenario: No duplicate ids

- **WHEN** an original thumb carries an `id`
- **THEN** its clone does not carry that `id`

### Requirement: Footer counter shows original-set percent

`#gallery-scroll-counter` SHALL show a zero-padded integer from 00 through 99 for how far the visitor has scrolled through the original gallery set (not including clones). At the first original row the value SHALL be 00. Immediately before the wrap the value SHALL be 99. After the wrap the value SHALL return to 00. The value SHALL NOT be 100.

When the shop list is not gallery, `#gallery-scroll-counter` SHALL NOT be visible.

#### Scenario: Start of the set

- **WHEN** the shop gallery is at the first original row
- **THEN** `#gallery-scroll-counter` shows 00

#### Scenario: End of the set before wrap

- **WHEN** the shop gallery is at the last original row, immediately before wrap
- **THEN** `#gallery-scroll-counter` shows 99

#### Scenario: After wrap

- **WHEN** the gallery has just wrapped to the first original row
- **THEN** `#gallery-scroll-counter` shows 00

#### Scenario: Hidden in list view

- **WHEN** the shop list is not gallery
- **THEN** `#gallery-scroll-counter` is not visible

### Requirement: Cloned block is a pure translation of the original block

The cloned gallery content SHALL be laid out so that every cloned thumb sits exactly one loop height below its corresponding original thumb. For every index `i`, the vertical distance from original thumb `i` to clone thumb `i` SHALL be the same value. No cloned thumb SHALL share a grid row with an original thumb.

This SHALL hold at every viewport width the gallery supports, including widths at which the gallery grid falls back to auto placement.

The vertical gap at the seam between the last original row and the first cloned row SHALL equal the gallery grid's own row gap.

#### Scenario: Constant offset across the set

- **WHEN** the shop gallery is showing and the layout has settled
- **THEN** the vertical distance from each original thumb to its matching clone is the same value for every thumb in the set

#### Scenario: No shared seam row

- **WHEN** the original set does not fill its last grid row completely
- **THEN** no cloned thumb is placed in that last original row

#### Scenario: Seam gap matches the grid

- **WHEN** the shop gallery is showing
- **THEN** the gap between the last original row and the first cloned row is the same as the gap between any two adjacent gallery rows

#### Scenario: Collapsed grid

- **WHEN** the viewport is narrow enough that gallery thumbs use default auto placement
- **THEN** the constant-offset and no-shared-row behavior still holds

### Requirement: Scroll momentum survives the wrap

The wrap SHALL preserve the visitor's scroll motion. Scroll speed immediately after the wrap SHALL match scroll speed immediately before it, with no stall, and continuing input SHALL carry through the seam without needing a new gesture.

The wrap SHALL be applied before the frame in which the unwrapped position would otherwise be painted.

#### Scenario: Momentum carries through

- **WHEN** the visitor is scrolling the shop gallery at speed and crosses the wrap point
- **THEN** scrolling continues at the same speed without pausing or restarting

#### Scenario: No unwrapped frame

- **WHEN** the wrap point is crossed
- **THEN** no frame is painted showing the page past the wrap point
