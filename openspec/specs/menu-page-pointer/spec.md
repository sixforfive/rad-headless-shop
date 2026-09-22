# menu-page-pointer Specification

## Purpose

Shows which drawer menu page is current by dropping `.is-none` on that page's `.menu-pointer`.

## Requirements

### Requirement: Current page pointer is visible

On load, the `.menu-drawer .menu-list .menu-pointer` for the current page SHALL NOT have class `is-none`. Matching SHALL use the first pathname segment, not the host. `/` SHALL match `#pointer-collection`. `/shop` SHALL match `#pointer-shop`. `/merch` SHALL match `#pointer-merch`. `/faq` SHALL match `#pointer-faq`.

#### Scenario: Collection home

- **WHEN** the visitor is on `/`
- **THEN** `#pointer-collection` does not have class `is-none`

#### Scenario: Shop listing

- **WHEN** the visitor is on `/shop`
- **THEN** `#pointer-shop` does not have class `is-none`

#### Scenario: Merch listing

- **WHEN** the visitor is on `/merch`
- **THEN** `#pointer-merch` does not have class `is-none`

#### Scenario: FAQ listing

- **WHEN** the visitor is on `/faq`
- **THEN** `#pointer-faq` does not have class `is-none`

#### Scenario: Domain is ignored

- **WHEN** the visitor is on `/shop` on any host
- **THEN** `#pointer-shop` does not have class `is-none`

### Requirement: Nested paths use the same pointer

A path whose first segment is `shop`, `merch`, or `faq` SHALL show that segment's pointer. A first segment of `collection` SHALL show `#pointer-collection`.

#### Scenario: Merch detail

- **WHEN** the visitor is on `/merch/{slug}`
- **THEN** `#pointer-merch` does not have class `is-none`

#### Scenario: FAQ detail

- **WHEN** the visitor is on `/faq/{slug}`
- **THEN** `#pointer-faq` does not have class `is-none`

### Requirement: Other pointers stay hidden

Every `.menu-drawer .menu-list .menu-pointer` that is not the current-page match SHALL have class `is-none`. When the first pathname segment maps to no pointer, every `.menu-pointer` SHALL have class `is-none`.

#### Scenario: Shop hides the rest

- **WHEN** the visitor is on `/shop`
- **THEN** `#pointer-collection`, `#pointer-merch`, and `#pointer-faq` have class `is-none`

#### Scenario: Product page

- **WHEN** the visitor is on `/product/{slug}`
- **THEN** every `.menu-drawer .menu-list .menu-pointer` has class `is-none`

#### Scenario: Privacy page

- **WHEN** the visitor is on `/privacy`
- **THEN** every `.menu-drawer .menu-list .menu-pointer` has class `is-none`
