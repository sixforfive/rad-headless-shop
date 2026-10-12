## MODIFIED Requirements

### Requirement: Native cursor and existing activation stay

The label SHALL NOT hide or replace the native cursor. The label SHALL NOT receive pointer events. Clicks, hrefs, and other activation on the marked area SHALL behave as they did without the label. While the computed cursor on the marked area is `pointer`, the dot cursor hides the native pointer; the label still does not take the click.

#### Scenario: Click through the label

- **WHEN** the visitor clicks a marked area whose computed cursor is `pointer` while the label is visible
- **THEN** the click reaches the marked area and the native pointer is hidden

#### Scenario: Click through the label on a non-pointer cursor

- **WHEN** the visitor clicks a marked area whose computed cursor is not `pointer` while the label is visible
- **THEN** the click reaches the marked area and the native cursor remains visible

### Requirement: Rubber follow

While the label is shown, it SHALL lag the pointer with easing rather than sitting on the hotspot. While the computed cursor is `pointer`, the dot SHALL stay on the hotspot. Otherwise the native cursor SHALL stay on the pointer.

#### Scenario: Move inside a marked area

- **WHEN** the pointer moves inside a `[custom-cursor]` area whose computed cursor is `pointer`
- **THEN** the label trails the pointer with easing and the dot stays on the hotspot

#### Scenario: Move inside a marked area with a native cursor

- **WHEN** the pointer moves inside a `[custom-cursor]` area whose computed cursor is not `pointer`
- **THEN** the label trails the pointer with easing and the native cursor stays on the pointer

#### Scenario: Reduced motion follow

- **WHEN** the visitor prefers reduced motion and the pointer moves inside a marked area
- **THEN** the label stays on the offset point with no lag
