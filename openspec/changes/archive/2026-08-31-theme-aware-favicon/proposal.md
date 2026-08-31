## Why

A single favicon is invisible on one of the two browser chrome themes: black on dark tabs, white on light tabs. The two RAD icons already exist on the Webflow CDN; the tab should follow the OS/browser color scheme.

## What Changes

- Site-wide JS in `js/global.js` sets the document favicon from `prefers-color-scheme`: light → black icon, dark → white icon.
- The favicon updates when the OS theme changes while the tab is open.
- Webflow `apple-touch-icon` / webclip is unchanged.

## Capabilities

### New Capabilities

- `favicon`: Tab icon follows `prefers-color-scheme` using the two Webflow CDN PNGs.

### Modified Capabilities

- None.

## Impact

- `js/global.js` (already loaded on every page via Webflow Footer custom code).
- Overrides the `rel="icon"` / `rel="shortcut icon"` link Webflow injects from Site Settings.
- No new dependencies. No Webflow CMS or Shopify changes.
