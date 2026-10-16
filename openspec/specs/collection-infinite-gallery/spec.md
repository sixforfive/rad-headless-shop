# collection-infinite-gallery Specification

## Purpose

Renders the Collection `/` hero as a wrapping mosaic of CMS light and dark images that pans with inertia, size-class parallax, and cursor drift.

## Requirements

### Requirement: Canvas boots only on a gallery host with images

When `/` contains `.collection-hero-gallery` and `.hero-gallery-light` has at least one `.hero-gallery-img` whose `src` is a non-placeholder image, the site SHALL draw the mosaic inside `.collection-hero-gallery`.

When `.collection-hero-gallery` is absent, or the light list has no such image, the site SHALL NOT draw that canvas.

`.hero-gallery-light` and `.hero-gallery-dark` SHALL keep class `is-none`. `.collection-hero-logo` SHALL remain visible above the canvas.

The canvas SHALL be transparent. Gaps SHALL show `html`/`body` `background-color` (`--_theme---background--primary`).

#### Scenario: Gallery format with images

- **WHEN** Collection `/` loads and `.collection-hero-gallery` contains `.hero-gallery-img` nodes with real `src`
- **THEN** the mosaic is drawn inside `.collection-hero-gallery`, the light and dark lists still have `is-none`, and `.collection-hero-logo` is visible

#### Scenario: Photo or video format

- **WHEN** Collection `/` loads without `.collection-hero-gallery`
- **THEN** no infinite-gallery canvas is drawn

#### Scenario: Empty gallery lists

- **WHEN** `.collection-hero-gallery` is present but has no `.hero-gallery-img` with a real `src`
- **THEN** no infinite-gallery canvas is drawn

#### Scenario: Light mode gaps

- **WHEN** the page is in light mode and the gallery canvas is showing
- **THEN** empty space in the hero matches the light theme background

#### Scenario: Dark mode gaps

- **WHEN** the page is in dark mode and the gallery canvas is showing
- **THEN** empty space in the hero matches the dark theme background

### Requirement: Poster mosaic on a wrapping period

The image space SHALL be one finite period 320×180 that repeats on a torus: a tile leaving one edge SHALL enter from the opposite edge. The visible frustum height SHALL be 90, so one viewport shows a crop of the period. Tile world sizes SHALL be fractions of `SIZE_BASE` 180, not of the period; resize SHALL crop, not reflow or grow tiles.

The period SHALL be a seeded dart-throw of up to 40 tiles, not a regular cell grid. Size SHALL be one of four classes (frac 0.11, 0.16, 0.21, 0.26; weights 2, 4, 3, 1) with original aspect ratio. Tiles SHALL NOT overlap. The gap SHALL be `SIZE_BASE * (40 / 1440)`.

Each tile SHALL show one image from `.hero-gallery-light` (dark list at the same DOM index). Tiles close to each other, including across the period wrap, SHALL NOT show the same image when the light list has at least three images. Image count SHALL be the light-list length in DOM order; the site SHALL NOT require a fixed N. The same seed SHALL produce the same period on every load.

`.collection-hero-logo` SHALL stay fixed in the viewport while the mosaic pans. Images MAY pass under the logo.

#### Scenario: Wrap from the right

- **WHEN** the visitor pans the gallery until an image leaves the right edge
- **THEN** that image enters from the left at the matching vertical position

#### Scenario: No overlap

- **WHEN** the gallery canvas is showing
- **THEN** no two image tiles share screen pixels with each other at the packed layout

#### Scenario: Resize still crops

- **WHEN** the visitor resizes the window while the gallery is showing
- **THEN** tile sizes and relative arrangement stay the same; only how much of the period is visible changes

#### Scenario: Dense irregular field

- **WHEN** the gallery canvas is showing at a 1440-wide host
- **THEN** images of mixed sizes fill the hero in an irregular arrangement, not a regular grid, and the same cluster does not fill the whole viewport

#### Scenario: Neighbor uniqueness

- **WHEN** the light gallery has at least three images and the mosaic is showing
- **THEN** no tile shows the same image as a nearby tile, including across the period edge

