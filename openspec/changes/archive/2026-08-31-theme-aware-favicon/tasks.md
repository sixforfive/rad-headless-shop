## 1. Favicon swap

- [x] 1.1 Add `matchMedia("(prefers-color-scheme: dark)")` in `js/global.js`: set `link[rel="icon"]` / `link[rel="shortcut icon"]` href to the light PNG when light, dark PNG when dark; listen for `change` so a live OS switch updates the tab
- [x] 1.2 Update the `global.js` file-header comment to document the favicon behavior
