## ADDED Requirements

### Requirement: Collection hero photos follow the mode

When a `.collection-hero-photo` contains `.hero-photo-dark` that is not `.w-dyn-bind-empty`, light mode SHALL show `.hero-photo-light` and dark mode SHALL show `.hero-photo-dark`.

When `.hero-photo-dark` is missing or has class `w-dyn-bind-empty`, the holder SHALL show `.hero-photo-light` in both modes and SHALL NOT show the empty dark placeholder.

`.hero-photo-dark` with class `is-none` SHALL still follow the mode. That class SHALL NOT keep the dark photo hidden.

#### Scenario: Both photos present, light mode

- **WHEN** the page is in light mode and a holder has `.hero-photo-light` and a non-empty `.hero-photo-dark`
- **THEN** `.hero-photo-light` is visible and `.hero-photo-dark` is not

#### Scenario: Both photos present, dark mode

- **WHEN** the page is in dark mode and a holder has `.hero-photo-light` and a non-empty `.hero-photo-dark`
- **THEN** `.hero-photo-dark` is visible and `.hero-photo-light` is not

#### Scenario: Dark photo has is-none

- **WHEN** the page is in dark mode and `.hero-photo-dark` has class `is-none` and is not `.w-dyn-bind-empty`
- **THEN** `.hero-photo-dark` is visible and `.hero-photo-light` is not

#### Scenario: Empty dark field

- **WHEN** the page is in dark mode and `.hero-photo-dark` has class `w-dyn-bind-empty`
- **THEN** `.hero-photo-light` is visible and the empty dark image is not shown

## MODIFIED Requirements

### Requirement: Smooth mode transition

Switching modes SHALL fade colors, product thumbs, and collection hero photos over 0.3s. When `prefers-reduced-motion: reduce` is set, that fade SHALL NOT run.

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** the mode changes without a 0.3s fade
