## MODIFIED Requirements

### Requirement: Still click on a plane goes to shop

A pointer press and release on an image plane with movement below 8px SHALL navigate to `/shop`. A drag past that threshold SHALL pan and SHALL NOT navigate. A still click on empty space SHALL NOT navigate.

On a fine pointer, while the pointer is over an image plane, the canvas SHALL carry `custom-cursor="[SHOP COLLECTION]"`, the cursor label SHALL show that text, and the visitor SHALL see the 12×12 difference dot with the native pointer hidden. While the pointer is over empty space, that attribute SHALL be empty, the cursor label SHALL NOT be shown, and the canvas SHALL use the grab cursor. Coarse pointers SHALL NOT require this attribute.

#### Scenario: Click a plane

- **WHEN** the visitor presses and releases on a gallery image without dragging
- **THEN** the browser goes to `/shop`

#### Scenario: Drag a plane

- **WHEN** the visitor presses on a gallery image and moves past the drag threshold
- **THEN** the space pans and the page does not navigate

#### Scenario: Click empty space

- **WHEN** the visitor presses and releases on a gap between images without dragging
- **THEN** the page does not navigate

#### Scenario: Hover a plane

- **WHEN** a fine pointer is over a gallery image plane
- **THEN** the canvas has `custom-cursor="[SHOP COLLECTION]"`, the cursor label shows `[SHOP COLLECTION]`, the 12×12 difference dot is centered on the hotspot, and the native cursor is hidden

#### Scenario: Hover a gap

- **WHEN** a fine pointer is over empty space in the gallery canvas
- **THEN** the canvas does not have a non-empty `custom-cursor`, the cursor label is not shown, the native cursor is grab, and the dot is hidden
