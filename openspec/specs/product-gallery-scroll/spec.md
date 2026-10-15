# product-gallery-scroll Specification

## Purpose

On product and merch detail, the desktop default gallery scrolls from a wheel anywhere in the viewport, not only while the pointer is over the gallery.

## Requirements

### Requirement: Viewport wheel scrolls the desktop default gallery

On `/product/{slug}` and `/merch/{slug}`, when the viewport is wider than 767px, the fullscreen gallery is closed, and the visitor does not prefer reduced motion, a vertical wheel anywhere in the viewport SHALL scroll the default gallery. The pointer SHALL NOT have to be over `.product-gallery-col`.

#### Scenario: Wheel outside the gallery

- **WHEN** the viewport is wider than 767px on `/product/{slug}`, the fullscreen gallery is closed, and the visitor wheels while the pointer is outside `.product-gallery-col`
- **THEN** the default gallery scrolls

#### Scenario: Wheel over the gallery

- **WHEN** the viewport is wider than 767px on `/product/{slug}`, the fullscreen gallery is closed, and the visitor wheels while the pointer is over `.product-gallery-col`
- **THEN** the default gallery scrolls

#### Scenario: Merch detail matches

- **WHEN** the viewport is wider than 767px on `/merch/{slug}`, the fullscreen gallery is closed, and the visitor wheels anywhere in the viewport
- **THEN** the default gallery scrolls

### Requirement: Fullscreen, narrow viewports, and reduced motion stay unchanged

On `/product/{slug}` and `/merch/{slug}`, this viewport-wide gallery wheel SHALL NOT apply while the fullscreen gallery is open, while the viewport is 767px wide or narrower, or when the visitor prefers reduced motion. Those cases SHALL keep their current scroll.

#### Scenario: Fullscreen uses the page

- **WHEN** the fullscreen gallery is open on a viewport wider than 767px and the visitor wheels
- **THEN** the page scrolls and the closed default gallery is not the scroller

#### Scenario: Narrow viewport keeps the page scroll

- **WHEN** the viewport is 767px wide or narrower and the visitor wheels vertically outside the default gallery
- **THEN** the page scrolls and the default gallery does not take that wheel

#### Scenario: Reduced motion stays on the column

- **WHEN** the visitor prefers reduced motion, the viewport is wider than 767px, the fullscreen gallery is closed, and the visitor wheels outside `.product-gallery-col`
- **THEN** the default gallery does not scroll

### Requirement: An open drawer keeps its own scroll

On `/product/{slug}` and `/merch/{slug}`, while the menu or cart drawer is open, a wheel over that drawer's list SHALL scroll the list. A wheel elsewhere SHALL NOT scroll the default gallery. The page behind the drawer SHALL stay locked.

#### Scenario: Drawer list scrolls

- **WHEN** the menu or cart drawer is open and the visitor wheels over that drawer's list
- **THEN** the list scrolls and the default gallery does not

#### Scenario: Gallery stays put behind the drawer

- **WHEN** the menu or cart drawer is open and the visitor wheels outside that drawer's list
- **THEN** the default gallery does not scroll and the page behind the drawer does not scroll