#### Scenario: Six vs twenty images

- **WHEN** `.hero-gallery-light` contains six images, and separately when it contains twenty
- **THEN** the canvas uses that many unique images and still fills the period by repeating them without placing the same image on nearby tiles when N is at least three

#### Scenario: Logo does not pan

- **WHEN** the visitor pans the gallery
- **THEN** `.collection-hero-logo` stays in the same viewport position

### Requirement: Pan, size lag, and cursor drift

Inside `.collection-hero-gallery`, drag SHALL pan on X and Y. Pointer deltas SHALL add to a target velocity, scaled by a 280ms grab ease-in. Each frame SHALL lerp current velocity toward that target (0.16), move the pan by current velocity, then decay the target (0.94). Wheel SHALL pan on X and Y the same way. Pinch SHALL NOT move the viewpoint in depth. After pointer release, pan SHALL coast until the decayed target and velocity settle. After coast ends, pan SHALL NOT auto-advance. Keyboard WASD and QE SHALL NOT pan this space.

Each size class SHALL scale pan by its factor p (small 0.55, medium 0.7, large 0.85, extra-large 1). The camera SHALL stay at the period center plus cursor drift. Remaining pan MAY leave lasting shear between classes.

When a fine pointer is inside `.collection-hero-gallery` on a non-touch device, the camera SHALL ease toward the cursor (amount 8, lerp 0.12). When the pointer leaves the host, or on touch, that nudge SHALL ease back to zero. This SHALL NOT replace drag/wheel pan.

When `prefers-reduced-motion: reduce` is set, the site SHALL apply pointer deltas with no grab ramp, no coast, no size lag, and no cursor nudge.

#### Scenario: Drag pans

- **WHEN** the visitor drags inside `.collection-hero-gallery`
- **THEN** the images ease in at grab, follow through lerp inertia, and continue with decay coast after release

#### Scenario: Wheel pans

- **WHEN** the visitor wheels over `.collection-hero-gallery`
- **THEN** the image space pans on X and Y and does not move in depth

#### Scenario: Size lag during pan

- **WHEN** the visitor drags the gallery
- **THEN** smaller images trail larger ones in the pan direction, and each further size class moves a little slower than the one in front

#### Scenario: Rest has no auto-pan

- **WHEN** the gallery is showing, the visitor is not dragging, and coast has ended
- **THEN** the pan position stays put (cursor nudge may still apply when a mouse is inside the host)

#### Scenario: Pointer inside host

- **WHEN** a mouse cursor moves inside the gallery host after coast
- **THEN** the mosaic eases slightly toward the cursor

#### Scenario: Pointer leaves host

- **WHEN** the mouse leaves the gallery host
- **THEN** the cursor nudge eases back so the camera matches the period center

#### Scenario: Keyboard ignored

- **WHEN** the visitor presses W, A, S, D, Q, or E while the gallery is showing
- **THEN** the image space does not pan from those keys

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and the gallery canvas is showing
- **THEN** drag tracks with no ramp, no coast, no size lag, no cursor nudge, and no motion at rest

### Requirement: Lights swap textures without resetting the view

Light-mode planes SHALL use the display URL of each `.hero-gallery-light .hero-gallery-img` in DOM order. Dark-mode planes SHALL use the display URL of each `.hero-gallery-dark .hero-gallery-img` at the same index.

The display URL of a hero image SHALL be the `srcset` candidate whose width descriptor is nearest 800 when that image has a `srcset`. When the image has no `srcset`, the display URL SHALL be that image's `src`.

Toggling `#lights-switch-btn` SHALL crossfade those textures over 0.45s ease-out and SHALL NOT reset pan or plane layout. When `prefers-reduced-motion: reduce` is set, the swap SHALL be immediate.

When dark has no image at an index, that plane SHALL keep the light image.

#### Scenario: Dark toggle keeps position

- **WHEN** the visitor has panned the gallery and then clicks `#lights-switch-btn` into dark mode
- **THEN** the same planes show the dark display URL at each index and the viewpoint has not jumped to the start

