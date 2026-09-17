## Purpose

Dims sibling product thumbs in a shop or merch list so the hovered thumb stays full opacity and the rest recede.

## ADDED Requirements

### Requirement: Sibling thumbs dim on hover

While the pointer is over a `.product-thumb` inside a `.product-list`, every other `.product-thumb` in that same list SHALL fade to 30% opacity. The hovered thumb SHALL stay at 100% opacity.

The dim SHALL apply on shop (gallery and list) and merch listing. Thumbs in a different `.product-list` SHALL NOT change.

#### Scenario: Hover one shop thumb

- **WHEN** the pointer is over one `.product-thumb` in the shop `.product-list`
- **THEN** that thumb is at 100% opacity and every other `.product-thumb` in that list is at 30% opacity

#### Scenario: Hover one merch thumb

- **WHEN** the pointer is over one `.product-thumb` in the merch `.product-list`
- **THEN** that thumb is at 100% opacity and every other `.product-thumb` in that list is at 30% opacity

### Requirement: Restore when hover ends

When the pointer is not over any `.product-thumb` in a list, every `.product-thumb` in that list SHALL return to 100% opacity.

Hovering the list background (gaps between thumbs) SHALL restore, not dim.

#### Scenario: Leave the thumbs

- **WHEN** the pointer leaves every `.product-thumb` in a list
- **THEN** every `.product-thumb` in that list is at 100% opacity

#### Scenario: Hover the gap

- **WHEN** the pointer is over a `.product-list` but not over any `.product-thumb`
- **THEN** every `.product-thumb` in that list is at 100% opacity

### Requirement: Smooth fade

Opacity SHALL change with a smooth fade. When `prefers-reduced-motion: reduce` is set, the change SHALL be immediate.

#### Scenario: Fade on hover

- **WHEN** the pointer enters a `.product-thumb`
- **THEN** the other thumbs fade to 30% opacity

#### Scenario: Fade on leave

- **WHEN** the pointer leaves every `.product-thumb` in the list
- **THEN** all thumbs fade back to 100% opacity

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the pointer enters or leaves a `.product-thumb`
- **THEN** opacity changes immediately, with no fade

### Requirement: Existing activation stays

Clicks, hrefs, and grid placement on `.product-thumb` SHALL behave as they did without the hover dim.

#### Scenario: Click a thumb while others are dimmed

- **WHEN** the visitor clicks the hovered `.product-thumb`
- **THEN** the click reaches that thumb and navigation is unchanged

### Requirement: No dim on coarse pointers

On a coarse pointer (touch), the site SHALL NOT dim sibling thumbs.

#### Scenario: Touch device

- **WHEN** the page is used with a coarse pointer
- **THEN** all `.product-thumb` nodes stay at 100% opacity
