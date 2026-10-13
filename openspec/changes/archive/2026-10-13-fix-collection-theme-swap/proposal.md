## Why

On `/`, clicking `#lights-switch-btn` no longer swaps the hero thumbs between light and dark. The dot cursor rewrites `is-dot-cursor` on `html` every frame while the pointer is over a `cursor: pointer` element, and the lights switch is one. `bindLightsObserver` treats every `html`/`body` class mutation as a lights toggle, so the texture crossfade restarts each frame and never advances.

## What Changes

- In `js/collection.js`, `bindLightsObserver` acts only when `body.dark-mode` has changed since the last run. Other class mutations on `html` or `body` are ignored.
- `js/global.js` and the dot cursor stay as they are.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `collection-infinite-gallery`: the texture swap runs only on a real lights change, not on unrelated `html` or `body` class changes.

## Impact

- `js/collection.js` — `bindLightsObserver`.
- `js/global.js`, `css/global.css`, Webflow markup: untouched.
- No new dependencies. The lights toggle contract (`body.dark-mode`, `rad-lights`) stays.
