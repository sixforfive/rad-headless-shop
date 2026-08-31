# product-gallery-snap Specification

## Purpose

On `/product/{slug}` and `/merch/{slug}` at 767px and down, the in-page default gallery snaps each loaded image into the visible slot and shows a matching pagination tick for that image.

## Requirements

### Requirement: Default gallery snaps one image into view

On `/product/{slug}` and `/merch/{slug}`, on viewports 767px wide and narrower, after a horizontal swipe on `.product-gallery-collection.is-default .product-gallery-list` ends, exactly one `.product-gallery-item` in that list SHALL occupy the visible slot (flush with the list’s start edge).

This SHALL apply only to the default collection. `.gallery-full-screen .product-gallery-list` SHALL NOT receive this snap behavior.

On viewports wider than 767px, the default list SHALL NOT snap horizontally.

#### Scenario: Swipe settles on one image

- **WHEN** the viewport is 767px wide or narrower and the user swipes the default gallery list then releases
- **THEN** one default-collection `.product-gallery-item` is flush with the visible slot

#### Scenario: Full-screen list is unchanged

- **WHEN** the viewport is 767px wide or narrower and the user swipes `.gallery-full-screen .product-gallery-list`
- **THEN** that list does not snap horizontally as the default gallery does

#### Scenario: Desktop has no horizontal snap

- **WHEN** the viewport is wider than 767px
- **THEN** `.product-gallery-collection.is-default .product-gallery-list` does not snap horizontally

#### Scenario: Merch template snaps

- **WHEN** the viewport is 767px wide or narrower on `/merch/{slug}` and the user swipes the default gallery list then releases
- **THEN** one default-collection `.product-gallery-item` is flush with the visible slot

### Requirement: Pagination ticks match loaded images

On `/product/{slug}` and `/merch/{slug}`, `.pagination-bar` SHALL contain one `.pagination-item` per `.product-gallery-item` in `.product-gallery-collection.is-default`, in the same DOM order. The Designer template is a single `.pagination-item`; extra ticks SHALL be produced from that node, not from hardcoded `is-one` / `is-two` classes.

#### Scenario: Three images

- **WHEN** the default collection contains three `.product-gallery-item` nodes
- **THEN** `.pagination-bar` contains three `.pagination-item` nodes

#### Scenario: Two images

- **WHEN** the default collection contains two `.product-gallery-item` nodes
- **THEN** `.pagination-bar` contains two `.pagination-item` nodes

### Requirement: Chosen tick matches the snapped image

On `/product/{slug}` and `/merch/{slug}`, when the default gallery’s visible slot is occupied by the Nth `.product-gallery-item` (1-based order in the default collection), the Nth `.pagination-item` in `.pagination-bar` SHALL have class `is-choosen`. No other `.pagination-item` in that bar SHALL have `is-choosen`.

On load, before any swipe, the first image SHALL be treated as the visible slot.

#### Scenario: First image on load

- **WHEN** the page loads with two or more default-collection images
- **THEN** the first `.pagination-item` has `is-choosen` and the remaining ticks do not

#### Scenario: Second image snapped

- **WHEN** the viewport is 767px wide or narrower and the second default-collection image occupies the visible slot
- **THEN** the second `.pagination-item` has `is-choosen` and the first does not

### Requirement: Hide the bar when there are fewer than two images

On `/product/{slug}` and `/merch/{slug}`, when `.product-gallery-collection.is-default` contains fewer than two `.product-gallery-item` nodes, `.pagination-bar` SHALL have class `is-none`. When it contains two or more, `.pagination-bar` SHALL NOT have `is-none`.

#### Scenario: One image

- **WHEN** the default collection contains one `.product-gallery-item`
- **THEN** `.pagination-bar` has class `is-none`

#### Scenario: No images

- **WHEN** the default collection contains no `.product-gallery-item`
- **THEN** `.pagination-bar` has class `is-none`

#### Scenario: Two or more images

- **WHEN** the default collection contains two or more `.product-gallery-item` nodes
- **THEN** `.pagination-bar` does not have class `is-none`
