## Why

The cart drawer opens and closes as a plain overlay fade, and removing a line deletes the row at once. The menu already reveals and hides in stages. The cart should use those same clocks so opening, closing, and removing a line feel like the rest of the drawer.

## What Changes

- Opening the cart blurs the drawer, then reveals titles, each product, the subtotal, and the bottom bar on the menu timings.
- Closing the cart plays that sequence backward, then fades the overlay.
- Removing a line shrinks that row on the same line ease. The drawer stays open. The returned cart is rendered when the row transition ends.
- An empty cart only blurs. A line added or a quantity change while the cart is already open appears at rest and does not replay the open.

## Capabilities

### New Capabilities

- `cart-drawer-reveal`: Staged open, reverse close, and single-row remove inside `.cart-drawer`, using the menu reveal durations and eases.

### Modified Capabilities

## Impact

- `css/global.css` — from-state, revealed state, and row-remove transitions, including reduced motion.
- `js/global.js` — cart reveal timing on open and close.
- `js/cart.js` — mask-safe line fill, rested rebuild while open, remove waits for the row transition.
- No Webflow markup change. No new dependency.
