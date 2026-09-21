# collection-infinite-gallery Specification

## Purpose

Renders the Collection hero as a wrapping mosaic of CMS light and dark images that pans with inertia, bounded size lag, and cursor drift.

## Requirements

### Requirement: Period is larger than the viewport

The wrapping period SHALL be larger than the visible frustum. Tile world sizes SHALL NOT grow when the period grows. One viewport SHALL show a crop of the period, not the whole unique field.

#### Scenario: Resize still crops

- **WHEN** the visitor resizes the window while the gallery is showing
- **THEN** tile sizes and relative arrangement stay the same; only how much of the period is visible changes

### Requirement: Smaller tiles trail the pan

While the viewpoint is moving, smaller tiles SHALL lag behind larger tiles. Each further size class (extra-large, large, medium, small) SHALL move a little slower than the class in front of it. All sizes SHALL share one slip vector (same direction and clock). Lag SHALL stay inside the packed gutter so tiles do not slide through neighbors. After pan and coast settle, every tile SHALL sit in the unique packed arrangement (no lasting shear). Small tiles SHALL NOT jitter from pan-velocity noise.

#### Scenario: Size lag during pan

- **WHEN** the visitor drags the gallery
- **THEN** smaller images trail larger ones in the pan direction, and each further size class moves a little slower than the one in front

#### Scenario: Shared slip stays in gutter

- **WHEN** the visitor pans at any speed
- **THEN** every size class offsets along the same slip vector, and that extra offset stays inside the gap between tiles

#### Scenario: Unique packing at rest

- **WHEN** coast has ended and the pointer is not dragging
- **THEN** tiles occupy the same unique packing as at load, with no extra overlap from lag

### Requirement: Cursor nudges the viewpoint

When a fine pointer is inside `.collection-hero-gallery`, the viewpoint SHALL ease a short distance toward the cursor. When the pointer leaves the host, or on touch, that nudge SHALL ease back to zero. This SHALL NOT replace drag/wheel pan and SHALL NOT auto-pan the mosaic at rest.

#### Scenario: Pointer inside host

- **WHEN** a mouse cursor moves inside the gallery host after coast
- **THEN** the mosaic eases slightly toward the cursor

#### Scenario: Pointer leaves host

- **WHEN** the mouse leaves the gallery host
- **THEN** the cursor nudge eases back so the viewpoint matches the settled pan position

### Requirement: Poster mosaic on a wrapping period

The image space SHALL be one finite period that repeats on a torus: a tile leaving one edge SHALL enter from the opposite edge. The period SHALL be a seeded irregular field of about twenty-four tiles, not a regular cell grid. Tiles SHALL sit at random positions.

Each tile SHALL show one image from `.hero-gallery-light` (dark list at the same DOM index). Size SHALL be one of four classes (small, medium, large, extra-large) with original aspect ratio. Classes SHALL sit in a band so extra-large is not much larger than small. Tiles SHALL NOT overlap. The gap between tiles SHALL be at least 80 CSS pixels at a 1440-wide host.

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

#### Scenario: Dark maps follow DOM index

- **WHEN** `body` has `dark-mode` and both gallery lists have images at the same index
- **THEN** each tile shows the dark image at that index, not a filename-matched pair

### Requirement: Pannable space with inertia

Inside `.collection-hero-gallery`, drag SHALL pan the image space on X and Y. Pointer deltas SHALL add to a target velocity, scaled by a short grab ease-in. Each frame SHALL lerp current velocity toward that target, then move the viewpoint by current velocity, then decay the target. Wheel SHALL pan on X and Y the same way. Pinch SHALL NOT move the viewpoint in depth. After pointer release, pan motion SHALL coast until the decayed target and velocity settle. After coast ends, the space SHALL NOT auto-pan. Keyboard WASD and QE SHALL NOT pan this space.

Image count SHALL be the number of `.hero-gallery-img` in `.hero-gallery-light` (DOM order). The site SHALL NOT require a fixed N.

When `prefers-reduced-motion: reduce` is set, the site SHALL apply pointer deltas with no grab ramp, no coast, no size lag, and no cursor nudge.

#### Scenario: Drag pans

- **WHEN** the visitor drags inside `.collection-hero-gallery`
- **THEN** the images ease in at grab, follow through lerp inertia, and continue with decay coast after release

#### Scenario: Wheel pans

- **WHEN** the visitor wheels over `.collection-hero-gallery`
- **THEN** the image space pans on X and Y and does not move in depth

#### Scenario: Rest has no auto-pan

- **WHEN** the gallery is showing, the visitor is not dragging, and coast has ended
- **THEN** the pan position stays put (cursor nudge may still apply when a mouse is inside the host)

#### Scenario: Keyboard ignored

- **WHEN** the visitor presses W, A, S, D, Q, or E while the gallery is showing
- **THEN** the image space does not pan from those keys

#### Scenario: Six vs twenty images

- **WHEN** `.hero-gallery-light` contains six images, and separately when it contains twenty
- **THEN** the canvas uses that many unique images and still fills the period by repeating them without placing the same image on nearby tiles when N is at least three

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the gallery canvas is showing
- **THEN** drag tracks with no ramp, no coast, no size lag, no cursor nudge, and no motion at rest