#### Scenario: Light toggle keeps position

- **WHEN** the visitor is in dark mode in the gallery and clicks `#lights-switch-btn` into light mode
- **THEN** the same planes show the light display URL at each index and the viewpoint has not jumped to the start

#### Scenario: Srcset picks the nearest 800

- **WHEN** a hero image has a `srcset` with width candidates
- **THEN** its plane requests the candidate whose width descriptor is nearest 800

#### Scenario: No srcset keeps the src

- **WHEN** a hero image has no `srcset`
- **THEN** its plane requests that image's `src`

#### Scenario: Texture crossfade

- **WHEN** the visitor toggles lights and the incoming texture is already loaded
- **THEN** each plane blends from the outgoing texture to the incoming texture over 0.45s ease-out

#### Scenario: Missing dark image

- **WHEN** dark mode is on and `.hero-gallery-dark` has fewer images than `.hero-gallery-light`
- **THEN** planes past the dark list still show the matching light image

#### Scenario: Reduced motion swaps immediately

- **WHEN** the visitor prefers reduced motion and clicks `#lights-switch-btn`
- **THEN** plane textures change in one frame and the viewpoint does not jump

### Requirement: Texture swap follows lights only

The gallery SHALL start a texture swap only when `body` gains or loses class `dark-mode`. Other class changes on `html` or `body`, including the dot cursor class that is rewritten while a pointer rests on a pointer-cursor element, SHALL NOT start, restart, or stall a swap.

#### Scenario: Toggle with the pointer on the lights switch

- **WHEN** the visitor on a fine pointer clicks `#lights-switch-btn` and keeps the pointer on it
- **THEN** every plane crossfades to the other mode's texture over 0.45s ease-out and finishes

#### Scenario: Toggle with the pointer on a plane

- **WHEN** the visitor toggles lights by keyboard while the pointer is over an image plane
- **THEN** every plane crossfades to the other mode's texture and finishes

#### Scenario: Unrelated class change

- **WHEN** a class other than `dark-mode` changes on `html` or `body` and lights did not change
- **THEN** no swap starts and a swap already in progress keeps its progress

### Requirement: Still click on a plane goes to shop

A pointer press and release on an image plane with movement below 8px SHALL navigate to `/shop`. A drag past that threshold SHALL pan and SHALL NOT navigate. A still click on empty space SHALL NOT navigate.

On a fine pointer, while the pointer is over an image plane, the canvas SHALL carry `custom-cursor="[SHOP COLLECTION]"`, the cursor label SHALL show that text, and the visitor SHALL see the 12×12 difference dot with the native pointer hidden. While the pointer is over empty space, that attribute SHALL be empty, the cursor label SHALL NOT be shown, and the canvas SHALL use the grab cursor. Coarse pointers SHALL NOT require this attribute.

#### Scenario: Click a plane

- **WHEN** the visitor presses and releases on a gallery image without dragging
- **THEN** the browser goes to `/shop`

#### Scenario: Drag a plane

- **WHEN** the visitor presses on a gallery image and moves past the drag threshold
- **THEN** the space pans and the page does not navigate

#### Scenario: Click empty space

- **WHEN** the visitor presses and releases on a gap between images without dragging
- **THEN** the page does not navigate

#### Scenario: Hover a plane

- **WHEN** a fine pointer is over a gallery image plane
- **THEN** the canvas has `custom-cursor="[SHOP COLLECTION]"`, the cursor label shows `[SHOP COLLECTION]`, the 12×12 difference dot is centered on the hotspot, and the native cursor is hidden

#### Scenario: Hover a gap

- **WHEN** a fine pointer is over empty space in the gallery canvas
- **THEN** the canvas does not have a non-empty `custom-cursor`, the cursor label is not shown, the native cursor is grab, and the dot is hidden

### Requirement: Each hero image fades in when decoded

