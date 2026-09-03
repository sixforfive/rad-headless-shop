## Context

See proposal.md. `#quantity` is now a child of `.layer`, so it already joins `.layer.is-blend` and `body.is-full-screen .layer *`. `#add-to-cart-desktop` is a `.button` in `.layer-cta` with its own background and `pointer-events: auto`.

## Goals / Non-Goals

**Goals:**

- Repo CSS and specs match the live IDs.

**Non-Goals:**

- JS listeners, hook attributes, blending `.layer-cta`.

## Decisions

Rename the pointer-events ID. Delete the three `.layer-cta .qty-dropdown` lines instead of leaving them for a future dropdown — there is no dropdown there.

## Risks / Trade-offs

- [Archive order] → retire `qty-dropdown-fullscreen-blend` by deleting it, not archiving, so its stale deltas never merge into main specs.

## Migration Plan

1. Edit `css/global.css` as in tasks.md.
2. Delete the moot change folder.
3. Rollback: restore the three selectors and `#add-to-cart`.
