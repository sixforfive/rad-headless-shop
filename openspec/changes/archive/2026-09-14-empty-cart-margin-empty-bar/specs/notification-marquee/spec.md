## ADDED Requirements

### Requirement: Empty cart margin when the bar is empty

When the page contains no `.notification-item` and the viewport is 767px wide or narrower, `.empty-cart` SHALL have `margin-top: var(--_layout---spacing--space-400)`. When the viewport is wider than 767px, or when a `.notification-item` is present, `.empty-cart` SHALL keep its Webflow `margin-top`.

The empty condition SHALL be the absence of `.notification-item`, not `is-none` on `.notification-bar-box`: a published page with an empty Notifications collection omits `.notification-bar-box` from the DOM, so a selector keyed to that box never matches.

#### Scenario: No published item, 767px and down

- **WHEN** the page loads with no `.notification-item` and the viewport is 767px wide or narrower
- **THEN** `.empty-cart` has `margin-top: var(--_layout---spacing--space-400)`

#### Scenario: No published item, wider than 767px

- **WHEN** the page loads with no `.notification-item` and the viewport is wider than 767px
- **THEN** `.empty-cart` keeps its Webflow `margin-top`

#### Scenario: Published item present

- **WHEN** the page loads and a `.notification-item` is present
- **THEN** `.empty-cart` keeps its Webflow `margin-top`

#### Scenario: Bar element absent from the DOM

- **WHEN** the page loads without `.notification-bar-box` in the DOM and the viewport is 767px wide or narrower
- **THEN** `.empty-cart` has `margin-top: var(--_layout---spacing--space-400)`
