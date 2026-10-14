## ADDED Requirements

### Requirement: Desktop open and close fade the chrome

On a viewport wider than 767px, a user action that opens or closes the gallery SHALL fade `.layer`, `.layer-cta`, and `.product-nav-tab` to opacity 0 over `0.3s` ease-out before the settled gallery classes change. Those classes SHALL change only while the three containers are at opacity 0. The three containers SHALL then fade back to opaque over `0.3s` ease-out. A further user open or close during that fade-out SHALL replace the pending settled state and SHALL NOT start another fade-out. Restoring an open gallery from the next-product flag, and crossing 767px while the gallery is open, SHALL apply the settled classes with no fade. At 767px and below, and when `prefers-reduced-motion: reduce` is set, the settled classes SHALL apply with no fade.

#### Scenario: Desktop open fades around the blend

- **WHEN** the viewport is wider than 767px and the user opens the gallery
- **THEN** `.layer`, `.layer-cta`, and `.product-nav-tab` fade to opacity 0, the settled open classes apply while they are invisible, and the three fade back to opaque

#### Scenario: Desktop close fades around the blend

- **WHEN** the viewport is wider than 767px, the gallery is open, and the user closes it
- **THEN** the same fade-out, settled-class change, and fade-in run for the closed classes

#### Scenario: Second click during the fade-out

- **WHEN** the viewport is wider than 767px and the user opens or closes again before that fade-out ends
- **THEN** the pending settled state is the later action and a second fade-out does not start

#### Scenario: Next product restores without a fade

- **WHEN** a detail page opens the gallery from the next-product flag
- **THEN** the settled open classes apply with no fade

#### Scenario: Resize while open does not fade

- **WHEN** the gallery is open and the viewport crosses 767px
- **THEN** the settled classes match the new breakpoint with no fade

#### Scenario: Mobile and reduced motion stay instant

- **WHEN** the viewport is 767px wide or narrower, or `prefers-reduced-motion: reduce` is set, and the user opens or closes the gallery
- **THEN** the settled classes apply with no fade
