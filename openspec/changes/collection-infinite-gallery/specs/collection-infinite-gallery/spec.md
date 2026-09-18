## Purpose

Renders the Collection gallery-format hero as an infinite pannable image space from the CMS light and dark galleries, with shop activation on a still click.

## ADDED Requirements

### Requirement: Canvas boots only on a gallery host with images

When `/` contains `.collection-hero-gallery` and that host contains at least one `.hero-gallery-img` whose `src` is a non-placeholder image, the site SHALL draw the infinite image space inside `.collection-hero-gallery`.

When `.collection-hero-gallery` is absent, or it contains no such image, the site SHALL NOT draw that canvas.

`.hero-gallery-light` and `.hero-gallery-dark` SHALL keep class `is-none`. `.collection-hero-logo` SHALL remain visible above the canvas.

#### Scenario: Gallery format with images

- **WHEN** Collection `/` loads and `.collection-hero-gallery` contains `.hero-gallery-img` nodes with real `src`
- **THEN** the infinite image space is drawn inside `.collection-hero-gallery`, the light and dark lists still have `is-none`, and `.collection-hero-logo` is visible

#### Scenario: Photo or video format

- **WHEN** Collection `/` loads without `.collection-hero-gallery`
- **THEN** no infinite-gallery canvas is drawn

#### Scenario: Empty gallery lists

- **WHEN** `.collection-hero-gallery` is present but has no `.hero-gallery-img` with a real `src`
- **THEN** no infinite-gallery canvas is drawn

### Requirement: Pannable space with inertia

Inside `.collection-hero-gallery`, drag SHALL pan the image space on X and Y. Wheel (desktop) and pinch (touch) SHALL move the viewpoint in depth. Motion SHALL keep inertia after input ends. Keyboard WASD and QE SHALL NOT pan or zoom this space.

Plane size SHALL be the Codrops Infinite Canvas size multiplied by 1.166. Image count SHALL be the number of `.hero-gallery-img` in `.hero-gallery-light` (DOM order). The same count SHALL wrap; the site SHALL NOT require a fixed N.

When `prefers-reduced-motion: reduce` is set, the site SHALL show the space without inertia pan or zoom from pointer input.

#### Scenario: Drag pans

- **WHEN** the visitor drags inside `.collection-hero-gallery`
- **THEN** the images move with the drag and continue with inertia after release

#### Scenario: Wheel zooms

- **WHEN** the visitor wheels over `.collection-hero-gallery` on a fine pointer
- **THEN** the viewpoint moves in depth with inertia

#### Scenario: Keyboard ignored

- **WHEN** the visitor presses W, A, S, D, Q, or E while the gallery is showing
- **THEN** the image space does not pan or zoom from those keys

#### Scenario: Six vs twenty images

- **WHEN** `.hero-gallery-light` contains six images, and separately when it contains twenty
- **THEN** the canvas uses that many unique images and still fills the space by repeating them

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the gallery canvas is showing
- **THEN** drag and wheel do not apply inertia

### Requirement: Theme background shows through

The canvas SHALL be transparent. Gaps between images SHALL show `html`/`body` `background-color` (`--_theme---background--primary`), including while lights switch.

#### Scenario: Light mode gaps

- **WHEN** the page is in light mode and the gallery canvas is showing
- **THEN** empty space in the hero matches the light theme background

#### Scenario: Dark mode gaps

- **WHEN** the page is in dark mode and the gallery canvas is showing
- **THEN** empty space in the hero matches the dark theme background

### Requirement: Lights swap textures without resetting the view

Light-mode planes SHALL use `.hero-gallery-light .hero-gallery-img` `src` values in DOM order. Dark-mode planes SHALL use `.hero-gallery-dark .hero-gallery-img` `src` values at the same index.

Toggling `#lights-switch-btn` SHALL replace those textures and SHALL NOT reset pan, zoom, or plane positions.

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

### Requirement: Still click on a plane goes to shop

A pointer press and release on an image plane with movement below the drag threshold SHALL navigate to `/shop`. A drag past that threshold SHALL pan and SHALL NOT navigate. A still click on empty space SHALL NOT navigate.

#### Scenario: Click a plane

- **WHEN** the visitor presses and releases on a gallery image without dragging
- **THEN** the browser goes to `/shop`

#### Scenario: Drag a plane

- **WHEN** the visitor presses on a gallery image and moves past the drag threshold
- **THEN** the space pans and the page does not navigate

#### Scenario: Click empty space

- **WHEN** the visitor presses and releases on a gap between images without dragging
- **THEN** the page does not navigate

### Requirement: Shop cursor label over a plane

On a fine pointer, while the pointer is over an image plane, the canvas SHALL carry `custom-cursor="[SHOP COLLECTION]"`. While the pointer is over empty space in the canvas, that attribute SHALL be empty or absent.

Coarse pointers SHALL NOT require this attribute.

#### Scenario: Hover a plane

- **WHEN** a fine pointer is over a gallery image plane
- **THEN** the canvas has `custom-cursor="[SHOP COLLECTION]"` and the cursor label shows `[SHOP COLLECTION]`

#### Scenario: Hover a gap

- **WHEN** a fine pointer is over empty space in the gallery canvas
- **THEN** the canvas does not have a non-empty `custom-cursor` and the cursor label is not shown
