# drawer-backdrop-blur Specification

## Purpose

Ramps the drawer overlay's backdrop blur so the page behind the menu and the cart blurs in and out, instead of dissolving under a full blur.

## Requirements

### Requirement: Blur radius ramps with the drawer

`.drawer-wrapper` SHALL rest at a backdrop blur of `0px`. While `.drawer-wrapper.is-visible` is set, the backdrop blur SHALL be `48px`. The radius SHALL ease from `0px` to `48px` over `0.9s` on open and from `48px` to `0px` over `0.9s` on close. The overlay opacity fade SHALL stay `0.45s`. The same ramp SHALL run for `.menu-drawer` and `.cart-drawer`.

#### Scenario: Menu open

- **WHEN** the visitor opens the menu
- **THEN** the page behind `.drawer-wrapper` blurs from `0px` to `48px` over `0.9s`
- **AND** the overlay opacity still fades in over `0.45s`

#### Scenario: Cart open and close

- **WHEN** the visitor opens the cart and then closes it
- **THEN** the same `0px` to `48px` ramp runs on open
- **AND** the radius returns to `0px` over `0.9s` on close

### Requirement: Close hides after the blur finishes

On close, `.drawer-wrapper` SHALL stay in the document until the blur transition ends. The drawer SHALL be hidden after that `0.9s` blur-out, not when the `0.45s` opacity fade ends.

#### Scenario: Close button

- **WHEN** the visitor closes an open drawer
- **THEN** the page is still blurring out when the overlay opacity has finished
- **AND** the drawer is hidden once the blur radius has returned to `0px`

### Requirement: Reduced motion snaps the blur

When `prefers-reduced-motion: reduce` is set, the blur radius SHALL NOT ramp. An open drawer SHALL show `48px` with no transition. Closing SHALL hide the drawer with no blur-out.

#### Scenario: Reduced motion open

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor opens the menu
- **THEN** the backdrop blur is `48px` on the first frame
- **AND** the radius does not ease

#### Scenario: Reduced motion close

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor closes the drawer
- **THEN** the drawer hides with no blur ramp
