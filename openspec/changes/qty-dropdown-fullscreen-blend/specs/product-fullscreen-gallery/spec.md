## MODIFIED Requirements

### Requirement: Desktop open blends the layer

When `.layer` has class `is-blend`, `.layer` SHALL use `mix-blend-mode: difference`. No element inside `.layer` SHALL set its own `mix-blend-mode`.

While the gallery is open, `.qty-dropdown` inside `.layer-cta` SHALL use `mix-blend-mode: difference`. `#add-to-cart` SHALL keep `mix-blend-mode: normal`. When the gallery is closed, `.qty-dropdown` inside `.layer-cta` SHALL NOT use `difference`.

#### Scenario: Layer blends

- **WHEN** the gallery is open on a viewport wider than 767px
- **THEN** `.layer` uses `difference` and `.product-info-col`, `.price-tag`, `.product-details-wrapper`, and `.footer` do not set their own blend mode

#### Scenario: CTA inverts with the layer

- **WHEN** the gallery is open on a viewport wider than 767px
- **THEN** `.cta-wrapper` composites inside the layer's blend group and inverts with it

#### Scenario: Desktop qty dropdown blends

- **WHEN** the gallery is open on a viewport wider than 991px
- **THEN** `.layer-cta .qty-dropdown` uses `difference` and `#add-to-cart` keeps `mix-blend-mode: normal`

#### Scenario: Landscape qty dropdown keeps one blend group

- **WHEN** the gallery is open and `.qty-dropdown` is inside `.layer`
- **THEN** that `.qty-dropdown` does not set its own `mix-blend-mode`

#### Scenario: Close restores the dropdown

- **WHEN** the gallery closes
- **THEN** `.layer-cta .qty-dropdown` does not use `difference`

### Requirement: Open gallery forces white body text

When the gallery is open at any viewport, `body` SHALL have class `is-full-screen`. Descendants of `.layer`, plus `.layer-cta .qty-dropdown` and its descendants, SHALL have `color` `#fff` and `border-color` `#fff`. `body` and other nodes outside `.layer` SHALL keep theme `color` and `border-color`. When the gallery is closed, `body` SHALL NOT have `is-full-screen`, so layer text and borders SHALL return to the theme tokens.

#### Scenario: Open sets white body text

- **WHEN** the gallery opens
- **THEN** `body` has `is-full-screen`
- **AND** descendants of `.layer` have `color` `#fff`

#### Scenario: Open sets white borders

- **WHEN** the gallery opens
- **THEN** descendants of `.layer` have `border-color` `#fff`

#### Scenario: Open whitens the desktop qty dropdown

- **WHEN** the gallery opens on a viewport wider than 991px
- **THEN** `.layer-cta .qty-dropdown` and its descendants have `color` `#fff` and `border-color` `#fff`

#### Scenario: Chrome outside the layer keeps theme tokens

- **WHEN** the gallery opens
- **THEN** nodes outside `.layer` other than `.layer-cta .qty-dropdown` and its descendants keep their theme `color` and `border-color`

#### Scenario: Close restores theme text

- **WHEN** the gallery closes
- **THEN** `body` does not have `is-full-screen`
