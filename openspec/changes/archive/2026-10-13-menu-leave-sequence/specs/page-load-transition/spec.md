## ADDED Requirements

### Requirement: Back restores a closed drawer

When a page is restored from the back/forward cache, every drawer SHALL be closed. The page content SHALL NOT be dimmed. Page scroll SHALL be unlocked. The navbar SHALL show its closed-drawer buttons. The notification bar SHALL be shown again if it has an item.

#### Scenario: Back after a menu link

- **WHEN** the visitor leaves a page through a menu link and then presses the browser back button
- **THEN** the restored page shows no drawer and no empty overlay
- **AND** the page content is at full opacity and scrolls

#### Scenario: Back after a cart link

- **WHEN** the visitor leaves a page from the open cart and then presses the browser back button
- **THEN** the restored page shows no drawer

## MODIFIED Requirements

### Requirement: Open drawer stays through the leave

When the cart drawer is open and the visitor follows a same-origin link, the drawer SHALL stay on screen for the whole leave. When the menu drawer is open and the visitor follows a same-origin menu link, the drawer and the dimmed page content SHALL fade out before the next document is requested. During any leave, dimmed page content SHALL fade to transparent in place and SHALL NOT move down.

#### Scenario: Navigating from the open menu

- **WHEN** the menu drawer is open and the visitor clicks a menu link
- **THEN** the menu copy leaves first
- **AND** then the dimmed page content fades out, then the drawer fades out
- **AND** the next page is requested only after that fade ends

#### Scenario: Navigating from the open cart

- **WHEN** the cart drawer is open and the visitor follows a same-origin link
- **THEN** the drawer stays on screen while the dimmed page content fades out behind it

#### Scenario: Dimmed content does not drop

- **WHEN** a leave starts while the page content is dimmed by an open drawer
- **THEN** the page content fades from its dimmed opacity to transparent
- **AND** it does not move down, not even for one frame

#### Scenario: Drawer closed

- **WHEN** no drawer is open and the visitor follows a link
- **THEN** the leave runs with no drawer on screen
