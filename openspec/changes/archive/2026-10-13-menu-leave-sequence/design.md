## Context

For the motivation, see proposal.md (Why). Current menu-link path in `js/global.js`:

- `interceptPageClicks` calls `playMenuReveal(false)`, clears `activeDrawer`, then `radLeaveTo(href)`.
- `radLeaveTo` adds `html.is-leaving` right away and sets `location.href` after `PAGE_LEAVE_MS + PAGE_HOLD_MS` (800ms). Nothing ties this to the menu reverse, which runs `menuRevealReverseMs()` (~1.5s+).
- `.main-wrapper.is-dimmed` and `.gallery-full-screen.is-dimmed` stay on through the leave. `html.is-ready .main-wrapper.is-dimmed` (0,3,1) ties with `html.is-leaving .main-wrapper:not(:has(.collection-hero-logo))` (0,3,1) and wins because it comes later. So opacity stays `0.3`, the leave's `translateY(0.75rem)` still applies, and the dim rule's transition list has no `transform`. That causes the instant drop.
- Reveal ease `cubic-bezier(0.62, 0.05, 0.01, 0.99)` over 1.47s: progress is 95.7% at 70% (1.03s) and 99.5% at 90%. The last ~0.45s looks static.

## Goals / Non-Goals

**Goals:**
- Strict order: menu reverse, page fade under the drawer, drawer fade, then `location.href`.
- No transform on dimmed content during any leave.
- No still drawer after the reverse on `#menu-close` and backdrop close.

**Non-Goals:**
- Navbar, second menu, footer: they stay, as in the current spec.
- Cart drawer leave sequencing.

## Decisions

**0. One early cut for both menu exits.**
`MENU_LEAVE_TAIL_MS = 600` is subtracted from `menuRevealReverseMs()` in `closeDrawer`'s `menuRevealHideTimer` and in the menu-leave sequencer. At 600ms before the end (0.87s into the 1.47s move) the ease is at ~91%, which is where the last line reads as gone. 450ms (~96%) still showed a visible pause.
Alternative: shorten `MENU_REVEAL_DURATION`. Rejected because that changes the open motion too.

**1. Separate menu-leave sequencer instead of overloading `radLeaveTo`.**
A new `radMenuLeaveTo(href)` in `global.js` sets `pageLeaving`, prefetches, and runs the reverse. With `lineGone = menuRevealReverseMs() - MENU_LEAVE_TAIL_MS`, it adds `html.is-leaving` at `lineGone - PAGE_LEAVE_MS` (clamped at 0), keeping `is-dimmed` on so the CSS in decision 2 fades the page from 0.3 to 0 under the opaque drawer. At `lineGone` it removes `.drawer-wrapper.is-visible`. After a further 450ms it calls `hideDrawerOverlay()` and sets `location.href`. Fading both at once let the half-faded page show through the drawer as the drawer cleared. `interceptPageClicks` routes menu clicks there. Other clicks keep `radLeaveTo`.
Alternative: chain `fadeDrawerOut` with its `transitionend` on `backdrop-filter`. Rejected because that waits for the 0.9s blur, which brings back dead time, and because it removes `is-dimmed`, which makes the page flash back to opacity 1.

**2. CSS leave rule for dimmed content, placed after the dim rules.**

```css
html.is-leaving .main-wrapper.is-dimmed,
html.is-leaving .gallery-full-screen.is-dimmed {
  opacity: 0;
  transform: none;
}
```

Specificity (0,3,1) and later source order beat both the leave rule and the dim rule. `transform: none` removes the drop at its source. The opacity transition comes from the existing 0.45s `is-dimmed` transition.
Alternative: add `transform` to the dim transition list. Rejected because content would still drift under the drawer, and the spec says it must not move.

**3. No `PAGE_HOLD_MS` on the menu path.**
Prefetch starts at click, about 1.5s before navigation, which covers the warm-up the hold was there for.

**4. `pageshow` (bfcache) restore resets drawer state with no transition.**
Today the menu click clears `activeDrawer` but leaves `.drawer-wrapper.is-visible` with `display: grid`, `body.is-scroll-locked`, Lenis stopped, and `is-dimmed` on. The bfcache brings all of that back. A `resetDrawerState()` in `global.js` runs from the persisted `pageshow` handler. It calls `clearMenuRevealHide()`, sets `activeDrawer = null`, calls `setDrawerButtons(null)`, removes `is-visible`, `is-dimmed` (on both `.main-wrapper` and `.gallery-full-screen`), the notification `is-hidden`, and `.menu-drawer.is-revealed`, then calls `hideDrawerOverlay()`. That last call hides the panels, unlocks scroll, and restarts Lenis. The overlay is hidden at once through `display: none`. The content returns from 0.3 to full opacity on its existing 0.45s dim transition.
Alternative: rely only on the new sequence calling `hideDrawerOverlay()` before navigation. Rejected because the cart leave still navigates with the drawer open, and a timer can be frozen mid-sequence when the page is cached.

## Risks / Trade-offs

- [The 600ms tail cut looks early if the line count grows] → It is tied to the last line's end, not to a fixed time, so it scales.
- [The visitor clicks again during the sequence] → The `pageLeaving` guard ignores it.
- [The cart leave now fades dimmed content in place instead of dropping] → This is intended and matches the spec scenario.
