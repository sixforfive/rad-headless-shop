## Context

See proposal.md - Why. Page scripts call `radPageReady` synchronously, so `html.is-ready` lands one frame later. `hydrateVariants` in `js/shopify.js` resolves 200–600 ms after that. On product pages the available branch is the price, `#add-to-cart`, the quantity dropdown, and a spacer. The sold-out branch is one price tag and one button. On merch, each thumb has a one-line price and a one-line SOLD OUT tag.

## Goals / Non-Goals

**Goals:**

- No layout shift when an available variant resolves.

**Non-Goals:**

- Removing the shift when a variant resolves sold out on a product page.
- Changing reveal timing or `js/shopify.js`.

## Decisions

### Reserve the available branch with `visibility: hidden`

Before `data-available`, the available branch gets `visibility: hidden` and the sold-out branch gets `display: none`. The CMS-bound price already fills the price line, so the reserved height matches what Shopify writes into it. `visibility: hidden` also blocks pointer events, so nothing can be added to cart against unknown stock, and a failed request leaves the page in the same safe state.

Alternative considered: hold `html.is-ready` until `hydrateVariants` settles, with a timeout. Rejected — every priced page would fade in 200–600 ms later, and pages without prices would need a separate path.

## Risks / Trade-offs

- [Sold-out product page] → The available branch is taller than the sold-out button, so content below moves up when a variant resolves sold out. Accepted: sold out is the rarer state and the move is upward.
- [Merch sold out] → One-line price swaps for one-line tag; no measurable shift.
