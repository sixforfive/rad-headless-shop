## ADDED Requirements

### Requirement: Period is larger than the viewport

The wrapping period SHALL be larger than the visible frustum. Tile world sizes SHALL NOT grow when the period grows. One viewport SHALL show a crop of the period, not the whole unique field.

#### Scenario: Resize still crops

- **WHEN** the visitor resizes the window while the gallery is showing
- **THEN** tile sizes and relative arrangement stay the same; only how much of the period is visible changes

## MODIFIED Requirements

### Requirement: Poster mosaic on a wrapping period

The image space SHALL be one finite period that repeats on a torus: a tile leaving one edge SHALL enter from the opposite edge. The period SHALL be a seeded irregular field of about twenty-eight tiles, not a regular cell grid. Tiles SHALL sit at random positions.

Each tile SHALL show one image from `.hero-gallery-light` (dark list at the same index). Size SHALL be one of four classes (small, medium, large, extra-large) with original aspect ratio. Small and extra-large SHALL differ enough to read as depth. Extra-large SHALL NOT exceed the current visual scale. Tiles SHALL NOT overlap. The gap between tiles SHALL be at least 24 CSS pixels at a 1440-wide host.

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
- **THEN** images of mixed sizes fill the hero in an irregular arrangement, not a regular grid, and the same cluster does not fill the whole viewport

#### Scenario: Neighbor uniqueness

- **WHEN** the light gallery has at least three images and the mosaic is showing
- **THEN** no tile shows the same image as a nearby tile, including across the period edge

#### Scenario: Logo does not pan

- **WHEN** the visitor pans the gallery
- **THEN** `.collection-hero-logo` stays in the same viewport position

### Requirement: Pannable space with inertia

Inside `.collection-hero-gallery`, drag SHALL pan the image space on X and Y. At grab, pan speed SHALL ease in from zero over a short ramp, then track the pointer 1:1 for the rest of the drag. Wheel SHALL pan on X and Y. Pinch SHALL NOT move the viewpoint in depth. After pointer release, motion SHALL coast with exponential friction. After coast ends, the space SHALL stay still. Keyboard WASD and QE SHALL NOT pan this space.

Image count SHALL be the number of `.hero-gallery-img` in `.hero-gallery-light` (DOM order). The site SHALL NOT require a fixed N.

When `prefers-reduced-motion: reduce` is set, the site SHALL track the pointer 1:1 with no grab ramp and no coast.

#### Scenario: Drag pans

- **WHEN** the visitor drags inside `.collection-hero-gallery`
- **THEN** the images ease in at grab, then follow the pointer 1:1, and continue with friction coast after release

#### Scenario: Wheel pans

- **WHEN** the visitor wheels over `.collection-hero-gallery`
- **THEN** the image space pans on X and Y and does not move in depth

#### Scenario: Rest stays still

- **WHEN** the gallery is showing and the visitor is not dragging
- **THEN** after coast ends the image space does not move

#### Scenario: Keyboard ignored

- **WHEN** the visitor presses W, A, S, D, Q, or E while the gallery is showing
- **THEN** the image space does not pan from those keys

#### Scenario: Six vs twenty images

- **WHEN** `.hero-gallery-light` contains six images, and separately when it contains twenty
- **THEN** the canvas uses that many unique images and still fills the period by repeating them without placing the same image on nearby tiles when N is at least three

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the gallery canvas is showing
- **THEN** drag tracks 1:1 with no ramp, no coast, and no motion at rest
