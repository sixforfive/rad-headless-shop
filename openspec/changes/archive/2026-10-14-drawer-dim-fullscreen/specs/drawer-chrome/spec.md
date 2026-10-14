## ADDED Requirements

### Requirement: Page dim while a drawer is open

While either drawer is open, `.main-wrapper` SHALL have class `is-dimmed`. When `.gallery-full-screen` is in the document, it SHALL also have class `is-dimmed`. When both drawers are closed, neither node SHALL have class `is-dimmed`.

#### Scenario: Drawer opens with gallery closed

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` has class `is-none`
- **THEN** `.main-wrapper` and `.gallery-full-screen` have class `is-dimmed`

#### Scenario: Drawer opens with gallery open

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` does not have class `is-none`
- **THEN** `.main-wrapper` and `.gallery-full-screen` have class `is-dimmed`

#### Scenario: Drawer closes

- **WHEN** the visitor closes the drawer
- **THEN** `.main-wrapper` does not have class `is-dimmed`
- **AND** `.gallery-full-screen` does not have class `is-dimmed`

#### Scenario: Drawer opens on a page without fullscreen gallery

- **WHEN** the visitor opens the menu or cart drawer and `.gallery-full-screen` is not in the document
- **THEN** `.main-wrapper` has class `is-dimmed`
