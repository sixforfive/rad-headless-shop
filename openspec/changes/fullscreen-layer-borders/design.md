## Context

See proposal.md for motivation. Today `css/global.css` has `body.is-full-screen { color: #fff }` and `body.is-full-screen, body.is-full-screen * { border-color: #fff !important }`. `.navbar`, drawers, and `.gallery-full-screen` are siblings of `.layer`. Open at ≤767px sets `.layer.is-none`. Webflow paints `color` and `border-color` on descendants with theme tokens.

## Goals / Non-Goals

**Goals:**

- Scope both `#fff` text and `#fff` borders to `.layer` descendants.
- Keep `!important` so Webflow combo classes inside the layer still lose.

**Non-Goals:**

- White chrome on `.layer` itself, navbar, drawers, or the full-screen image list.
- JS or Webflow structure.
- Sold-out X, outlines, box-shadows.

## Decisions

### `body.is-full-screen .layer * { color: #fff !important; border-color: #fff !important }`

Children of `.layer` only. Delete the body color rule and the document-wide border pair. `!important` on both: `.button.is-secondary` beats a class-plus-element selector for color the same way it did for borders.

Alternative considered: keep `color` on `body` (inheritance). Rejected: user asked to limit font color to `.layer` children; Webflow also token-paints `color` on descendants so body color does not reach chrome anyway.

Alternative considered: include `.layer` itself. Rejected: the request is children only.

## Risks / Trade-offs

- [Mobile open hides `.layer`] → white text/borders do not show at ≤767px. Accepted.
- [jsDelivr pin] → CSS does not go live until the Head `<link>` SHA moves.

## Migration Plan

1. Edit `css/global.css` as in tasks.md.
2. Point the site-wide Head `<link>` at the new commit SHA and publish Webflow when you want it live.
3. Rollback: restore `body.is-full-screen { color: #fff }` and the document-wide border rule.
