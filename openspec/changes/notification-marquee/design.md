## Context

See proposal.md for motivation. Published navbar markup is already the clip + two identical copies:

`.notification-bar-box` → `[` `.text-meta` / `.notification-collection` / `.notification-holder` (overflow hidden, nowrap) / `.notification-item` (`flex: none`, two `.notification-text` siblings) / `]` `.text-meta`.

`.notification-holder` width follows the grid (narrower on desktop, full row at ≤767px). Copy length is letter-limited in CMS. `css/global.css` is already loaded site-wide.

## Goals / Non-Goals

**Goals:**

- Loop by translating the item, not the clip.
- Keep the loop distance independent of holder width so breakpoints do not need extra rules.

**Non-Goals:**

- JavaScript, GSAP, or Webflow interactions.
- Pause-when-fits logic.
- Changing Webflow layout, CMS, or collection limit.
- `prefers-reduced-motion` handling.

## Decisions

### CSS `translateX(-50%)` on `.notification-item`

Animate `.notification-item` from `translateX(0)` to `translateX(-50%)`, `linear`, `infinite`. `-50%` is half of the item (one copy). The holder stays put and clips.

Alternative considered: GSAP / WAAPI with pixel `x` and ResizeObserver — needed if duration should track copy width; rejected as heavier than CSS for a letter-capped line. Animating `.notification-holder` itself — moves the clip. DOM recycle of the first copy — unnecessary with two identical nodes.

### Pause with `animation-play-state` on holder hover

`.notification-holder:hover .notification-item { animation-play-state: paused; }` keeps the playhead. Hover target is the clip, not the brackets.

### Fixed duration

One duration (start at 20s) is enough because CMS copy is letter-capped. Tune the number if it feels fast or slow; do not compute px/s.

### No breakpoint CSS

Holder width only changes the clip. Loop math is `%` of the item. Do not add media queries for the marquee.

## Risks / Trade-offs

- [`.notification-item` shrinks to the holder] → Loop uses half the clip, not half the text, and jumps. Webflow already sets `flex: none`; if a jump appears, add `flex: none` / `width: max-content` in `css/global.css`.
- [Collection does not shrink (`min-width: auto`)] → Text overflows the brackets instead of clipping. Webflow already sets `min-width: 0`; restore it there, or add it in `css/global.css`, if that regresses.
- [jsDelivr CSS cache] → New SHA in the Webflow `<link>` (see `rad-workflow-scripts.md`); do not rely on `@main`.
- [First tap on touch can leave `:hover` stuck] → Accepted for a CSS-only pause.

## Migration Plan

1. Add the keyframes and rules to `css/global.css`.
2. Point the site-wide Head `<link>` at the new commit SHA and publish Webflow.
3. Rollback: revert the CSS; the banner is static again. Markup stays.
