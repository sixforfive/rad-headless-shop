# menu-link-hover Specification

## Purpose

Dims every other menu link on the page so the hovered `.menu-link` stays full opacity and the rest recede.

## Requirements

### Requirement: Other menu links dim on hover

While the pointer is over a `.menu-link`, every other `.menu-link` on the page SHALL fade to 30% opacity. The hovered `.menu-link` SHALL stay at 100% opacity.

The dim SHALL include navbar `.menu-link` nodes and `.menu-link` nodes outside the navbar.

#### Scenario: Hover one navbar link

- **WHEN** the pointer is over one `.menu-link` in the navbar
- **THEN** that link is at 100% opacity and every other `.menu-link` on the page is at 30% opacity

#### Scenario: Hover a menu link outside the navbar

- **WHEN** the pointer is over a `.menu-link` that is not in the navbar
- **THEN** that link is at 100% opacity and every navbar `.menu-link` is at 30% opacity

### Requirement: Restore when hover ends

When the pointer is not over any `.menu-link`, every `.menu-link` SHALL return to 100% opacity.

#### Scenario: Leave the links

- **WHEN** the pointer leaves every `.menu-link`
- **THEN** every `.menu-link` is at 100% opacity

### Requirement: Smooth fade

Opacity SHALL change with a 0.3s fade. When `prefers-reduced-motion: reduce` is set, the change SHALL be immediate.

#### Scenario: Fade on hover

- **WHEN** the pointer enters a `.menu-link`
- **THEN** the other `.menu-link` nodes fade to 30% opacity over 0.3s

#### Scenario: Fade on leave

- **WHEN** the pointer leaves every `.menu-link`
- **THEN** all `.menu-link` nodes fade back to 100% opacity over 0.3s

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the pointer enters or leaves a `.menu-link`
- **THEN** opacity changes immediately, with no fade

### Requirement: Existing activation stays

Clicks and hrefs on `.menu-link` SHALL behave as they did without the hover dim.

#### Scenario: Click a link while others are dimmed

- **WHEN** the visitor clicks the hovered `.menu-link`
- **THEN** the click reaches that link and navigation is unchanged

### Requirement: No dim below 768px or on coarse pointers

On viewports narrower than 768px, and on a coarse pointer (touch), the site SHALL NOT dim `.menu-link` nodes.

#### Scenario: Narrow viewport

- **WHEN** the viewport is narrower than 768px and the pointer is over a `.menu-link`
- **THEN** every `.menu-link` stays at 100% opacity

#### Scenario: Touch device

- **WHEN** the page is used with a coarse pointer
- **THEN** every `.menu-link` stays at 100% opacity
