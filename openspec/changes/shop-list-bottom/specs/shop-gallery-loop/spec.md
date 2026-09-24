## MODIFIED Requirements

### Requirement: Footer counter shows original-set percent

`#gallery-scroll-counter` SHALL show a zero-padded integer from 00 through 99 for how far the visitor has scrolled through the original gallery set (not including clones). At the first original row the value SHALL be 00. Immediately before the wrap the value SHALL be 99. After the wrap the value SHALL return to 00. The value SHALL NOT be 100.

When the shop list is not gallery, `#gallery-scroll-counter` SHALL have class `is-none` and SHALL NOT be visible. When the shop list is gallery, `#gallery-scroll-counter` SHALL NOT have class `is-none`.

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
- **THEN** `#gallery-scroll-counter` has class `is-none`
- **AND** `#gallery-scroll-counter` is not visible

#### Scenario: Shown in gallery

- **WHEN** the shop list has class `is-gallery`
- **THEN** `#gallery-scroll-counter` does not have class `is-none`

## ADDED Requirements

### Requirement: Shop list view does not damp the bottom edge

On `/shop` in list view, downward wheel scrolling in the bottom edge of the page SHALL NOT be scaled down. The page SHALL reach the end at the same rate as the scroll above that zone.

Gallery view SHALL NOT scale downward wheel scrolling in a bottom edge zone. The merch listing SHALL keep bottom-edge scaling.

#### Scenario: List view reaches the end

- **WHEN** the visitor wheels down through the last part of Shop list view
- **THEN** the scroll rate does not drop as the page end approaches

#### Scenario: Gallery skips the bottom zone

- **WHEN** the shop gallery is showing and the visitor wheels down
- **THEN** downward wheel scrolling is not scaled in a bottom edge zone

#### Scenario: Merch still damps the bottom

- **WHEN** the visitor wheels down through the last part of the merch listing
- **THEN** downward wheel scrolling is scaled in the bottom edge zone
