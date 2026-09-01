## Purpose

Lets visitors toggle the published Webflow light and dark tokens from the navbar, keep that choice across visits, and show the matching product thumb and lights glyphs.

## ADDED Requirements

### Requirement: Default and persisted mode

The site SHALL open in light mode when `localStorage` key `rad-lights` is missing or is not `dark`. When the stored value is `dark`, the site SHALL open in dark mode.

Light mode SHALL mean `body` does not have class `dark-mode`. Dark mode SHALL mean `body` has class `dark-mode`.

#### Scenario: First visit

- **WHEN** the page loads and `rad-lights` is not set
- **THEN** `body` does not have class `dark-mode`

#### Scenario: Returning visitor in dark

- **WHEN** the page loads and `rad-lights` is `dark`
- **THEN** `body` has class `dark-mode`

#### Scenario: Invalid stored value

- **WHEN** the page loads and `rad-lights` is neither `light` nor `dark`
- **THEN** `body` does not have class `dark-mode`

### Requirement: Toggle from the navbar button

Clicking `#lights-switch-btn` SHALL switch to the opposite mode and persist it as `light` or `dark` under `rad-lights`.

#### Scenario: Light to dark

- **WHEN** the page is in light mode and the visitor clicks `#lights-switch-btn`
- **THEN** `body` has class `dark-mode` and `rad-lights` is `dark`

#### Scenario: Dark to light

- **WHEN** the page is in dark mode and the visitor clicks `#lights-switch-btn`
- **THEN** `body` does not have class `dark-mode` and `rad-lights` is `light`

### Requirement: Lights glyphs

Inside `#lights-switch-btn .link-sec-brack`, `.meta-link.is-plus` SHALL be visible in light mode and have class `is-none` in dark mode. `.meta-link.is-minus` SHALL be visible in dark mode and have class `is-none` in light mode.

Other `.link-sec-brack` nodes SHALL NOT receive this glyph swap.

#### Scenario: Light glyphs

- **WHEN** the page is in light mode
- **THEN** `.meta-link.is-plus` does not have class `is-none` and `.meta-link.is-minus` has class `is-none`

#### Scenario: Dark glyphs

- **WHEN** the page is in dark mode
- **THEN** `.meta-link.is-minus` does not have class `is-none` and `.meta-link.is-plus` has class `is-none`

### Requirement: Product thumbs follow the mode

When a `.thumb-img-holder` contains `.thumb-dark` that is not `.w-dyn-bind-empty`, light mode SHALL show `.thumb-light` and dark mode SHALL show `.thumb-dark`.

When `.thumb-dark` is missing or has class `w-dyn-bind-empty`, the holder SHALL show `.thumb-light` in both modes and SHALL NOT show the empty dark placeholder.

#### Scenario: Both thumbs present, light mode

- **WHEN** the page is in light mode and a holder has `.thumb-light` and a non-empty `.thumb-dark`
- **THEN** `.thumb-light` is visible and `.thumb-dark` is not

#### Scenario: Both thumbs present, dark mode

- **WHEN** the page is in dark mode and a holder has `.thumb-light` and a non-empty `.thumb-dark`
- **THEN** `.thumb-dark` is visible and `.thumb-light` is not

#### Scenario: Empty dark field

- **WHEN** the page is in dark mode and `.thumb-dark` has class `w-dyn-bind-empty`
- **THEN** `.thumb-light` is visible and the empty dark image is not shown

### Requirement: Smooth mode transition

Switching modes SHALL fade colors and product thumbs over 0.3s. When `prefers-reduced-motion: reduce` is set, that fade SHALL NOT run.

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** the mode changes without a 0.3s fade
