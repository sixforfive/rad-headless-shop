## MODIFIED Requirements

### Requirement: Sibling links dim on hover

While the pointer is over a `.product-link` in the shop listing, every other `.product-link` in the shop listing SHALL fade to 30% opacity, across both the original list and its clone. The hovered `.product-link` SHALL stay at 100% opacity.

While the pointer is over a `.product-link` in the merch listing, every other `.product-link` in that same list SHALL fade to 30% opacity. The merch listing SHALL NOT dim when a shop link is hovered, and the shop listing SHALL NOT dim when a merch link is hovered.

The dim SHALL apply on shop (gallery and list) and merch listing.

#### Scenario: Hover one shop link

- **WHEN** the pointer is over one `.product-link` in the shop listing
- **THEN** that link is at 100% opacity and every other `.product-link` in the shop listing is at 30% opacity

#### Scenario: Hover across the loop seam

- **WHEN** the shop gallery is scrolled so original and cloned thumbs are both visible and the pointer is over one original `.product-link`
- **THEN** cloned `.product-link` nodes dim the same as the other originals

#### Scenario: Hover one merch link

- **WHEN** the pointer is over one `.product-link` in the merch `.product-list`
- **THEN** that link is at 100% opacity and every other `.product-link` in that list is at 30% opacity

#### Scenario: Merch and shop do not cross

- **WHEN** a merch `.product-list` and a shop `.product-list` are on the same page and the pointer is over a shop `.product-link`
- **THEN** merch `.product-link` nodes stay at 100% opacity
