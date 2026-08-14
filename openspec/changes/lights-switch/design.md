## Context

See proposal.md for motivation. Published markup already has `#lights-switch-btn` (plus/minus in `.link-sec-brack`), shop thumbs as `.thumb-light` + `.thumb-dark` in `.thumb-img-holder`, and Webflow `.dark-mode { --_theme---… }` (not `body`-scoped). Empty dark CMS images publish as `.thumb-dark.w-dyn-bind-empty` with a placeholder SVG. `css/global.css` and `js/global.js` load site-wide; JS is Footer-only.

## Goals / Non-Goals

**Goals:**

- One apply path for load and click (class, storage, glyphs).
- Thumbs follow `body.dark-mode` in CSS so merch (light-only) needs no branch.
- First paint matches stored dark mode via a Head snippet on `html`.

**Non-Goals:**

- Following `prefers-color-scheme` for the page.
- Dual thumbs on merch or product detail galleries.
- New CMS fields or Collection List markup.
- GSAP / View Transitions.

## Decisions

### Class on `body` and `html`

User-facing contract is `body.dark-mode`. Webflow tokens are `.dark-mode { vars }`, so the same class on `html` from a Head inline script paints correctly before `body` exists. `global.js` toggles both.

Alternative considered: body-only — returning dark visitors flash light because Footer JS runs after first paint.

### Head snippet, not Footer JS, for first paint

```html
<script>
  try {
    if (localStorage.getItem("rad-lights") === "dark") {
      document.documentElement.classList.add("dark-mode");
    }
  } catch (e) {}
</script>
```

Paste in Webflow Site Settings → Custom Code → Head. Not in this repo.

### Thumbs in CSS, glyphs in JS

Stack `.thumb-dark` absolute on `.thumb-img-holder` (`position: relative` already). Crossfade `opacity`. Hide `.thumb-dark.w-dyn-bind-empty` with `display: none`. Show dark only when `body.dark-mode .thumb-dark:not(.w-dyn-bind-empty)`. `:has()` keeps light visible when dark is empty.

Plus/minus use `.is-none` as specified; `display: none` cannot fade, which is acceptable for two glyphs.

Alternative considered: `.is-none` on thumbs — kills the crossfade.

### Storage key `rad-lights`

Values `light` | `dark`. Anything other than `dark` is light.

### Favicon stays on the browser scheme

`setFavicon` and its `prefers-color-scheme` listener are untouched. Tab icon tracks browser chrome, not `body.dark-mode`.

### Fade duration matches the drawer

`0.3s ease` on `background-color`, `color`, `border-color`, and thumb `opacity`. `transition-duration: 0s` under `prefers-reduced-motion`.

## Risks / Trade-offs

- [Head snippet omitted on publish] → Dark return visits flash light. Mitigation: include the snippet in tasks; tokens still work after JS runs.
- [jsDelivr cache] → New SHA in the Webflow `<link>` / `<script>` (see `rad-workflow-scripts.md`); do not rely on `@main`.
- [`:has()`] → Supported in current browsers; merch without `.thumb-dark` simply never matches the hide-light rule.

## Migration Plan

1. Add CSS and JS in this repo.
2. Paste the Head snippet in Webflow.
3. Point site-wide Head `<link>` and Footer `<script>` at the new commit SHA and publish.
4. Rollback: revert SHA and remove the Head snippet; markup stays. Stored `rad-lights` is harmless leftover.
