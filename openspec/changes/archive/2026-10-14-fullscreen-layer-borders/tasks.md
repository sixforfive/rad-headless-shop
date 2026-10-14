## 1. CSS

- [x] 1.1 In `css/global.css`, delete `body.is-full-screen { color: #fff }` and `body.is-full-screen, body.is-full-screen * { border-color: #fff !important }`; add `body.is-full-screen .layer * { color: #fff !important; border-color: #fff !important }`

## 2. Check

- [x] 2.1 Open the product gallery on desktop: `.layer` descendants are `#fff` text and borders; navbar / chrome outside `.layer` stay on theme tokens. Close: layer chrome restores. Repeat on merch detail.
