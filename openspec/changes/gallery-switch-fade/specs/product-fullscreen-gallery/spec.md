## ADDED Requirements

### Requirement: Gallery switch fades

On a viewport wider than 767px, opening the gallery SHALL fade `.gallery-full-screen` from hidden to shown and `.product-gallery-collection.is-default` from shown to hidden over the same interval, starting together. Closing SHALL reverse that pair. Each fade SHALL be opacity `0.8s ease`. The surface fading out SHALL ignore pointer events from the start of the fade.

On a viewport 767px wide or narrower, `.product-gallery-collection.is-default` SHALL stay shown. Only `.gallery-full-screen` SHALL fade in on open and fade out on close, at the same opacity timing.

`is-none` SHALL be applied to the gallery that finished fading out, after that fade ends, so it is removed from layout. Until then that gallery SHALL stay displayed.

An already-open gallery on first paint SHALL NOT run this fade.

Drawer dim on `.gallery-full-screen` and the theme color fade SHALL keep their existing timing. This open/close opacity fade SHALL NOT replace them.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run. Open and close SHALL reach the settled classes immediately.

#### Scenario: Desktop open crossfades

- **WHEN** the viewport is wider than 767px and the user opens the gallery
- **THEN** `.gallery-full-screen` fades in and `.product-gallery-collection.is-default` fades out together over `0.8s ease`, and the default collection ignores pointer events from the start

#### Scenario: Desktop close crossfades

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user closes the gallery
- **THEN** `.product-gallery-collection.is-default` fades in and `.gallery-full-screen` fades out together over `0.8s ease`, and the full-screen gallery ignores pointer events from the start

#### Scenario: Mobile fades only the full-screen gallery

- **WHEN** the viewport is 767px wide or narrower and the user opens or closes the gallery
- **THEN** `.gallery-full-screen` fades in or out over `0.8s ease` and `.product-gallery-collection.is-default` stays shown

#### Scenario: Settled hide after the fade

- **WHEN** a gallery surface finishes fading out
- **THEN** that surface has `is-none` and is not displayed, and it stayed displayed until the fade ended

#### Scenario: Reduced motion gallery switch

- **WHEN** the visitor prefers reduced motion and opens or closes the gallery
- **THEN** the settled open or closed classes apply with no fade

## MODIFIED Requirements

### Requirement: Desktop open keeps layer chrome

When the gallery is open and the viewport is wider than 767px, after the open fade has settled, `.gallery-full-screen` SHALL NOT have class `is-none`. `.product-gallery-collection.is-default` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-blend`. These classes are not required on the first frame of a user-driven open.

#### Scenario: Desktop open hides default collection

- **WHEN** the gallery opens on a viewport wider than 767px and the open fade has settled
- **THEN** `.gallery-full-screen` does not have `is-none`, `.product-gallery-collection.is-default` has `is-none`, `.layer` does not have `is-none`, and `.layer` has `is-blend`

### Requirement: Closed state restores both modes

When the gallery is closed, after the close fade has settled, `.gallery-full-screen` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none` or `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`. `html` and `body` SHALL NOT have class `is-full-screen`. These classes are not required on the first frame of a user-driven close.

#### Scenario: Close restores chrome

- **WHEN** the gallery closes and the close fade has settled
- **THEN** `.gallery-full-screen` has `is-none`, `.layer` does not have `is-none` or `is-blend`, `.product-gallery-collection.is-default` does not have `is-none`, and `html` and `body` do not have `is-full-screen`

### Requirement: Incoming open gallery paints before script

When the one-shot flag is set, the Product template Head SHALL add class `is-full-screen` on `html` before first paint. While `html` has `is-full-screen`, `.gallery-full-screen` SHALL be visible, white layer chrome SHALL apply, and desktop vs mobile open classes SHALL match the open-gallery rules (desktop keep-chrome / mobile hide-layer) without waiting for `product.js`. That first paint SHALL NOT fade.

#### Scenario: First paint is open

- **WHEN** the next detail page loads with the persist flag set
- **THEN** first paint shows the full-screen gallery open at the current breakpoint

#### Scenario: Persisted open does not fade in

- **WHEN** the next detail page loads with the persist flag set
- **THEN** the full-screen gallery is shown on first paint with no intro fade
