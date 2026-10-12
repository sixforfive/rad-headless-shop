# dot-cursor Specification

## Purpose

Replaces the native pointer with a 12×12 difference-blend dot wherever the element under the pointer uses the pointer cursor.

## Requirements

### Requirement: Dot replaces the pointer cursor

On a fine pointer, while the element under the pointer has a computed cursor of `pointer`, the site SHALL show a circular dot 12×12px, filled white, centered on the hotspot, with `mix-blend-mode: difference`. The native cursor SHALL be hidden. The dot SHALL NOT receive pointer events, and clicks SHALL reach the element under the hotspot.

#### Scenario: Hover a pointer target

- **WHEN** a fine pointer is over an element whose computed cursor is `pointer`
- **THEN** a 12×12 white difference-blend dot is centered on the hotspot and the native cursor is hidden

#### Scenario: Click through the dot

- **WHEN** the visitor clicks while the dot is shown
- **THEN** the click reaches the element under the hotspot

#### Scenario: Leave a pointer target

- **WHEN** the pointer moves from an element whose computed cursor is `pointer` onto an element whose computed cursor is not `pointer`
- **THEN** the dot is hidden and that element's native cursor is shown

### Requirement: Other cursors stay native

The dot SHALL be shown only for a computed cursor of `pointer`. Grab, grabbing, text, and the default arrow SHALL stay native cursors.

#### Scenario: Gallery gap

- **WHEN** a fine pointer is over empty space in the collection canvas
- **THEN** the native grab cursor is shown and the dot is hidden

#### Scenario: Text entry

- **WHEN** a fine pointer is over a text field
- **THEN** the native text cursor is shown and the dot is hidden

### Requirement: Dot stays on the hotspot

The dot SHALL sit on the hotspot with no lag. When scroll or layout changes the element under a still pointer, the dot SHALL show or hide to match that element's computed cursor without requiring the pointer to move.

#### Scenario: Move inside a pointer target

- **WHEN** a fine pointer moves inside an element whose computed cursor is `pointer`
- **THEN** the dot stays centered on the hotspot with no lag

#### Scenario: Scroll a pointer target away

- **WHEN** the dot is shown and the visitor scrolls until the element under the pointer no longer has a computed cursor of `pointer`
- **THEN** the dot is hidden and the native cursor for the new element is shown

#### Scenario: Reduced motion

- **WHEN** the visitor prefers reduced motion and a fine pointer enters an element whose computed cursor is `pointer`
- **THEN** the dot appears immediately and stays on the hotspot

### Requirement: No dot on coarse pointers

On a coarse pointer, the site SHALL NOT show the dot. Native cursors SHALL stay as they are.

#### Scenario: Touch device

- **WHEN** the page loads on a coarse pointer
- **THEN** no dot is created or shown
