## ADDED Requirements

### Requirement: A failed line change shows an error in the drawer

When `cartLinesRemove` or `cartLinesUpdate` returns user errors or the request throws, the site SHALL NOT change the drawer line markup and SHALL show the mapped error node inside `.cart-drawer`. The drawer open state SHALL NOT change. When the row has no cart line id, the site SHALL NOT call Storefront and SHALL NOT show an error.

#### Scenario: Remove or update user errors or throw

- **WHEN** `cartLinesRemove` or `cartLinesUpdate` returns `userErrors` or the request throws
- **THEN** the drawer stays as it was and the mapped error node inside `.cart-drawer` has class `is-visible`

#### Scenario: Missing line id

- **WHEN** the activated control's row has no cart line id
- **THEN** no Storefront line mutation is made and no error node is shown
