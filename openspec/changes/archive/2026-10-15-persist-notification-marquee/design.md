## Context

See proposal.md. `.notification-item` is `animation: notification-marquee 30s linear infinite` (`translateX(0)` → `translateX(calc(-100% / 3))`). The navbar is outside `.main-wrapper`, so the bar stays painted through leave and through the next document's first paint. `js/global.js` is a Footer script, so it runs after that paint. Hover sets `playbackRate` to `30 / 60` via `setMarqueeRate`. Empty bar, drawer `is-hidden`, and the 30s loop stay.

## Goals / Non-Goals

**Goals:**

- Save the visual phase when the document is actually leaving.
- Apply it on `html` before `body` exists, so the first painted frame is already in phase.
- Keep the 30s CSS loop. Do not switch the marquee to script-driven motion.

**Non-Goals:**

- Changing hover speed, empty-bar `is-none`, or drawer `is-hidden`.
- Sharing the phase across tabs.
- `prefers-reduced-motion` (the marquee already keeps running there).

## Decisions

### Save the transform, not `animation.currentTime`

On `pagehide` in `js/global.js`, read `.notification-item`'s computed `transform` and its width. One loop moves `-100% / 3` of the item, so progress is `(-translateX) / (width / 3)`, wrapped into `0..1`. Store `sessionStorage` key `rad-notification-marquee` as JSON `{ p, at, r }`: progress, `Date.now()`, and the marquee `playbackRate` (`1` when missing).

`pagehide` is after the leave timeout, so the 800ms content sink and the longer menu leave are already in the transform. `radLeaveTo` does not need its own write.

Alternative considered: `animation.currentTime`. Rejected — a negative `animation-delay` does not report the same way in every browser, and the transform is the position on screen.

Alternative considered: `localStorage`. Rejected — a new tab would inherit another tab's phase.

### Head snippet sets `--rad-marquee-delay` before first paint

```html
<script>
  try {
    var raw = sessionStorage.getItem("rad-notification-marquee");
    if (raw) {
      var saved = JSON.parse(raw);
      var duration = 30000;
      var rate = typeof saved.r === "number" ? saved.r : 1;
      var elapsed = saved.p * duration + (Date.now() - saved.at) * rate;
      if (elapsed < 0) elapsed = 0;
      var delay = -((elapsed % duration) / 1000);
      document.documentElement.style.setProperty(
        "--rad-marquee-delay",
        delay + "s",
      );
    }
  } catch (e) {}
</script>
```

Paste in Webflow Site Settings → Custom Code → Head. Not in this repo. `document.body` is null there; the variable is inherited from `html`.

In `css/global.css`, add `animation-delay: var(--rad-marquee-delay, 0s)` on `.notification-item`. A negative delay seeks an infinite animation. Unset variable is `0s`, which is today's start.

The CSS duration, the `30000` in the snippet, and the progress math MUST stay on one 30s loop. The loop distance stays `calc(-100% / 3)`.

### Do not re-apply on a restored document

`pageshow` with `persisted` keeps the old animation. The Head snippet does not run again. No read in `resetDrawerState`.

### Storage failures

`sessionStorage` throw or bad JSON: catch, leave the delay unset, start at the beginning.

## Risks / Trade-offs

- [Head snippet missing] → Footer JS cannot fix the first frame. The bar still jumps to the start, then would jump again if JS sought it. Do not seek from `global.js`. The snippet is required for the continuation.
- [Duration edited in one place] → Phase wraps wrong. All three sites use 30s.
- [Stale `at` after a crash] → Next load wraps a long gap into the 30s loop and lands mid-loop. Accepted. A normal navigation writes a fresh snapshot on `pagehide`.
- [jsDelivr cache] → `css/global.css` and `js/global.js` need a new SHA after commit. Do not rely on `@main`.

## Migration Plan

1. Add the delay on `.notification-item` and the `pagehide` write in `js/global.js`.
2. Paste the Head snippet in Webflow.
3. Rollback: revert the CSS and JS and remove the snippet. A leftover `rad-notification-marquee` value is unused.
