# blend-chrome Specification

## Purpose

Keeps difference-blended chrome type on grayscale antialias so navbar, second-menu, footer, and the blend layer match in weight.

## Requirements

### Requirement: Chrome type uses grayscale antialias

`.navbar`, `.second-menu`, `.second-menu .text-meta`, `.footer`, `.footer-link`, and `.layer.is-blend` SHALL paint type with grayscale antialias, not subpixel.

#### Scenario: Navbar matches second-menu

- **WHEN** `.navbar` and `.second-menu` are both on the page
- **THEN** type in both uses grayscale antialias

#### Scenario: Footer matches navbar

- **WHEN** `.footer` is on the page
- **THEN** `.footer-link` uses the same grayscale antialias as `.navbar`

#### Scenario: Scroll counter matches navbar

- **WHEN** `.second-menu .text-meta` is on the page
- **THEN** it uses the same grayscale antialias as `.navbar`

### Requirement: Difference blend stays on navbar, second-menu, and the blend layer

`.navbar`, `.second-menu`, and `.layer.is-blend` SHALL use `mix-blend-mode: difference`. `.footer` SHALL NOT set `mix-blend-mode`.

#### Scenario: Second-menu inverts

- **WHEN** `.second-menu` is on the page
- **THEN** it uses difference blend

#### Scenario: Footer does not set blend

- **WHEN** `.footer` is on the page
- **THEN** it does not set its own mix-blend-mode
