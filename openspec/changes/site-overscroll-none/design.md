## Context

See proposal.md for motivation. All of this lives in `css/global.css`.

Today:

- `html { background-color: var(--_theme---background--primary); }` paints the canvas when Chrome bounces (white otherwise).
- `html:has(.section_home-page), body:has(.section_home-page)` locks Collection (`height: 100dvh; overflow: hidden; overscroll-behavior: none`). That was for `.layout` at `100vh` vs `.section_home-page` at `100dvh` — extra real scroll on iOS, not rubber-band.
- `body::before` is a `position: fixed` theme fill so `mix-blend-mode: difference` still has a painted backdrop while Chrome rubber-bands (the canvas is composited under the blend group).
- `body.is-scroll-locked { overflow: hidden; }` is the drawer.

Webflow already has `.layout` and `.section_home-page` at `height: 100dvh`. Confirmed on Collection.

## Goals / Non-Goals

**Goals:**

- One overscroll rule for the whole site.
- Delete bounce-only CSS so rollback is a small, obvious restore.
- Keep Collection matching the visual viewport via Webflow `100dvh`, not a repo overflow lock.

**Non-Goals:**

- Changing `.layout` / `.section_home-page` in Webflow.
- JS touch-scroll hacks or an inner scroll root.
- Changing mix-blend rules on navbar / `.layer.is-blend`.
- Changing drawer scroll lock.

## Decisions

### `overscroll-behavior: none` on both `html` and `body`

The scrolling root is `html` in some browsers and `body` in others. Set both. Do not use `overflow: hidden` on `html`/`body` site-wide — that would stop shop/product/merch from scrolling.

Alternative considered: Collection-only lock, already in the file. Rejected: bounce is site-wide; `.layout` is already `100dvh`.

### Drop the Collection `:has(.section_home-page)` block

With `.layout` at `100dvh`, the `vh − dvh` extra scroll is gone. `overscroll-behavior` on `html`/`body` covers bounce. Do not keep a leftover homepage overflow lock.

### Drop `body::before`

It existed so difference blend had a fixed paint layer during bounce. Kill bounce, drop the layer. Html theme background stays as the blend canvas at rest.

If chrome goes white/wrong after this, restore `body::before` only — do not bring back the Collection lock for that.

### Keep html background; retitle the comment

It is the theme canvas, not an overscroll workaround. Leave the property.

## Risks / Trade-offs

- [iOS Safari still bounces on non-overflowing pages] → `overscroll-behavior` is the CSS contract; no JS polyfill in this change. If Collection bounces anyway, restore overflow lock only after confirming it is bounce, not extra height.
- [Difference blend wrong without `body::before`] → Restore that rule only. Html canvas should be enough at rest.
- [jsDelivr pin] → Site uses a pinned SHA; this CSS does not show until that pin moves.

## Migration Plan

1. Edit `css/global.css` as in tasks.md.
2. Point the site-wide Head `<link>` at the new commit SHA and publish Webflow when you want it live.
3. Rollback: revert the commit (or restore the Collection lock + `body::before` and drop `overscroll-behavior` from `html`/`body`). Webflow `100dvh` on `.layout` is independent — leave it unless you also want the old `100vh` height back.
