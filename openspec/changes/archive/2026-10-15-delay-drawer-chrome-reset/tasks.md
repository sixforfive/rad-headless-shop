## 1. Drawer close chrome

- [x] 1.1 In `js/global.js` `closeDrawer`, remove the immediate `setDrawerButtons(null)`
- [x] 1.2 In `js/global.js` `fadeDrawerOut`, call `setDrawerButtons(null)` in the same turn as removing `is-visible`
