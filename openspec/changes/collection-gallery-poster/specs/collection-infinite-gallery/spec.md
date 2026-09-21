## ADDED Requirements

### Requirement: Poster mosaic on a wrapping period

The image space SHALL be one finite period that repeats on a torus: a tile leaving one edge SHALL enter from the opposite edge. The period SHALL be a seeded irregular field of about fourteen tiles, not a regular cell grid. Tiles SHALL sit at random positions.

Each tile SHALL show one image from `.hero-gallery-light` (dark list at the same index). Size SHALL be one of four classes (small, medium, large, extra-large) with original aspect ratio. Tiles SHALL NOT overlap. The gap between tiles SHALL be at least 24 CSS pixels at a 1440-wide host.

Tiles close to each other, including across the period wrap, SHALL NOT show the same image when the light list has at least three images.

The same seed SHALL produce the same period on every load.

`.collection-hero-logo` SHALL stay fixed in the viewport while the mosaic pans. Images MAY pass under the logo.

#### Scenario: Wrap from the right

- **WHEN** the visitor pans the gallery until an image leaves the right edge
- **THEN** that image enters from the left at the matching vertical position

#### Scenario: No overlap

- **WHEN** the gallery canvas is showing
- **THEN** no two image tiles share screen pixels with each other

#### Scenario: Dense irregular field

- **WHEN** the gallery canvas is showing at a 1440-wide host
- **THEN** images of mixed sizes fill most of the hero in an irregular arrangement, not a regular grid and not a mostly empty field

#### Scenario: Neighbor uniqueness

- **WHEN** the light gallery has at least three images and the mosaic is showing
- **THEN** no tile shows the same image as a nearby tile, including across the period edge

#### Scenario: Logo does not pan

- **WHEN** the visitor pans the gallery
- **THEN** `.collection-hero-logo` stays in the same viewport position

### Requirement: Period scale does not reflow

Period geometry SHALL be fixed in world units. Changing the host size SHALL crop or reveal more of the same period. Tile positions, relative sizes, and which images occupy which tiles SHALL NOT change on resize.

#### Scenario: Resize keeps the same mosaic

- **WHEN** the visitor resizes the window while the gallery is showing
- **THEN** the same images sit in the same relative arrangement; only how much of the period is visible changes

## MODIFIED Requirements

### Requirement: Pannable space with inertia

Inside `.collection-hero-gallery`, drag SHALL pan the image space on X and Y. Wheel SHALL pan on X and Y. Pinch SHALL NOT move the viewpoint in depth. After pointer release, motion SHALL keep inertia. While no pointer is dragging and inertia has ended, the space SHALL stay still. Keyboard WASD and QE SHALL NOT pan this space.

Image count SHALL be the number of `.hero-gallery-img` in `.hero-gallery-light` (DOM order). The site SHALL NOT require a fixed N.

When `prefers-reduced-motion: reduce` is set, the site SHALL show the space without inertia.

#### Scenario: Drag pans

- **WHEN** the visitor drags inside `.collection-hero-gallery`
- **THEN** the images move with the drag and continue with inertia after release

#### Scenario: Wheel pans

- **WHEN** the visitor wheels over `.collection-hero-gallery`
- **THEN** the image space pans on X and Y and does not move in depth

#### Scenario: Rest stays still

- **WHEN** the gallery is showing and the visitor is not dragging
- **THEN** after inertia ends the image space does not move

#### Scenario: Keyboard ignored

- **WHEN** the visitor presses W, A, S, D, Q, or E while the gallery is showing
- **THEN** the image space does not pan from those keys

#### Scenario: Six vs twenty images

- **WHEN** `.hero-gallery-light` contains six images, and separately when it contains twenty
- **THEN** the canvas uses that many unique images and still fills the period by repeating them without placing the same image on nearby tiles when N is at least three

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the gallery canvas is showing
- **THEN** drag does not apply inertia and the space does not move on its own

### Requirement: Lights swap textures without resetting the view

Light-mode planes SHALL use `.hero-gallery-light .hero-gallery-img` `src` values in DOM order. Dark-mode planes SHALL use `.hero-gallery-dark .hero-gallery-img` `src` values at the same index.

Toggling `#lights-switch-btn` SHALL replace those textures and SHALL NOT reset pan or plane positions.

When dark has no image at an index, that plane SHALL keep the light image.

#### Scenario: Dark toggle keeps position

- **WHEN** the visitor has panned the gallery and then clicks `#lights-switch-btn` into dark mode
- **THEN** the same planes show the dark `src` at each index and the viewpoint has not jumped to the start

#### Scenario: Light toggle keeps position

- **WHEN** the visitor is in dark mode in the gallery and clicks `#lights-switch-btn` into light mode
- **THEN** the same planes show the light `src` at each index and the viewpoint has not jumped to the start

#### Scenario: Missing dark image

- **WHEN** dark mode is on and `.hero-gallery-dark` has fewer images than `.hero-gallery-light`
- **THEN** planes past the dark list still show the matching light image
