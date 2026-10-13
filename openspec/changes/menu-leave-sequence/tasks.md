## 1. Dimmed content leave

- [x] 1.1 In `css/global.css`, after `.gallery-full-screen.is-dimmed`, add `html.is-leaving .main-wrapper.is-dimmed, html.is-leaving .gallery-full-screen.is-dimmed { opacity: 0; transform: none; }`
- [ ] 1.2 Verify on `/shop` with the cart open: the dimmed grid fades and does not drop

## 2. Menu close timing

- [x] 2.1 In `js/global.js`, add `MENU_LEAVE_TAIL_MS = 600` and set the `closeDrawer` timeout to `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS`
- [ ] 2.2 Verify `#menu-close` and backdrop: the drawer fade starts as the last line settles, with no still drawer

## 3. Menu leave sequence

- [x] 3.1 In `js/global.js`, add `radMenuLeaveTo(href)`: guard and set `pageLeaving`, prefetch, go straight to the URL under reduced motion, otherwise `playMenuReveal(false)`
- [x] 3.2 In `radMenuLeaveTo`, after `menuRevealReverseMs() - MENU_LEAVE_TAIL_MS`, remove `.drawer-wrapper.is-visible` and add `html.is-leaving` with `is-dimmed` kept
- [x] 3.3 After a further 450ms, call `hideDrawerOverlay()` and set `location.href`
- [x] 3.4 In `interceptPageClicks`, route open-menu clicks to `radMenuLeaveTo` and keep `radLeaveTo` for the rest
- [x] 3.5 Update the FUNCTIONS EXPLAINER header for `radMenuLeaveTo` and `interceptPageClicks`

## 4. Back/forward restore

- [x] 4.1 In `js/global.js`, add `resetDrawerState()`: clear the reveal timer, set `activeDrawer = null`, call `setDrawerButtons(null)`, drop `is-visible`, `is-dimmed`, notification `is-hidden`, and `.menu-drawer.is-revealed`, then call `hideDrawerOverlay()`
- [x] 4.2 Call `resetDrawerState()` from the `pageshow` persisted handler and add it to the FUNCTIONS EXPLAINER header

## 5. Verify

- [ ] 5.1 Menu link from `/`, `/shop`, `/faq`: copy out, then drawer and page fade together, then the next page rises; no drop, no still drawer
- [ ] 5.2 External menu link and reduced motion behave per spec
- [ ] 5.3 Back after a menu leave and after a cart leave: no overlay, undimmed content, scroll works, navbar shows the menu and cart open buttons
