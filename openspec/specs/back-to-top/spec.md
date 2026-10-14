## Purpose

Scrolls to the top from `#back-to-top` on a spring, instead of a fast-starting ease.

## Requirements

### Requirement: Back to top uses the enter spring

A click on `#back-to-top` SHALL scroll the active scroller to position 0. The trip SHALL follow `motion.standard.enter`: spring(stiffness 210, damping 29, mass 1) with a 700ms settling time. When the desktop default product gallery scrolls on its own, that gallery is the active scroller. Otherwise the window is the active scroller.

#### Scenario: Window scroll

- **WHEN** the visitor clicks `#back-to-top` and the window is the active scroller
- **THEN** the window reaches scroll position 0 on that spring, settled at 700ms

#### Scenario: Nested product gallery

- **WHEN** the visitor clicks `#back-to-top` while the desktop default product gallery scrolls on its own
- **THEN** that gallery reaches its scroll position 0 on the same spring and settling time

### Requirement: Reduced motion jumps

When `prefers-reduced-motion: reduce` is set, a click on `#back-to-top` SHALL set the active scroller to position 0 with no animation.

#### Scenario: Reduced motion

- **WHEN** `prefers-reduced-motion: reduce` is set and the visitor clicks `#back-to-top`
- **THEN** the active scroller is at position 0 with no transition
