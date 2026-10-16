## MODIFIED Requirements

### Requirement: Each hero image fades in when decoded

On `/`, each placed plane SHALL start invisible and at `0.98` of its fitted size. Decoded images SHALL be uploaded to the GPU one per frame, current mode first. A plane SHALL stay invisible until that upload has happened. After the upload, that plane SHALL wait its own random time of at most `2400ms`, drawn independently of every other plane, then fade to opaque and scale to its fitted size. The fade and the scale SHALL take `300ms` of frame time, SHALL advance by at most `16ms` on a frame, SHALL use ease-out, and SHALL run together. A frame longer than `16ms` SHALL NOT skip the fade ahead. A period copy of an image SHALL NOT share its wait or its fade with another copy of that image, including another tile that shows the same image. An image that has not been uploaded SHALL stay invisible and SHALL NOT block planes whose image has been uploaded. `.collection-hero-logo` SHALL fade in when the page becomes ready, over `0.3s` ease-out, and SHALL NOT move. That fade SHALL NOT wait for hero images to decode, and a hero image fading in SHALL NOT start another fade on the logo. The canvas SHALL be visible while tiles are still arriving.

#### Scenario: One plane arrives

- **WHEN** one plane's image has been uploaded and others have not
- **THEN** that plane fades in after its own wait and scales from `0.98` to its fitted size
- **AND** the planes that have not been uploaded stay invisible

#### Scenario: Copies do not share a wait

- **WHEN** two planes show the same hero image and both images have been uploaded
- **THEN** each plane waits its own random time of at most `2400ms`
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

## ADDED Requirements

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
