## Context

See proposal.md for motivation. Drawer markup already publishes `.menu-pointer.is-none` with ids `#pointer-collection`, `#pointer-shop`, `#pointer-merch`, `#pointer-faq`. `js/global.js` already loads site-wide. Webflow `.is-none` hides those nodes.

## Goals / Non-Goals

**Goals:**

- One pathname → id map; toggle `.is-none` on `.menu-drawer .menu-list .menu-pointer`.

**Non-Goals:**

- CSS, GSAP, or a new file.
- Navbar current-page styling.
- Matching the full URL or the link href.

## Decisions

### Pathname first segment, not href

`location.pathname` first segment after stripping a trailing slash. Host is unused so a later custom domain keeps the same map.

Alternative considered: compare each menu link `href` to `location.href`. Rejected — domain change and trailing-slash variants fight the match.

### Nested `shop` / `merch` / `faq` share the listing pointer

`/merch/{slug}` and `/faq/{slug}` show the merch and faq pointers. `/product/{slug}` has no pointer.

### Stay in `global.js`

Site-wide script already on every page. Query `.menu-drawer .menu-list .menu-pointer` so a second list cannot match.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow Footer `<script>` for `js/global.js`; do not rely on `@main`.
- [Missing id] → That page stays with every pointer `is-none`.

## Migration Plan

1. Implement in `js/global.js`; note the behavior in `README.md` and `.cursor/rules/webflow-rad.mdc`.
2. Point the Footer `js/global.js` tag at the new commit SHA and publish.
3. Rollback: revert the SHA.
