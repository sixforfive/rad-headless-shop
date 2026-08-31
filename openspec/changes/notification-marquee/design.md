## Context

See proposal.md for motivation. Published navbar markup is the clip + three identical copies:

`.notification-bar-box` → `[` `.text-meta` / `.notification-collection` / `.notification-holder` (overflow hidden, nowrap) / `.notification-item` (`flex: none`, three `.notification-text` siblings) / `]` `.text-meta`.

`.notification-holder` width follows the grid (narrower on desktop, full row at ≤767px). Copy length is letter-limited in CMS. Collection slug is `notifications`. `css/global.css` and `js/global.js` are already loaded site-wide.

## Goals / Non-Goals

**Goals:**

- Loop by translating the item, not the clip.
- Keep the loop distance independent of holder width so breakpoints do not need extra rules.
- Hide the bar when the published list has no item, without fighting drawer `.is-none`.

**Non-Goals:**

- GSAP or Webflow interactions.
- Pause-when-fits logic.
- Changing Webflow layout, CMS fields, or collection limit.
- Fetching the collection from the Webflow Data API.
- `prefers-reduced-motion` handling.

## Decisions

### CSS `translateX(calc(-100% / 3))` on `.notification-item`

Animate `.notification-item` from `translateX(0)` to `translateX(calc(-100% / 3))`, `linear`, `infinite`, 30s. `-100%/3` is one of three identical copies. Duration stays 30s so px/s matches the two-copy `-50%` loop. The holder stays put and clips.

Alternative considered: GSAP / WAAPI with pixel `x` and ResizeObserver — needed if duration should track copy width; rejected as heavier than CSS for a letter-capped line. Animating `.notification-holder` itself — moves the clip. `-50%` with three copies — jumps 1.5 copies. Two copies — too short to fill the wide-screen clip.

### Pause with `animation-play-state` on holder hover

`.notification-holder:hover .notification-item { animation-play-state: paused; }` keeps the playhead. Hover target is the clip, not the brackets.

### Fixed duration

One duration (start at 20s) is enough because CMS copy is letter-capped. Tune the number if it feels fast or slow; do not compute px/s.

### No breakpoint CSS

Holder width only changes the clip. Loop math is `%` of the item. Do not add media queries for the marquee.

### Hide empty bar from the published DOM

`hideNotificationIfEmpty` checks `.notification-bar-box` for a `.notification-item` and adds `.is-none` if none. Unpublished CMS items never appear in the published list, so the DOM is the source of truth. CSS for `.notification-bar-box.is-none` already exists.

`closeDrawer` currently always removes `.is-none`. Only remove it when a `.notification-item` exists, or empty brackets reappear after menu/cart close.

Alternative considered: a separate empty class — extra CSS for the same `display: none`. Data API by slug `notifications` — overkill for a bound Collection List already on the page.

### Drawer padding via `:has(.notification-bar-box.is-none)`

When the bar is `display: none`, Webflow’s `padding-top: var(--_layout---spacing--space-600)` on `.menu-cart-wrapper` (menu and cart drawers) leaves a gap above 767px. Override with `padding-top: var(--_layout---spacing--space-400)` on `body:has(.notification-bar-box.is-none) .menu-cart-wrapper`. No extra class or JS: `hideNotificationIfEmpty` already sets `is-none`. Drawer open uses `.is-hidden`, not `.is-none`, so a live banner keeps Webflow padding. Below 767px Webflow already uses space-400.

Alternative considered: a body class from JS — duplicate of the existing empty check. Targeting leftover `.menu-wrapper` / `.cart-wrapper` — those classes are not in the published DOM.

## Risks / Trade-offs

- [`.notification-item` shrinks to the holder] → Loop uses half the clip, not half the text, and jumps. Webflow already sets `flex: none`; if a jump appears, add `flex: none` / `width: max-content` in `css/global.css`.
- [Collection does not shrink (`min-width: auto`)] → Text overflows the brackets instead of clipping. Webflow already sets `min-width: 0`; restore it there, or add it in `css/global.css`, if that regresses.
- [jsDelivr CSS cache] → New SHA in the Webflow `<link>` (see `rad-workflow-scripts.md`); do not rely on `@main`.
- [First tap on touch can leave `:hover` stuck] → Accepted for a CSS-only pause.

## Migration Plan

1. Add the keyframes and rules to `css/global.css`.
2. Add `hideNotificationIfEmpty` in `js/global.js` and gate drawer close on `.notification-item`.
3. Point the site-wide Head `<link>` and Footer `<script>` at the new commit SHA and publish Webflow.
4. Rollback: revert the CSS and JS; the banner is static again and empty brackets show. Markup stays.
