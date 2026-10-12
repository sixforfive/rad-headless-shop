## Context

See proposal.md. `initCursorLabel` in `js/global.js` already runs only for `(hover: hover) and (pointer: fine)`, stores the last pointer position, and hit-tests with `elementFromPoint` on `pointermove`, scroll, and a frame loop. The label is `pointer-events: none`, white, and `mix-blend-mode: difference`. `js/collection.js` sets the canvas cursor to `pointer`, `grab`, or `grabbing`. Webflow sets `cursor: pointer` on its own classes.

## Goals / Non-Goals

**Goals:**

- One 12×12 white circle, `mix-blend-mode: difference`, centered on the hotspot whenever the computed cursor is `pointer`.
- Hide the native pointer only for that case.
- Share the existing fine-pointer hit path. The label keeps its lag.

**Non-Goals:**

- Replacing grab, grabbing, text, or the default arrow.
- A fade or a lag on the dot.
- A `cursor` image. A cursor bitmap cannot blend.
- Changes in `js/collection.js` or Webflow markup.

## Decisions

### DOM dot, sampled from computed cursor

CSS cannot select on a computed `cursor`. `getComputedStyle(hit).cursor === "pointer"` matches Webflow classes, user-agent links, and the canvas inline style. `cursor` inherits, so a child of a pointer target reports `pointer`.

The hide rule is `html.is-dot-cursor, html.is-dot-cursor * { cursor: none !important }`. That rule makes the next computed value `none`, so the sample drops `is-dot-cursor`, reads, then restores the class, all before paint. Sample from the same apply path as the label, including a still pointer after scroll or a DOM swap. Skip the read until the first `pointermove`.

Alternative considered: `cursor: url(...)`. Rejected — no blend mode.

### White circle, no lag

The dot is a `div` appended to `body`: 12×12, `border-radius: 50%`, `#fff`, `mix-blend-mode: difference`, `pointer-events: none`, `z-index` above `.custom-cursor-label`. Position is `translate3d(clientX - 6px, clientY - 6px, 0)` with no lerp. Show and hide are immediate. Reduced motion changes nothing on the dot. The label's offset and lerp stay.

Alternative considered: a black fill. Rejected — `difference` against black disappears on a dark page. White inverts both.

### Coarse pointers create nothing

The dot node is created inside the existing fine-pointer guard. A coarse pointer never gets the node or `is-dot-cursor`.

## Risks / Trade-offs

- [Reading computed cursor with the hide class left on] → The sample always sees `none` and the dot never stays. The read happens with the class removed, in the same turn as the restore.
- [A style read each sample forces layout] → Accepted. It rides the hit-test the label already does. It does not add a second frame loop.
- [`cursor: none !important` covers a pointer target that also sets `!important`] → Webflow does not. If one appears, the native pointer can show on top of the dot.
- [A drag sets the canvas to `grabbing`] → The next sample hides the dot and the native grabbing cursor shows.

## Migration Plan

1. Ship `css/global.css` and `js/global.js`.
2. On archive, update the `cursor-label` purpose line that says the label does not hide the native cursor. The dot hides the native pointer; the label still does not.
3. Rollback: revert those two files. Webflow `cursor: pointer` shows the native pointer again.
