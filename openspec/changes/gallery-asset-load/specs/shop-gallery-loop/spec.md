## ADDED Requirements

### Requirement: Original thumbs load immediately and clones do not

On `/shop`, every image inside an original `.product-thumb` of `.product-list:not(.is-merch)` SHALL have `loading` set to `eager`, so the original block reaches its final height at load and the loop height does not grow while the visitor scrolls.

Every image inside the cloned list SHALL have `loading` set to `lazy`. A clone image URL matches the original it duplicates, so the clone SHALL NOT issue a second request before it is approached.

The merch list SHALL NOT gain `loading="eager"` from this rule.

#### Scenario: Originals are eager

- **WHEN** `/shop` loads
- **THEN** every image in an original shop thumb is `loading="eager"`

#### Scenario: Clones are lazy

- **WHEN** the cloned list has been created
- **THEN** every image inside it is `loading="lazy"`

#### Scenario: Merch stays lazy

- **WHEN** the merch listing loads
- **THEN** this rule does not set merch thumb images to `loading="eager"`

### Requirement: Wrap waits for settled image geometry

The gallery SHALL NOT wrap while any image inside an original `.product-thumb` is still pending. A `.product-thumb` is taller than zero from its text alone, so thumb height alone SHALL NOT be treated as evidence that its image has arrived.

#### Scenario: No wrap before images arrive

- **WHEN** the visitor reaches the measured loop height while an original thumb image is still pending
- **THEN** the page does not shift backward

#### Scenario: Wrap once images have arrived

- **WHEN** every original thumb image has finished and the visitor scrolls past the loop height
- **THEN** the gallery wraps as specified
