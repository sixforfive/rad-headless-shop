## Why

On `/`, `.collection-hero-logo` is already visible when the page becomes ready. `.second-menu` fades in. The logo should use that same fade.

## What Changes

`.collection-hero-logo` starts at opacity `0`. When `html.is-ready` is set it fades to opacity `1` over `0.3s` ease-out and does not move. That is the same enter fade as `.second-menu`. On leave it still fades to opacity `0` and does not move. The hero gallery still does not rise. Reduced motion still shows the logo immediately, with no fade.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `page-load-transition`: the collection logo fades in with `.second-menu` on enter. It still does not move, and it still fades out on leave.
- `collection-infinite-gallery`: the logo is no longer visible on first paint. Its fade is the page-ready fade, not a fade tied to each hero image.

## Impact

- `css/global.css` — `.collection-hero-logo` starts at opacity `0` and reaches opacity `1` on `html.is-ready`. The existing leave fade stays. Reduced motion still sets its transition duration to `0s`.
- No JS changes. No new dependencies. Webflow markup unchanged.
