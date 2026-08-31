## Purpose

Sets the browser tab favicon from the OS/browser color scheme so the RAD mark stays visible on both light and dark chrome.

## ADDED Requirements

### Requirement: Favicon follows color scheme

The site SHALL set the document favicon to the light-theme icon when `prefers-color-scheme` is `light`, and to the dark-theme icon when `prefers-color-scheme` is `dark`.

- Light-theme icon: `https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7dc0759cccd58e2b9cd738_fav_light.png`
- Dark-theme icon: `https://cdn.prod.website-files.com/6a4bd14da2579cbf8be38a10/6a7dc0753a43cc0b6b1bac60_fav_dark.png`

The site SHALL NOT change `apple-touch-icon` or webclip links.

#### Scenario: Light theme

- **WHEN** the browser reports `prefers-color-scheme: light`
- **THEN** the document favicon href is the light-theme icon URL

#### Scenario: Dark theme

- **WHEN** the browser reports `prefers-color-scheme: dark`
- **THEN** the document favicon href is the dark-theme icon URL

### Requirement: Favicon updates when the scheme changes

The site SHALL update the document favicon when `prefers-color-scheme` changes while the page is open.

#### Scenario: Live OS theme switch

- **WHEN** the user switches OS/browser theme from light to dark (or dark to light) with the tab still open
- **THEN** the document favicon href updates to the matching icon URL
