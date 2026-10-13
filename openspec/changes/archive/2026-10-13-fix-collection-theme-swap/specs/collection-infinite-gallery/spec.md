## ADDED Requirements

### Requirement: Texture swap follows lights only

The gallery SHALL start a texture swap only when `body` gains or loses class `dark-mode`. Other class changes on `html` or `body`, including the dot cursor class that is rewritten while a pointer rests on a pointer-cursor element, SHALL NOT start, restart, or stall a swap.

#### Scenario: Toggle with the pointer on the lights switch

- **WHEN** the visitor on a fine pointer clicks `#lights-switch-btn` and keeps the pointer on it
- **THEN** every plane crossfades to the other mode's texture over 0.45s ease-out and finishes

#### Scenario: Toggle with the pointer on a plane

- **WHEN** the visitor toggles lights by keyboard while the pointer is over an image plane
- **THEN** every plane crossfades to the other mode's texture and finishes

#### Scenario: Unrelated class change

- **WHEN** a class other than `dark-mode` changes on `html` or `body` and lights did not change
- **THEN** no swap starts and a swap already in progress keeps its progress
