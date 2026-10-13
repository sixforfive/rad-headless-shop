## Why

Before Shopify answers, both `data-when` branches are `display: none`, so the price line and the product CTA take no space. When the response lands after the page reveal, the merch grid's second row and the product right column drop by that height.

## What Changes

- Before a wrapper has `data-available`, `data-when="available"` children stay laid out but invisible, so the space they need is held from first paint.
- `data-when="sold-out"` children stay out of layout until Shopify reports the variant sold out.
- After the answer, nothing changes: the matching branch shows and the other is removed from layout.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shopify-variant-hydration`: the pre-response state reserves the available branch's space instead of collapsing both branches.

## Impact

- `css/global.css`: the pre-answer `[data-when]` rule.
- Webflow: merch `.thumb-img-holder` has an `is-merch` combo class at 1:1 aspect ratio, so lazy images no longer grow tiles after the reveal. Designer change, not in this repo.
- No JS change, no new dependency.
