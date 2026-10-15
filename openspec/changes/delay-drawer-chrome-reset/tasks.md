## 1. Drawer close chrome

- [x] 1.1 In `js/global.js` `closeDrawer`, remove the immediate `setDrawerButtons(null)`
- [x] 1.2 In `js/global.js` `hideDrawerOverlay`, call `setDrawerButtons(null)` after the `activeDrawer !== null` return
