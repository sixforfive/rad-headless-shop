## MODIFIED Requirements

### Requirement: Blur radius ramps with the drawer

`.drawer-wrapper` SHALL rest at a backdrop blur of `0px`. While `.drawer-wrapper.is-visible` is set, the backdrop blur SHALL be `32px`. The radius SHALL ease from `0px` to `32px` over `0.45s` with ease `ease-out` on open and from `32px` to `0px` over `0.45s` with ease `ease-out` on close. The overlay opacity fade SHALL stay `0.45s` with ease `ease-out`. The same ramp SHALL run for `.menu-drawer` and `.cart-drawer`.

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the page behind `.drawer-wrapper` blurs from `0px` to `32px` over `0.45s` with ease `ease-out`
- **AND** the overlay opacity fades in over `0.45s` with ease `ease-out`

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the same `0px` to `32px` ramp runs on open
- **AND** the radius returns to `0px` over `0.45s` with ease `ease-out` on close

### Requirement: Close hides after the blur finishes

On close, `.drawer-wrapper` SHALL stay in the document until the blur transition ends. The blur and the overlay opacity SHALL both take `0.45s`. The drawer SHALL be hidden when that blur ends.

#### Scenario: Close button

- **WHEN** the visitor closes an open drawer
- **THEN** the blur and the overlay opacity finish together
- **AND** the drawer is hidden once the blur radius has returned to `0px`
