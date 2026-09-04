## Purpose

Makes Shopify the runtime source of price and stock for the Webflow storefront, so every product element reads its own variant state from the Storefront API instead of from CMS fields that a human has to keep in sync.

## ADDED Requirements

### Requirement: Storefront credentials come from the page, not the repo

The site SHALL read the Shopify store domain and Storefront access token from a `window.RAD_SHOPIFY` object set by the hosting page. Neither value SHALL appear in this repository. When the object, its domain, or its token is missing, hydration SHALL do nothing and SHALL NOT throw.

#### Scenario: Config present

- **WHEN** a page defines `window.RAD_SHOPIFY` with a domain and token before the storefront script runs
- **THEN** requests go to that store's Storefront API endpoint with that token

#### Scenario: Config missing

- **WHEN** a page loads the storefront script without defining `window.RAD_SHOPIFY`
- **THEN** no network request is made, no error surfaces to the console, and the rest of the page behaves normally

### Requirement: Storefront API requests report errors

A GraphQL request to the Storefront API SHALL return the response `data` on success. When the response carries an `errors` array, the request SHALL fail with the first error's message rather than returning partial data as if it succeeded.

#### Scenario: Successful query

- **WHEN** the Storefront API answers with a `data` object and no `errors`
- **THEN** the caller receives that `data` object

#### Scenario: GraphQL error

- **WHEN** the Storefront API answers with an `errors` array
- **THEN** the request fails with the first error's message

### Requirement: Product wrappers declare their variant

Every element whose price and availability come from Shopify SHALL carry `data-variant-id` holding the Shopify variant identifier, bound from the Webflow CMS. That element is the wrapper. A wrapper SHALL be the nearest common ancestor of the product's price, add-to-cart, and quantity controls. On listing pages each Collection Item SHALL be its own wrapper.

The variant identifier SHALL be accepted either as a bare numeric id or as a full `gid://shopify/ProductVariant/<id>` string.

#### Scenario: Bare numeric id

- **WHEN** a wrapper carries `data-variant-id="1234567890"`
- **THEN** it is queried as `gid://shopify/ProductVariant/1234567890`

#### Scenario: Full gid

- **WHEN** a wrapper carries `data-variant-id="gid://shopify/ProductVariant/1234567890"`
- **THEN** it is queried unchanged

### Requirement: One request hydrates the whole page

All wrappers on a page SHALL be resolved in a single Storefront API request, regardless of how many products the page shows.

#### Scenario: Listing page with many products

- **WHEN** a page contains twelve wrappers with distinct variant ids
- **THEN** exactly one Storefront API request is made for all twelve

#### Scenario: Page with no wrappers

- **WHEN** a page contains no `[data-variant-id]` element
- **THEN** no Storefront API request is made

### Requirement: Wrapper state is scoped to its own wrapper

Hydration SHALL write each variant's result only into the wrapper that declared it. Element lookups SHALL be performed within the wrapper's subtree, never against the whole document, so that one product's price or state can never land on another product.

#### Scenario: Two products on one page

- **WHEN** two wrappers on the same page hold different variants at different prices
- **THEN** each wrapper's price element shows its own variant's price

#### Scenario: Unresolved variant

- **WHEN** the API returns no variant for a wrapper's id
- **THEN** that wrapper keeps its pre-existing markup and no other wrapper is affected

### Requirement: Price and availability land on the marked elements

Within each wrapper, the element carrying `data-price` SHALL receive the variant's price as text, and the wrapper SHALL receive `data-available` set to `"true"` or `"false"` from the variant's `availableForSale`. Role attributes on children (`data-price`, `data-add-to-cart`, `data-quantity`) SHALL carry no state — they mark what an element is, not what it shows.

#### Scenario: Available variant

- **WHEN** a variant resolves with `availableForSale` true
- **THEN** its wrapper carries `data-available="true"` and its `data-price` element shows the variant price

#### Scenario: Sold-out variant

- **WHEN** a variant resolves with `availableForSale` false
- **THEN** its wrapper carries `data-available="false"`

### Requirement: Availability drives which branch is visible

Elements marked `data-when="available"` SHALL be visible only inside a wrapper whose `data-available` is `"true"`. Elements marked `data-when="sold-out"` SHALL be visible only inside a wrapper whose `data-available` is `"false"`. Before a wrapper has any `data-available` value, neither branch SHALL be visible, so the two never appear at once.

#### Scenario: Available product

- **WHEN** a wrapper carries `data-available="true"`
- **THEN** its `data-when="available"` children are visible and its `data-when="sold-out"` children are hidden

#### Scenario: Sold-out product

- **WHEN** a wrapper carries `data-available="false"`
- **THEN** its `data-when="sold-out"` children are visible and its `data-when="available"` children are hidden

#### Scenario: Before the response lands

- **WHEN** a wrapper has `data-variant-id` but no `data-available` yet
- **THEN** neither the `data-when="available"` nor the `data-when="sold-out"` children are visible

### Requirement: CMS sold-out state is retired

Sold-out presentation SHALL be driven by `data-available` from Shopify. The Webflow conditional visibility bound to the CMS `sold-out` switch SHALL be removed, so that a single source decides the state.

#### Scenario: CMS switch no longer decides

- **WHEN** a product's CMS `sold-out` switch is on but Shopify reports the variant `availableForSale` true
- **THEN** the product renders as available
