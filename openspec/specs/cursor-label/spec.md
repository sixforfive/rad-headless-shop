# cursor-label Specification

## Purpose

Shows an informational `.text-meta` label next to the pointer over areas marked `custom-cursor`, without changing clicks or hiding the native cursor.

## Requirements

### Requirement: Label copy from custom-cursor

While the pointer is over an element that carries a non-empty `custom-cursor` attribute, the site SHALL show a label whose text is that attribute's value and whose class list includes `text-meta`. The label SHALL be created by the site; the marked element SHALL NOT be replaced or wrapped.

An empty `custom-cursor` value SHALL be treated as unmarked. The shown text SHALL match the current attribute of the node under the pointer, including when that node or value changes without pointer movement.

#### Scenario: Hover a marked area

- **WHEN** the pointer is over an element with `custom-cursor="[SHOP COLLECTION]"`
- **THEN** a `.text-meta` label showing `[SHOP COLLECTION]` is visible beside the pointer

#### Scenario: Empty attribute

- **WHEN** the pointer is over an element with `custom-cursor=""`
- **THEN** no cursor label is shown

#### Scenario: Full-width gallery open

- **WHEN** the pointer stays over the full-width gallery control and the visitor opens the gallery so the node under the pointer now has `custom-cursor="Close"`
- **THEN** the label shows `Close` without requiring the pointer to move

#### Scenario: Full-width gallery close

- **WHEN** the pointer stays over the full-width gallery control and the visitor closes the gallery so the node under the pointer now has `custom-cursor="Open"`
- **THEN** the label shows `Open` without requiring the pointer to move

### Requirement: Native cursor and existing activation stay

The label SHALL NOT hide or replace the native cursor. The label SHALL NOT receive pointer events. Clicks, hrefs, and other activation on the marked area SHALL behave as they did without the label.

#### Scenario: Click through the label

- **WHEN** the visitor clicks the marked area while the label is visible
- **THEN** the click reaches the marked area and the native cursor remains visible

### Requirement: Rubber follow

While the label is shown, it SHALL lag the pointer with easing rather than sitting on the hotspot. The native cursor SHALL stay on the pointer.

#### Scenario: Move inside a marked area

- **WHEN** the pointer moves inside a `[custom-cursor]` area
- **THEN** the label trails the pointer with easing and the native cursor stays on the pointer

#### Scenario: Reduced motion follow

- **WHEN** the visitor prefers reduced motion and the pointer moves inside a marked area
- **THEN** the label stays on the offset point with no lag

### Requirement: Fade on enter and leave

Entering a marked area SHALL fade the label in. Leaving SHALL fade the label out. Leave SHALL include the pointer exiting all marked areas, and scroll or layout moving every marked area out from under a still pointer. Moving from one marked area to another SHALL update the label text without fading out.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run: the label SHALL appear and disappear immediately.

#### Scenario: Enter

- **WHEN** the pointer enters a marked area
- **THEN** the label fades in

#### Scenario: Leave

- **WHEN** the pointer leaves all marked areas
- **THEN** the label fades out

#### Scenario: Scroll off a marked area

- **WHEN** the label is visible over a marked area and the visitor scrolls until that area is no longer under the pointer
- **THEN** the label fades out

#### Scenario: Switch areas

- **WHEN** the pointer moves from one marked area to another whose `custom-cursor` value is different
- **THEN** the label text updates and the label stays visible

#### Scenario: Reduced motion fade

- **WHEN** the visitor prefers reduced motion and a marked area is entered or left, including by scroll
- **THEN** the label appears or disappears with no fade

### Requirement: Nearest marked ancestor

The label text SHALL come from the nearest ancestor (including the hovered node) that carries a non-empty `custom-cursor`.

#### Scenario: Nested marks

- **WHEN** the pointer is over an inner element with `custom-cursor="INNER"` inside an outer element with `custom-cursor="OUTER"`
- **THEN** the label shows `INNER`

### Requirement: No label on coarse pointers

On a coarse pointer (touch), the site SHALL NOT show the cursor label.

#### Scenario: Touch device

- **WHEN** the page loads on a coarse pointer
- **THEN** no cursor label is created or shown
