## Context

See proposal.md for motivation. `js/global.js` and `css/global.css` already load site-wide. `.text-meta` is a published Webflow type class; this repo does not define it. Hover targets already exist; the contract is a custom attribute on those nodes, same pattern as `gallery-column-start`.

## Goals / Non-Goals

**Goals:**

- One shared label node, reused for every marked area.
- Rubber motion and fade as independent channels (transform vs opacity).
- Init only on fine pointers with hover.

**Non-Goals:**

- Replacing the native cursor.
- Marking any specific Webflow node in this change.
- A new JS file or Footer script tag.
- GSAP or a cursor library.

## Decisions

### Attribute `custom-cursor`, not `data-custom-cursor`

Matches existing Webflow custom attrs (`gallery-column-start`). Read with `getAttribute("custom-cursor")`. Value is the literal label text.

Alternative considered: `data-custom-cursor`. Rejected — user asked `custom-cursor`, and shop already uses non-`data-` attrs.

### One node on `document.body`

Create a single `div` with classes `custom-cursor-label text-meta`, `pointer-events: none`. Toggle `.is-visible` for the fade. `textContent` from the active attribute. `cursor` CSS is never set to `none`.

Alternative considered: a label per marked element. Rejected — N nodes for a single pointer.

### rAF lerp for rubber, CSS opacity for fade

Each frame: `current += (target - current) * factor` then `translate3d`. Target is clientX/Y plus a small right/down offset so copy sits beside the arrow, not on the hotspot. Factor ~0.15; under `prefers-reduced-motion` use `1`.

Fade is `opacity` `0.3s ease` on `.custom-cursor-label`, matching other site fades. `.is-visible` sets opacity 1. Reduced motion: duration `0s`.

If the label is hidden when a marked area is entered, snap `current` to `target` before fading in so it does not fly from the last leave point.

On `pointermove`, `event.target.closest("[custom-cursor]")`. Empty value is a miss. Moving between two marks updates `textContent` and leaves `.is-visible` on.

Alternative considered: CSS `transition` on `left`/`top`. Rejected — retriggers every move and does not feel rubber. GSAP `quickTo` — new dependency.

### Skip on coarse pointer

Init only when `(hover: hover) and (pointer: fine)` matches. No node, no listeners.

### Stay in `global.js`

Site-wide, already in the Footer. No new jsDelivr tag.

## Risks / Trade-offs

- [jsDelivr pin] → New SHA in the Webflow `<link>` / `<script>`; do not rely on `@main`.
- [Attribute added before the SHA is live] → Inert; no visual change.
- [Label under mix-blend navbar] → Type color is `.text-meta`; do not add blend on the label in this change.

## Migration Plan

1. Add CSS and JS in this repo; note the behavior on `js/global.js` in `README.md`.
2. Point site-wide Head `<link>` and Footer `js/global.js` at the new commit SHA and publish.
3. In Webflow, set `custom-cursor` on the hover targets that should show a label.
4. Rollback: revert the SHA. Attributes are inert leftover.
