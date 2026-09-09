# shopify-cart-init Specification

## Purpose

Gives the storefront a Shopify cart id that survives full page loads, so later add-to-cart and checkout work against one cart instead of creating a new one on every navigation.

## Requirements

### Requirement: Cart id is stored in the browser

The site SHALL persist the Shopify cart identifier in `localStorage` under the key `rad-cart-id`. The stored value SHALL be the full cart gid. When `localStorage` is unavailable, persistence SHALL fail silently and SHALL NOT throw.

#### Scenario: Id is written

- **WHEN** the Storefront API returns a cart with an id
- **THEN** that id is stored under `rad-cart-id`

#### Scenario: Storage blocked

- **WHEN** `localStorage` throws
- **THEN** the page continues with no stored cart id and no console error storm

### Requirement: A stored id is validated on load

When a page loads with a `rad-cart-id` value, the site SHALL query that cart from the Storefront API. The query SHALL request only the cart `id`. When the API returns a cart with an id, the stored value SHALL be kept.

#### Scenario: Stored cart still exists

- **WHEN** `rad-cart-id` holds a gid and `cart(id)` returns a cart
- **THEN** the key is left unchanged

#### Scenario: No stored id

- **WHEN** a page loads with no `rad-cart-id` value
- **THEN** no Storefront cart request is made and no cart is created

### Requirement: An expired or completed cart is discarded

When the Storefront API answers the cart query with a null cart, the stored id SHALL be removed. A null cart means the cart has expired or checkout has already completed.

#### Scenario: Expired cart

- **WHEN** `rad-cart-id` holds a gid and `cart(id)` returns null
- **THEN** `rad-cart-id` is removed

### Requirement: A failed cart query keeps the stored id

When the cart query fails with a network or GraphQL error, the stored id SHALL be left in place so a later page load can retry.

#### Scenario: Request fails

- **WHEN** a stored id exists and the cart query throws
- **THEN** `rad-cart-id` is unchanged

### Requirement: A cart is created only when none is valid

The site SHALL create a Shopify cart only when a caller needs a cart id and no valid stored id exists. Creating a cart SHALL use `cartCreate` with no lines. The returned cart id SHALL be stored under `rad-cart-id`.

#### Scenario: Create after missing id

- **WHEN** a caller needs a cart id and `rad-cart-id` is empty
- **THEN** one `cartCreate` runs and the new cart id is stored

#### Scenario: Create after expired id

- **WHEN** a caller needs a cart id and the stored id has already been discarded as expired
- **THEN** one `cartCreate` runs and the new cart id is stored

#### Scenario: Reuse existing cart

- **WHEN** a caller needs a cart id and a valid stored id already exists
- **THEN** no `cartCreate` runs and the existing id is reused

### Requirement: A failed cart create is not stored

When `cartCreate` returns user errors, returns no cart, or the request throws, no id SHALL be written to `rad-cart-id`.

#### Scenario: Create user errors

- **WHEN** `cartCreate` returns `userErrors` and no cart
- **THEN** `rad-cart-id` is not written

#### Scenario: Create request fails

- **WHEN** `cartCreate` throws
- **THEN** `rad-cart-id` is not written

### Requirement: Missing Storefront config skips cart work

When `window.RAD_SHOPIFY` is missing its domain or token, cart restore and cart create SHALL do nothing and SHALL NOT throw.

#### Scenario: Config missing on load

- **WHEN** a page loads the cart script without a domain or token, even if `rad-cart-id` is set
- **THEN** no Storefront request is made and the rest of the page behaves normally
