## ADDED Requirements

### Requirement: Continue the loop across a document load

When `.notification-item` is showing, a later document in the same tab SHALL paint the message at the position the loop would have reached had it kept running, including time spent on the leaving page. The message SHALL NOT restart at the start of the loop.

A new tab, a tab that was closed, and a load with no saved playhead SHALL start the message at the beginning of the loop.

A page with no `.notification-item` SHALL NOT change that behavior. Hover speed SHALL stay as it is: the next page continues from the position the message had reached, including while the pointer was over `.notification-holder`.

Returning to a document the browser kept in memory SHALL continue from the position it had when the visitor left, and SHALL NOT apply the saved playhead a second time.

#### Scenario: Same-tab page change

- **WHEN** `.notification-item` is visible and the visitor opens another page in the same tab
- **THEN** the message on the next page continues the loop from that position and does not jump to the start

#### Scenario: Same-tab reload

- **WHEN** `.notification-item` is visible and the visitor reloads the page in the same tab
- **THEN** the message continues the loop from the position it had at reload and does not jump to the start

#### Scenario: Slowed by hover, then a page change

- **WHEN** the pointer is over `.notification-holder` and the visitor then opens another page in the same tab
- **THEN** the message on the next page continues from the position it had reached while slowed

#### Scenario: New tab

- **WHEN** the visitor opens the site in a new tab
- **THEN** the message starts at the beginning of the loop

#### Scenario: No saved playhead

- **WHEN** the page loads with a `.notification-item` and this tab has no saved playhead
- **THEN** the message starts at the beginning of the loop

#### Scenario: Back or forward restores the document

- **WHEN** the visitor leaves a page and the browser restores that same document from memory
- **THEN** the message continues from the position it had when the visitor left and does not jump
