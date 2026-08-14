## Purpose

Scrolls the navbar notification message in a seamless infinite loop between the bracket marks, pausing only while the pointer is over the clip.

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
