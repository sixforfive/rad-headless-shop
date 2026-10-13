## ADDED Requirements

### Requirement: Gallery switch fades

On a viewport wider than 767px, opening the gallery SHALL fade `.product-gallery-collection.is-default` out, then fade `.gallery-full-screen` in. Closing SHALL fade `.gallery-full-screen` out, then fade `.product-gallery-collection.is-default` in. The two fades SHALL NOT overlap. Each fade SHALL be opacity `0.8s ease`. The surface fading out SHALL ignore pointer events from the start of that fade.

On a viewport 767px wide or narrower, opening and closing SHALL use that same out-then-in sequence. After it settles, `.product-gallery-collection.is-default` SHALL NOT have `is-none`.

On a viewport wider than 767px, `is-none` SHALL be applied to the gallery that faded out, after the fade-in ends, so it is removed from layout. Until then that gallery SHALL stay displayed.

An already-open gallery on first paint SHALL NOT run this fade.

Drawer dim on `.gallery-full-screen` and the theme color fade SHALL keep their existing timing. This open/close opacity fade SHALL NOT replace them.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run. Open and close SHALL reach the settled classes immediately.

#### Scenario: Desktop open fades out then in

- **WHEN** the viewport is wider than 767px and the user opens the gallery
- **THEN** `.product-gallery-collection.is-default` fades out over `0.8s ease` and ignores pointer events from the start, and `.gallery-full-screen` stays hidden until that fade ends, then fades in over `0.8s ease`

#### Scenario: Desktop close fades out then in

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user closes the gallery
- **THEN** `.gallery-full-screen` fades out over `0.8s ease` and ignores pointer events from the start, and `.product-gallery-collection.is-default` stays hidden until that fade ends, then fades in over `0.8s ease`

#### Scenario: Mobile fades out then in

- **WHEN** the viewport is 767px wide or narrower and the user opens or closes the gallery
- **THEN** the shown gallery fades out over `0.8s ease`, then the other fades in over `0.8s ease`, and after it settles `.product-gallery-collection.is-default` does not have `is-none`

#### Scenario: Settled hide after the fade-in

- **WHEN** the fade-in ends on a viewport wider than 767px
- **THEN** the gallery that faded out has `is-none` and is not displayed, and it stayed displayed until the fade-in ended

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
