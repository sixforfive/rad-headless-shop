# product-thumb-hover Specification

## Purpose

Dims other product links in a shop or merch list so the hovered `.product-link` stays full opacity and the rest recede.

## Requirements

### Requirement: Sibling links dim on hover

While the pointer is over a `.product-link` in the shop listing, every other `.product-link` in the shop listing SHALL fade to 30% opacity, across both the original list and its clone. The hovered `.product-link` SHALL stay at 100% opacity.

While the pointer is over a `.product-link` in the merch listing, every other `.product-link` in that same list SHALL fade to 30% opacity. The merch listing SHALL NOT dim when a shop link is hovered, and the shop listing SHALL NOT dim when a merch link is hovered.

The dim SHALL apply on shop (gallery and list) and merch listing.

#### Scenario: Hover one shop link

- **WHEN** the pointer is over one `.product-link` in the shop listing
- **THEN** that link is at 100% opacity and every other `.product-link` in the shop listing is at 30% opacity

#### Scenario: Hover across the loop seam

- **WHEN** the shop gallery is scrolled so original and cloned thumbs are both visible and the pointer is over one original `.product-link`
- **THEN** cloned `.product-link` nodes dim the same as the other originals

#### Scenario: Hover one merch link

- **WHEN** the pointer is over one `.product-link` in the merch `.product-list`
- **THEN** that link is at 100% opacity and every other `.product-link` in that list is at 30% opacity

#### Scenario: Merch and shop do not cross

- **WHEN** a merch `.product-list` and a shop `.product-list` are on the same page and the pointer is over a shop `.product-link`
- **THEN** merch `.product-link` nodes stay at 100% opacity

### Requirement: Restore when hover ends

When the pointer is not over any `.product-link` in a list, every `.product-link` in that list SHALL return to 100% opacity.

Hovering the list background (gaps between thumbs) SHALL restore, not dim.

#### Scenario: Leave the links

- **WHEN** the pointer leaves every `.product-link` in a list
- **THEN** every `.product-link` in that list is at 100% opacity

#### Scenario: Hover the gap

- **WHEN** the pointer is over a `.product-list` but not over any `.product-link`
- **THEN** every `.product-link` in that list is at 100% opacity

### Requirement: Smooth fade

Opacity SHALL change with a smooth fade. When `prefers-reduced-motion: reduce` is set, the change SHALL be immediate.

#### Scenario: Fade on hover

- **WHEN** the pointer enters a `.product-link`
- **THEN** the other `.product-link` nodes fade to 30% opacity

#### Scenario: Fade on leave

- **WHEN** the pointer leaves every `.product-link` in the list
- **THEN** all `.product-link` nodes fade back to 100% opacity

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the pointer enters or leaves a `.product-link`
- **THEN** opacity changes immediately, with no fade

### Requirement: Existing activation stays

Clicks, hrefs, and grid placement on `.product-link` and `.product-thumb` SHALL behave as they did without the hover dim.

#### Scenario: Click a link while others are dimmed

- **WHEN** the visitor clicks the hovered `.product-link`
- **THEN** the click reaches that link and navigation is unchanged

### Requirement: No dim on coarse pointers

On a coarse pointer (touch), the site SHALL NOT dim sibling links.

#### Scenario: Touch device

- **WHEN** the page is used with a coarse pointer
- **THEN** all `.product-link` nodes stay at 100% opacity
