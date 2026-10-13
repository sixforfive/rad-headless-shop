## 1. Lights observer

- [x] 1.1 In `js/collection.js` `bindLightsObserver`, keep `lastDark` from `isDarkMode()`; in `onClass` return when `isDarkMode()` equals `lastDark`, otherwise store it and run the existing `modeToggle = true; applyModeTextures(false)`. Leave the observers and `attributeFilter` as they are.
- [x] 1.2 Check on `/` with a fine pointer: click `#lights-switch-btn` and hold the pointer on it, then toggle again with the pointer over a plane. Both crossfades finish over 0.45s.
