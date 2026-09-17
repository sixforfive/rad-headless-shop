## Purpose

Shows an informational `.text-meta` label next to the default pointer over areas marked `custom-cursor`, without changing clicks or the native arrow.

## ADDED Requirements

### Requirement: Label copy from custom-cursor

While the pointer is over an element that carries a non-empty `custom-cursor` attribute, the site SHALL show a label whose text is that attribute's value and whose class list includes `text-meta`. The label SHALL be created by the site; the marked element SHALL NOT be replaced or wrapped.

An empty `custom-cursor` value SHALL be treated as unmarked.

#### Scenario: Hover a marked area

- **WHEN** the pointer is over an element with `custom-cursor="[SHOP COLLECTION]"`
- **THEN** a `.text-meta` label showing `[SHOP COLLECTION]` is visible beside the pointer

#### Scenario: Empty attribute

- **WHEN** the pointer is over an element with `custom-cursor=""`
- **THEN** no cursor label is shown

### Requirement: Default arrow and existing activation stay

The site SHALL keep the default arrow cursor. The label SHALL NOT receive pointer events. Clicks, hrefs, and other activation on the marked area SHALL behave as they did without the label.

#### Scenario: Click through the label

- **WHEN** the visitor clicks the marked area while the label is visible
- **THEN** the click reaches the marked area and the native arrow remains the cursor

### Requirement: Rubber follow

While the label is shown, it SHALL lag the pointer with easing rather than sitting on the hotspot. The native arrow SHALL stay on the pointer.

#### Scenario: Move inside a marked area

- **WHEN** the pointer moves inside a `[custom-cursor]` area
- **THEN** the label trails the pointer with easing and the arrow stays on the pointer

#### Scenario: Reduced motion follow

- **WHEN** the visitor prefers reduced motion and the pointer moves inside a marked area
- **THEN** the label stays on the offset point with no lag

### Requirement: Fade on enter and leave

Entering a marked area SHALL fade the label in. Leaving SHALL fade the label out. Moving from one marked area to another SHALL update the label text without fading out.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run: the label SHALL appear and disappear immediately.

#### Scenario: Enter

- **WHEN** the pointer enters a marked area
- **THEN** the label fades in

#### Scenario: Leave

- **WHEN** the pointer leaves all marked areas
- **THEN** the label fades out

#### Scenario: Switch areas

- **WHEN** the pointer moves from one marked area to another whose `custom-cursor` value is different
- **THEN** the label text updates and the label stays visible

#### Scenario: Reduced motion fade

- **WHEN** the visitor prefers reduced motion and the pointer enters or leaves a marked area
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
