## 1. CSS delay

- [x] 1.1 In `css/global.css`, on `.notification-item`, add `animation-delay: var(--rad-marquee-delay, 0s)`. Leave `notification-marquee 30s linear infinite` and the keyframes

## 2. Save playhead

- [x] 2.1 In `js/global.js`, on `pagehide`, when `.notification-item` has a width, write `sessionStorage` key `rad-notification-marquee` as JSON `{ p, at, r }`. `p` is `(-translateX) / (width / 3)` wrapped into `0..1` from the computed transform. `at` is `Date.now()`. `r` is the `notification-marquee` `playbackRate`, or `1`. Catch storage failures. Do not seek the animation in this file. Do not write from `radLeaveTo` or `resetDrawerState`

## 3. First paint

- [ ] 3.1 Paste the Head snippet from `design.md` into Webflow Site Settings → Custom Code → Head
