## ADDED Requirements

### Requirement: First row thumbs load immediately

On `/shop`, each original `.product-thumb` in the first laid-out row of `.product-list:not(.is-merch)` SHALL have its image `loading` set to `eager`. Original thumbs below that row SHALL keep `loading="lazy"`.

This SHALL hold when the list has `is-gallery` and when it does not.

The cloned list SHALL still be created. A cloned thumb MAY copy the `loading` value of the original it duplicates.

The merch list SHALL NOT gain `loading="eager"` from this rule.

#### Scenario: Gallery first row is eager

- **WHEN** `/shop` loads in gallery view and the original grid has more than one row
- **THEN** images in the first original row are `loading="eager"` and images in later original rows are `loading="lazy"`

#### Scenario: List view first row is eager

- **WHEN** `/shop` loads in list view and the original grid has more than one row
- **THEN** images in the first original row are `loading="eager"` and images in later original rows are `loading="lazy"`

#### Scenario: Clone list remains

- **WHEN** the shop gallery is showing
- **THEN** the cloned list is still present

#### Scenario: Merch stays lazy

- **WHEN** the merch listing loads
- **THEN** this rule does not set merch thumb images to `loading="eager"`
