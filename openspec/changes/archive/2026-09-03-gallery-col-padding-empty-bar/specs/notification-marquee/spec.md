## ADDED Requirements

### Requirement: Gallery column padding when the bar is empty

When the page contains no `.notification-item` and the viewport is 767px wide or narrower, `.product-gallery-col` SHALL have `padding-top: 3rem` (`var(--_layout---spacing--space-300)`). When the viewport is wider than 767px, or when a `.notification-item` is present, `.product-gallery-col` SHALL keep its Webflow `padding-top`.

This SHALL apply wherever `.product-gallery-col` exists, including `/product/{slug}` and `/merch/{slug}`.

#### Scenario: No published item, 767px and down

- **WHEN** the page loads with no `.notification-item` and the viewport is 767px wide or narrower
- **THEN** `.product-gallery-col` has `padding-top: 3rem`

#### Scenario: No published item, wider than 767px

- **WHEN** the page loads with no `.notification-item` and the viewport is wider than 767px
- **THEN** `.product-gallery-col` keeps its Webflow `padding-top`

#### Scenario: Published item present

- **WHEN** the page loads and a `.notification-item` is present
- **THEN** `.product-gallery-col` keeps its Webflow `padding-top`

## MODIFIED Requirements

### Requirement: Drawer padding when the bar is empty

When the page contains no `.notification-item` and the viewport is 767px wide or narrower, `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` SHALL have `padding-top: var(--_layout---spacing--space-400)`. When the viewport is wider than 767px, or when a `.notification-item` is present, those lists SHALL keep their Webflow `padding-top`.

The empty condition SHALL be the absence of `.notification-item`, not `is-none` on `.notification-bar-box`: a published page with an empty Notifications collection omits `.notification-bar-box` from the DOM, so a selector keyed to that box never matches.

#### Scenario: No published item, 767px and down

- **WHEN** the page loads with no `.notification-item` and the viewport is 767px wide or narrower
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` have `padding-top: var(--_layout---spacing--space-400)`

#### Scenario: No published item, wider than 767px

- **WHEN** the page loads with no `.notification-item` and the viewport is wider than 767px
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` keep their Webflow `padding-top`

#### Scenario: Published item present

- **WHEN** the page loads and a `.notification-item` is present
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` keep their Webflow `padding-top`

#### Scenario: Bar element absent from the DOM

- **WHEN** the page loads without `.notification-bar-box` in the DOM and the viewport is 767px wide or narrower
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` have `padding-top: var(--_layout---spacing--space-400)`
