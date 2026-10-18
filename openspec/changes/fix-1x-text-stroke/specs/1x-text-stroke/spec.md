## Purpose

Thins difference-blended white type on 1x and 125% displays, and thickens body type on those same displays, without touching Retina.

## ADDED Requirements

### Requirement: Low-resolution displays stroke body type

When the device pixel ratio is at most 1.5, `body` SHALL paint type with `-webkit-text-stroke: 0.25px currentColor`. When the device pixel ratio is above 1.5, this stroke SHALL NOT apply.

#### Scenario: 1x body type

- **WHEN** the display is at most 1.5dppx
- **THEN** `body` uses a `0.25px` stroke in `currentColor`

#### Scenario: Retina body type

- **WHEN** the display is above 1.5dppx
- **THEN** `body` does not take this stroke

### Requirement: Blended white chrome erases its stem edge

When the device pixel ratio is at most 1.5, `.navbar`, `.second-menu`, `.layer.is-blend`, `.product-info-col`, `.gallery-full-screen_close`, `.link-sec-brack.is-zoom`, `html.is-full-screen .product-nav-tab`, and `.custom-cursor-label` SHALL paint type with `-webkit-text-stroke: 0.35px #000`.

#### Scenario: Navbar on a 1x display

- **WHEN** the display is at most 1.5dppx and `.navbar` is blending
- **THEN** `.navbar` uses a `0.35px` `#000` stroke

#### Scenario: Fullscreen product nav on a 1x display

- **WHEN** the display is at most 1.5dppx and `html` has class `is-full-screen`
- **THEN** `.product-nav-tab` uses a `0.35px` `#000` stroke

### Requirement: An open drawer uses the content stroke

When the device pixel ratio is at most 1.5 and `.navbar` has class `is-normal`, that navbar SHALL paint type with `-webkit-text-stroke: 0.25px currentColor`, unless it sits inside `.layer.is-blend`. Inside `.layer.is-blend`, `.navbar.is-normal` SHALL keep `-webkit-text-stroke: 0.35px #000`.

#### Scenario: Drawer open on the page

- **WHEN** the display is at most 1.5dppx and `.navbar` has class `is-normal` and it is not inside `.layer.is-blend`
- **THEN** `.navbar.is-normal` uses a `0.25px` stroke in `currentColor`

#### Scenario: Drawer open over a blending fullscreen layer

- **WHEN** the display is at most 1.5dppx and `.navbar.is-normal` is inside `.layer.is-blend`
- **THEN** `.navbar.is-normal` uses a `0.35px` `#000` stroke

### Requirement: Geometric precision stays off

The sheet SHALL NOT set `text-rendering: geometricPrecision`.

#### Scenario: No geometric precision

- **WHEN** `css/global.css` is loaded
- **THEN** it does not set `text-rendering: geometricPrecision`
