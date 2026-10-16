## Why

The cart row time is set in `js/global.js`, then copied again in `css/global.css` and `js/cart.js`. Those copies have already drifted (`0.375` on the row, `0.735` on the text and in the CSS fallback). Open and close also have no pause of their own: the rows start in the same turn as the shell, and the shell fade is pulled forward by `CART_LEAVE_TAIL_MS`, which is half the menu tail.

## What Changes

- Add `CART_OPEN_GAP`, starting at `0`. After the shell starts fading in, the title, row, subtotal, and bottom sequence waits that long.
- Add `CART_CLOSE_GAP`, starting at `0`. After the reverse sequence ends, the shell waits that long, then fades. Drop `CART_LEAVE_TAIL_MS` on the cart so it no longer starts the fade early.
- Keep the cart durations in one block in `js/global.js`: row `0.375`, titles and bottom `0.15`, bottom gap `0.375`. Stop deriving the cart from the menu constants.
- CSS and the remove handler read those values. They do not keep a second number.
- Menu timings, the shared overlay fade (`0.45s` / `0.9s`), empty-cart close, and reduced motion stay as they are.

## Capabilities

### New Capabilities

- `cart-drawer-timing`: Pauses before the cart sequence and after it, with every cart duration coming from one block.

### Modified Capabilities

## Impact

- `js/global.js` — cart clock, open wait, close wait.
- `css/global.css` — cart transitions use the clock variables. Menu rules stay.
- `js/cart.js` — row remove uses the same row duration.
- No Webflow markup. No new dependency.
