## MODIFIED Requirements

### Requirement: Smooth mode transition

Switching modes SHALL fade `background-color`, `color`, and `border-color` over 0.45s ease-out on `html` and on page content. That fade SHALL still run on shop and product content, on the collection gallery, on `.gallery-full-screen`, and while a drawer dims the page. `.thumb-dark` and `.hero-photo-dark` opacity SHALL use the same 0.45s ease-out. `.thumb-light` and `.hero-photo-light` SHALL NOT fade. When `prefers-reduced-motion: reduce` is set, that fade SHALL NOT run.

#### Scenario: Theme fade

- **WHEN** the visitor clicks `#lights-switch-btn`
- **THEN** page background, text, and borders fade to the other mode over 0.45s ease-out

#### Scenario: Shop and product

- **WHEN** the visitor toggles lights on `/shop` or on a product page
- **THEN** the page background, text, and borders fade over 0.45s ease-out

#### Scenario: Collection gallery

- **WHEN** the visitor toggles lights on `/`
- **THEN** the collection gallery background fades over 0.45s ease-out

#### Scenario: Drawer open

- **WHEN** a drawer is open and the visitor toggles lights
- **THEN** the dimmed page and `.gallery-full-screen` still fade background, text, and borders over 0.45s ease-out

#### Scenario: Thumb and hero photo overlays

- **WHEN** the visitor toggles lights and a holder has a non-empty `.thumb-dark` or `.hero-photo-dark`
- **THEN** that overlay fades over 0.45s ease-out and the light image stays opaque

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** the mode changes without a 0.45s fade
