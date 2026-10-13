## MODIFIED Requirements

### Requirement: Label copy from custom-cursor

While the pointer is over an element that carries a non-empty `custom-cursor` attribute, the site SHALL show a label whose text is that attribute's value and whose class list includes `text-meta`. The label SHALL be created by the site; the marked element SHALL NOT be replaced or wrapped.

An empty `custom-cursor` value SHALL be treated as unmarked. After a copy change has settled, the shown text SHALL match the current attribute of the node under the pointer, including when that node or value changes without pointer movement. While a handoff between two non-empty values is in progress, the previous copy SHALL stay visible until it has faded out.

#### Scenario: Hover a marked area

- **WHEN** the pointer is over an element with `custom-cursor="[SHOP COLLECTION]"`
- **THEN** a `.text-meta` label showing `[SHOP COLLECTION]` is visible beside the pointer

#### Scenario: Empty attribute

- **WHEN** the pointer is over an element with `custom-cursor=""`
- **THEN** no cursor label is shown

#### Scenario: Full-width gallery open

- **WHEN** the pointer stays over the full-width gallery control and the visitor opens the gallery so the node under the pointer now has `custom-cursor="Close"`
- **THEN** the label settles on `Close` without requiring the pointer to move

#### Scenario: Full-width gallery close

- **WHEN** the pointer stays over the full-width gallery control and the visitor closes the gallery so the node under the pointer now has `custom-cursor="Open"`
- **THEN** the label settles on `Open` without requiring the pointer to move

### Requirement: Fade on enter and leave

Entering a marked area SHALL fade the label in. Leaving SHALL fade the label out. Leave SHALL include the pointer exiting all marked areas, and scroll or layout moving every marked area out from under a still pointer. Enter and leave SHALL use opacity `0.15s ease-out`.

When the shown copy changes from one non-empty `custom-cursor` value to another, including under a still pointer, the previous copy SHALL fade out with `opacity 0.3s ease` and the next copy SHALL fade in with `opacity 0.3s ease 0.3s`. The copy that is still fully shown SHALL NOT have its text replaced in place.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run: the label SHALL appear, disappear, and swap copy immediately.

#### Scenario: Enter

- **WHEN** the pointer enters a marked area
- **THEN** the label fades in over `0.15s ease-out`

#### Scenario: Leave

- **WHEN** the pointer leaves all marked areas
- **THEN** the label fades out over `0.15s ease-out`

#### Scenario: Scroll off a marked area

- **WHEN** the label is visible over a marked area and the visitor scrolls until that area is no longer under the pointer
- **THEN** the label fades out over `0.15s ease-out`

#### Scenario: Switch areas

- **WHEN** the pointer moves from one marked area to another whose `custom-cursor` value is different
- **THEN** the previous copy fades out with `opacity 0.3s ease` and the next copy fades in with `opacity 0.3s ease 0.3s`

#### Scenario: Still pointer gallery copy

- **WHEN** the pointer stays over the full-width gallery control and the `custom-cursor` value changes between `Open` and `Close`
- **THEN** the previous copy fades out with `opacity 0.3s ease` and the next copy fades in with `opacity 0.3s ease 0.3s` without requiring the pointer to move

#### Scenario: Reduced motion fade

- **WHEN** the visitor prefers reduced motion and a marked area is entered or left, including by scroll, or the copy changes from one non-empty value to another
- **THEN** the label appears, disappears, or shows the new copy with no fade