On `/`, each placed plane SHALL start invisible and at `0.98` of its fitted size. Decoded images SHALL be uploaded to the GPU one per frame, current mode first. A plane SHALL stay invisible until that upload has happened. After the upload, that plane SHALL wait its own random time of at most `1200ms`, drawn independently of every other plane, then fade to opaque and scale to its fitted size. The fade and the scale SHALL take `300ms` of frame time, SHALL advance by at most `16ms` on a frame, SHALL use ease-out, and SHALL run together. A frame longer than `16ms` SHALL NOT skip the fade ahead. A period copy of an image SHALL NOT share its wait or its fade with another copy of that image, including another tile that shows the same image. An image that has not been uploaded SHALL stay invisible and SHALL NOT block planes whose image has been uploaded. `.collection-hero-logo` SHALL fade in when the page becomes ready, over `0.3s` ease-out, and SHALL NOT move. That fade SHALL NOT wait for hero images to decode, and a hero image fading in SHALL NOT start another fade on the logo. The canvas SHALL be visible while tiles are still arriving.

#### Scenario: One plane arrives

- **WHEN** one plane's image has been uploaded and others have not
- **THEN** that plane fades in after its own wait and scales from `0.98` to its fitted size
- **AND** the planes that have not been uploaded stay invisible

#### Scenario: Copies do not share a wait

- **WHEN** two planes show the same hero image and both images have been uploaded
- **THEN** each plane waits its own random time of at most `1200ms`
- **AND** one plane's fade does not set the other plane's opacity

#### Scenario: A stuck file does not block the rest

- **WHEN** one hero file never decodes
- **THEN** the planes whose images were uploaded still fade in and scale to their fitted size

#### Scenario: A long frame holds the fade

- **WHEN** a frame takes longer than `16ms` during a hero fade
- **THEN** that plane's opacity advances by `16ms` of the `300ms` fade

#### Scenario: Logo stays put

- **WHEN** hero images fade in
- **THEN** `.collection-hero-logo` does not move
- **AND** those images do not start another fade on the logo

#### Scenario: Logo fade does not wait for images

- **WHEN** `/` becomes ready before every hero image has decoded
- **THEN** `.collection-hero-logo` fades in
- **AND** images that have not decoded stay invisible

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and a hero image has been uploaded
- **THEN** each plane of that image appears immediately at its fitted size, with no wait and no fade

### Requirement: Mosaic holds still while a drawer is open

While `.drawer-wrapper` is shown for the menu or the cart, including the time it stays shown for the close blur, the collection mosaic SHALL hold the frame it had when the overlay appeared. Pan, coast, size-class lag, cursor drift, and hero-image reveal progress SHALL NOT advance during that time. Pointer and wheel input during that time SHALL NOT change the pan.

When `.drawer-wrapper` is hidden, the pan position SHALL be the held position. Coast that was in progress when the overlay appeared SHALL NOT resume. Reveal progress SHALL continue from the values it held. Cursor drift MAY ease again after the overlay is hidden.

#### Scenario: Menu open holds the mosaic

- **WHEN** the visitor opens the menu on `/` while the gallery canvas is showing
- **THEN** thumbs do not pan, drift, or change opacity or scale until the overlay is hidden

#### Scenario: Cart open holds the mosaic

- **WHEN** the visitor opens the cart on `/` while the gallery canvas is showing
- **THEN** thumbs do not pan, drift, or change opacity or scale until the overlay is hidden

#### Scenario: Close blur still holds

- **WHEN** the visitor closes an open drawer and the overlay is still blurring out
- **THEN** the mosaic stays on the held frame until `.drawer-wrapper` is hidden

#### Scenario: Close keeps the held pan

- **WHEN** the mosaic was coasting or drifting and the overlay then hides
- **THEN** the pan is the position it held while the overlay was shown
- **AND** that coast does not continue
- **AND** a plane that was mid-fade continues from the opacity it held

#### Scenario: Input under the overlay does not pan

- **WHEN** the overlay is shown and the visitor wheels or drags where the gallery sits
- **THEN** the pan does not change

#### Scenario: Reduced motion stays still

- **WHEN** `prefers-reduced-motion: reduce` is set and a drawer overlay is shown on `/`
- **THEN** the mosaic does not move while the overlay is shown
