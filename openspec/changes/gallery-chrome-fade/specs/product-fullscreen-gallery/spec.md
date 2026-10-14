## MODIFIED Requirements

### Requirement: Desktop open keeps layer chrome

When the gallery is open and the viewport is wider than 767px, after a user-driven chrome fade has settled, `.gallery-full-screen` SHALL NOT have class `is-none`. `.product-gallery-collection.is-default` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none`. `.layer` SHALL have class `is-blend`. These classes are not required on the first frame of that open. A breakpoint change while open, and an already-open first paint, SHALL apply them in the same turn.

#### Scenario: Desktop open hides default collection

- **WHEN** the gallery opens on a viewport wider than 767px and the chrome fade has settled
- **THEN** `.gallery-full-screen` does not have `is-none`, `.product-gallery-collection.is-default` has `is-none`, `.layer` does not have `is-none`, and `.layer` has `is-blend`

### Requirement: Closed state restores both modes

When the gallery is closed, after a user-driven desktop chrome fade has settled, `.gallery-full-screen` SHALL have class `is-none`. `.layer` SHALL NOT have class `is-none` or `is-blend`. `.product-gallery-collection.is-default` SHALL NOT have class `is-none`. `html` and `body` SHALL NOT have class `is-full-screen`. These classes are not required on the first frame of that close. A mobile close, a breakpoint change, and an already-open first paint SHALL apply the matching classes in the same turn.

#### Scenario: Close restores chrome

- **WHEN** the gallery closes and any desktop chrome fade has settled
- **THEN** `.gallery-full-screen` has `is-none`, `.layer` does not have `is-none` or `is-blend`, `.product-gallery-collection.is-default` does not have `is-none`, and `html` and `body` do not have `is-full-screen`

### Requirement: Open gallery forces white body text

When the gallery is open at any viewport, after a user-driven desktop chrome fade has settled, `html` and `body` SHALL have class `is-full-screen` and `color` SHALL be `#fff`. When the gallery is closed, after that fade has settled, `html` and `body` SHALL NOT have `is-full-screen`, so text color SHALL return to the theme token. On mobile, on a breakpoint change, and on an already-open first paint, those classes SHALL apply in the same turn.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens and any desktop chrome fade has settled
- **THEN** `html` and `body` have `is-full-screen` and `color` is `#fff`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes and any desktop chrome fade has settled
- **THEN** `html` and `body` do not have `is-full-screen`

## ADDED Requirements

### Requirement: Desktop chrome fades across the blend snap

On a viewport wider than 767px, a user-driven open or close SHALL fade `.layer`, `.layer-cta`, and `.product-nav-tab` to opacity 0, then apply the blend and white-chrome change, then fade those three nodes back to opacity 1. The fade-in SHALL NOT start until the fade-out has ended. Each fade SHALL be opacity `0.3s ease`. The blend mode and the white text and border color SHALL change only while those three nodes are at opacity 0.

On a viewport 767px wide or narrower, opening and closing SHALL NOT run this fade. `.layer` SHALL still receive `is-none` in the same turn.

An already-open gallery on first paint SHALL NOT run this fade. A viewport change across 767px while the gallery is open SHALL NOT run this fade.

When `prefers-reduced-motion: reduce` is set, the fade SHALL NOT run. Open and close SHALL reach the settled classes in the same turn.

#### Scenario: Desktop open fades chrome out then in

- **WHEN** the viewport is wider than 767px and the user opens the gallery
- **THEN** `.layer`, `.layer-cta`, and `.product-nav-tab` fade to opacity 0 over `0.3s ease`, the blend and white chrome apply only after that, and those three nodes then fade to opacity 1 over `0.3s ease`

#### Scenario: Desktop close fades chrome out then in

- **WHEN** the gallery is open, the viewport is wider than 767px, and the user closes the gallery
- **THEN** `.layer`, `.layer-cta`, and `.product-nav-tab` fade to opacity 0 over `0.3s ease`, the blend and white chrome clear only after that, and those three nodes then fade to opacity 1 over `0.3s ease`

#### Scenario: Mobile does not fade chrome

- **WHEN** the viewport is 767px wide or narrower and the user opens or closes the gallery
- **THEN** `.layer`, `.layer-cta`, and `.product-nav-tab` do not fade, and `.layer` receives or loses `is-none` in the same turn

#### Scenario: First paint does not fade chrome

- **WHEN** the next detail page loads with the persist flag set
- **THEN** the open gallery paints with settled chrome and those three nodes do not fade

#### Scenario: Reduced motion chrome switch

- **WHEN** the visitor prefers reduced motion and opens or closes the gallery on a viewport wider than 767px
- **THEN** the settled open or closed classes apply with no fade
