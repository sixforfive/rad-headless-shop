## Purpose

Scrolls the navbar notification message in a seamless infinite loop between the bracket marks, pausing only while the pointer is over the clip. Hides the whole bar when the Notifications collection has no published item.

## ADDED Requirements

### Requirement: Infinite loop between brackets

The notification message SHALL scroll horizontally inside `.notification-holder`, remaining clipped between the adjacent `.text-meta` bracket marks.

The loop SHALL be seamless: after the first copy of the message has fully left the clip, the next visible copy SHALL match it with no jump. Motion SHALL continue for as long as the banner is shown, including when one copy is shorter than the holder.

Holder width changes at viewport breakpoints SHALL NOT break the loop or expose a jump.

#### Scenario: Continuous scroll

- **WHEN** the navbar notification banner is visible
- **THEN** the message inside `.notification-holder` moves horizontally without stopping

#### Scenario: Seamless repeat

- **WHEN** the first copy of the message has fully scrolled out of `.notification-holder`
- **THEN** the same message is visible at the start of the clip with no jump

#### Scenario: Narrower holder

- **WHEN** the viewport crosses a breakpoint that changes `.notification-holder` width
- **THEN** the message still loops inside the clip without a jump

### Requirement: Pause on hover

While a pointer is over `.notification-holder`, the notification scroll SHALL pause. When the pointer leaves, the scroll SHALL resume from the paused position.

#### Scenario: Hover pauses

- **WHEN** the pointer is over `.notification-holder`
- **THEN** the notification message does not move

#### Scenario: Leave resumes

- **WHEN** the pointer leaves `.notification-holder` after a pause
- **THEN** the notification message continues from where it stopped

### Requirement: Hide bar when collection is empty

When `.notification-bar-box` contains no `.notification-item`, the bar SHALL have class `is-none`. When a `.notification-item` is present, the bar SHALL NOT receive `is-none` for emptiness.

Closing a drawer SHALL restore the bar only if a `.notification-item` is present. Closing a drawer SHALL NOT remove `is-none` from an empty bar.

#### Scenario: No published item

- **WHEN** the page loads and `.notification-bar-box` has no `.notification-item`
- **THEN** `.notification-bar-box` has class `is-none`

#### Scenario: Published item present

- **WHEN** the page loads and `.notification-bar-box` contains a `.notification-item`
- **THEN** `.notification-bar-box` does not have class `is-none` for emptiness

#### Scenario: Drawer close with empty collection

- **WHEN** a drawer closes and `.notification-bar-box` has no `.notification-item`
- **THEN** `.notification-bar-box` still has class `is-none`

### Requirement: Drawer padding when the bar is empty

When `.notification-bar-box` has class `is-none` and the viewport is 767px wide or narrower, `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` SHALL have `padding-top: var(--_layout---spacing--space-400)`. When the viewport is wider than 767px, or when `.notification-bar-box` does not have `is-none`, those lists SHALL keep their Webflow `padding-top`.

#### Scenario: No published item, 767px and down

- **WHEN** the page loads, `.notification-bar-box` has no `.notification-item`, and the viewport is 767px wide or narrower
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` have `padding-top: var(--_layout---spacing--space-400)`

#### Scenario: No published item, wider than 767px

- **WHEN** the page loads, `.notification-bar-box` has no `.notification-item`, and the viewport is wider than 767px
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` keep their Webflow `padding-top`

#### Scenario: Published item present

- **WHEN** the page loads and `.notification-bar-box` contains a `.notification-item`
- **THEN** `.menu-wrapper > .menu-list` and `.cart-wrapper > .cart-list` keep their Webflow `padding-top`
