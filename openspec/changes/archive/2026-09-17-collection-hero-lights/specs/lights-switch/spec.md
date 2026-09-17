## ADDED Requirements

### Requirement: Collection hero photos follow the mode

When a `.collection-hero-photo` contains `.hero-photo-dark` that is not `.w-dyn-bind-empty`, light mode SHALL show `.hero-photo-light` and dark mode SHALL show `.hero-photo-dark` over `.hero-photo-light`. `.hero-photo-light` SHALL stay fully opaque in both modes.

When `.hero-photo-dark` is missing or has class `w-dyn-bind-empty`, the holder SHALL show `.hero-photo-light` in both modes and SHALL NOT show the empty dark placeholder.

`.hero-photo-dark` with class `is-none` SHALL still follow the mode. That class SHALL NOT keep the dark photo hidden.

#### Scenario: Both photos present, light mode

- **WHEN** the page is in light mode and a holder has `.hero-photo-light` and a non-empty `.hero-photo-dark`
- **THEN** `.hero-photo-light` is visible and `.hero-photo-dark` is not

#### Scenario: Both photos present, dark mode

- **WHEN** the page is in dark mode and a holder has `.hero-photo-light` and a non-empty `.hero-photo-dark`
- **THEN** `.hero-photo-dark` is visible over `.hero-photo-light`, and `.hero-photo-light` stays opaque

#### Scenario: Dark photo has is-none

- **WHEN** the page is in dark mode and `.hero-photo-dark` has class `is-none` and is not `.w-dyn-bind-empty`
- **THEN** `.hero-photo-dark` is visible over `.hero-photo-light`

#### Scenario: Empty dark field

- **WHEN** the page is in dark mode and `.hero-photo-dark` has class `w-dyn-bind-empty`
- **THEN** `.hero-photo-light` is visible and the empty dark image is not shown

## MODIFIED Requirements

### Requirement: Product thumbs follow the mode

When a `.thumb-img-holder` contains `.thumb-dark` that is not `.w-dyn-bind-empty`, light mode SHALL show `.thumb-light` and dark mode SHALL show `.thumb-dark` over `.thumb-light`. `.thumb-light` SHALL stay fully opaque in both modes.

When `.thumb-dark` is missing or has class `w-dyn-bind-empty`, the holder SHALL show `.thumb-light` in both modes and SHALL NOT show the empty dark placeholder.

#### Scenario: Both thumbs present, light mode

- **WHEN** the page is in light mode and a holder has `.thumb-light` and a non-empty `.thumb-dark`
- **THEN** `.thumb-light` is visible and `.thumb-dark` is not

#### Scenario: Both thumbs present, dark mode

- **WHEN** the page is in dark mode and a holder has `.thumb-light` and a non-empty `.thumb-dark`
- **THEN** `.thumb-dark` is visible over `.thumb-light`, and `.thumb-light` stays opaque

#### Scenario: Empty dark field

- **WHEN** the page is in dark mode and `.thumb-dark` has class `w-dyn-bind-empty`
- **THEN** `.thumb-light` is visible and the empty dark image is not shown

### Requirement: Smooth mode transition

Switching modes SHALL fade colors, the `.thumb-dark` overlay, and the collection `.hero-photo-dark` overlay over 0.3s. `.thumb-light` and `.hero-photo-light` SHALL NOT fade. When `prefers-reduced-motion: reduce` is set, that fade SHALL NOT run.

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** the mode changes without a 0.3s fade
