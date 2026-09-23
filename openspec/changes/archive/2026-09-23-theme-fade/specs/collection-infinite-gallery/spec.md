## MODIFIED Requirements

### Requirement: Lights swap textures without resetting the view

Light-mode planes SHALL use `.hero-gallery-light .hero-gallery-img` `src` values in DOM order. Dark-mode planes SHALL use `.hero-gallery-dark .hero-gallery-img` `src` values at the same index.

Toggling `#lights-switch-btn` SHALL crossfade those textures over 0.45s ease-out and SHALL NOT reset pan or plane layout. When `prefers-reduced-motion: reduce` is set, the swap SHALL be immediate.

When dark has no image at an index, that plane SHALL keep the light image.

#### Scenario: Dark toggle keeps position

- **WHEN** the visitor has panned the gallery and then clicks `#lights-switch-btn` into dark mode
- **THEN** the same planes show the dark `src` at each index and the viewpoint has not jumped to the start

#### Scenario: Light toggle keeps position

- **WHEN** the visitor is in dark mode in the gallery and clicks `#lights-switch-btn` into light mode
- **THEN** the same planes show the light `src` at each index and the viewpoint has not jumped to the start

#### Scenario: Texture crossfade

- **WHEN** the visitor toggles lights and the incoming texture is already loaded
- **THEN** each plane blends from the outgoing texture to the incoming texture over 0.45s ease-out

#### Scenario: Missing dark image

- **WHEN** dark mode is on and `.hero-gallery-dark` has fewer images than `.hero-gallery-light`
- **THEN** planes past the dark list still show the matching light image

#### Scenario: Reduced motion swaps immediately

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** plane textures change in one frame and the viewpoint does not jump
