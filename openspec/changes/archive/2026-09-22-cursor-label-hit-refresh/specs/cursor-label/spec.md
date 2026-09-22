## ADDED Requirements

### Requirement: Leave when the marked area moves out from under a still pointer

When the pointer is stationary and scroll or layout moves every non-empty `custom-cursor` area out from under it, the site SHALL fade the label out the same as a pointer leave.

When `prefers-reduced-motion: reduce` is set, the label SHALL disappear immediately.

#### Scenario: Scroll off a marked area

- **WHEN** the label is visible over a marked area and the visitor scrolls until that area is no longer under the pointer
- **THEN** the label fades out

#### Scenario: Reduced motion scroll leave

- **WHEN** the visitor prefers reduced motion and scroll moves every marked area out from under the pointer
- **THEN** the label disappears with no fade

### Requirement: Copy tracks the node under a still pointer

When the node under the pointer is replaced, or its `custom-cursor` value changes, without pointer movement, the label text SHALL update to the current non-empty attribute value. If that value becomes empty or no marked node remains under the pointer, the label SHALL fade out as leave.

#### Scenario: Full-width gallery open

- **WHEN** the pointer stays over the full-width gallery control and the visitor opens the gallery so the node under the pointer now has `custom-cursor="Close"`
- **THEN** the label shows `Close` without requiring the pointer to move

#### Scenario: Full-width gallery close

- **WHEN** the pointer stays over the full-width gallery control and the visitor closes the gallery so the node under the pointer now has `custom-cursor="Open"`
- **THEN** the label shows `Open` without requiring the pointer to move
