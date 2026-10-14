## MODIFIED Requirements

### Requirement: Lights swap textures without resetting the view

Light-mode planes SHALL use the display URL of each `.hero-gallery-light .hero-gallery-img` in DOM order. Dark-mode planes SHALL use the display URL of each `.hero-gallery-dark .hero-gallery-img` at the same index.

The display URL of a hero image SHALL be the `srcset` candidate whose width descriptor is nearest 800 when that image has a `srcset`. When the image has no `srcset`, the display URL SHALL be that image's `src`.

When the page loads in light mode, the site SHALL request light display URLs and SHALL NOT request dark display URLs. When the page loads in dark mode, the site SHALL request dark display URLs and SHALL NOT request light display URLs, except a light display URL used because that dark index has no image.

Toggling `#lights-switch-btn` SHALL request the display URLs of the mode being entered, replace those textures, and SHALL NOT reset pan or plane layout.

When dark has no image at an index, that plane SHALL keep the light image.

#### Scenario: Dark toggle keeps position

- **WHEN** the visitor has panned the gallery and then clicks `#lights-switch-btn` into dark mode
- **THEN** the same planes show the dark display URL at each index and the viewpoint has not jumped to the start

#### Scenario: Light toggle keeps position

- **WHEN** the visitor is in dark mode in the gallery and clicks `#lights-switch-btn` into light mode
- **THEN** the same planes show the light display URL at each index and the viewpoint has not jumped to the start

#### Scenario: Missing dark image

- **WHEN** dark mode is on and `.hero-gallery-dark` has fewer images than `.hero-gallery-light`
- **THEN** planes past the dark list still show the matching light image

#### Scenario: Light boot skips dark files

- **WHEN** the gallery canvas boots and `body` does not have class `dark-mode`
- **THEN** light display URLs are requested and dark display URLs are not

#### Scenario: Dark boot skips unused light files

- **WHEN** the gallery canvas boots and `body` has class `dark-mode` and every light index has a dark image
- **THEN** dark display URLs are requested and light display URLs are not

#### Scenario: Srcset picks the nearest 800

- **WHEN** a hero image has a `srcset` with width candidates
- **THEN** its plane requests the candidate whose width descriptor is nearest 800

#### Scenario: No srcset keeps the src

- **WHEN** a hero image has no `srcset`
- **THEN** its plane requests that image's `src`
