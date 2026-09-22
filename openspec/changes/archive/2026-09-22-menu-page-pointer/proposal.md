## Why

The menu drawer lists Collection, Shop, Merch, and FAQ with no marker for the page the visitor is already on. Each published `.menu-pointer` starts with `.is-none`; the current page should drop that class.

## What Changes

- On load, drop `.is-none` from the `.menu-drawer .menu-list .menu-pointer` whose id matches the current pathname first segment.
- Keep `.is-none` on every other `.menu-pointer`.
- Match pathname only (domain ignored): `/` → `#pointer-collection`, `/shop` → `#pointer-shop`, `/merch` → `#pointer-merch`, `/faq` → `#pointer-faq`. Nested paths under those segments match the same pointer. Unmapped pages leave every pointer hidden.

## Capabilities

### New Capabilities

- `menu-page-pointer`: Show the drawer `.menu-pointer` for the current page by dropping `.is-none`.

### Modified Capabilities

- None.

## Impact

- `js/global.js` (`pagePointerId`, `syncMenuPointer`).
- Published drawer markup (`#pointer-collection`, `#pointer-shop`, `#pointer-merch`, `#pointer-faq` with combo `.is-none`).
- `README.md` and `.cursor/rules/webflow-rad.mdc`.
- No CSS, no new dependencies.
