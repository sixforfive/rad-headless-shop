## MODIFIED Requirements

### Requirement: Blur radius ramps with the drawer

`.drawer-wrapper::before` SHALL use a backdrop blur of `32px` while the drawer is open and while it is fading. The radius SHALL NOT ease. The veil opacity SHALL move from `0` to `1` over `0.45s` with ease `ease-out` on open and from `1` to `0` over `0.45s` with ease `ease-out` on close. `.drawer-wrapper` opacity SHALL snap and SHALL NOT ease. The same veil SHALL run for `.menu-drawer` and `.cart-drawer`.

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the page behind `.drawer-wrapper` is covered by a `32px` blur whose opacity fades from `0` to `1` over `0.45s` with ease `ease-out`
- **AND** the blur radius does not change

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the same veil fades in on open
- **AND** the veil opacity returns to `0` over `0.45s` with ease `ease-out` on close

### Requirement: Close hides after the blur finishes

On close, `.drawer-wrapper` SHALL stay in the document until the veil opacity transition ends. The veil SHALL take `0.45s`. The drawer SHALL be hidden when that fade ends.

#### Scenario: Close button

- **WHEN** the visitor closes an open drawer
- **THEN** the veil fades out over `0.45s`
- **AND** the drawer is hidden once the veil opacity has returned to `0`
