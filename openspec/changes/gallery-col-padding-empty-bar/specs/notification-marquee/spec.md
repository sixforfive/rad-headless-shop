## ADDED Requirements

### Requirement: Gallery column padding when the bar is empty

When `.notification-bar-box` has class `is-none` and the viewport is 767px wide or narrower, `.product-gallery-col` SHALL have `padding-top: 3rem` (`var(--_layout---spacing--space-300)`). When the viewport is wider than 767px, or when `.notification-bar-box` does not have `is-none`, `.product-gallery-col` SHALL keep its Webflow `padding-top`.

This SHALL apply wherever `.product-gallery-col` exists, including `/product/{slug}` and `/merch/{slug}`.

#### Scenario: No published item, 767px and down

- **WHEN** the page loads, `.notification-bar-box` has no `.notification-item`, and the viewport is 767px wide or narrower
- **THEN** `.product-gallery-col` has `padding-top: 3rem`

#### Scenario: No published item, wider than 767px

- **WHEN** the page loads, `.notification-bar-box` has no `.notification-item`, and the viewport is wider than 767px
- **THEN** `.product-gallery-col` keeps its Webflow `padding-top`

#### Scenario: Published item present

- **WHEN** the page loads and `.notification-bar-box` contains a `.notification-item`
- **THEN** `.product-gallery-col` keeps its Webflow `padding-top`
