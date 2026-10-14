## 1. Logo enter fade

- [x] 1.1 In `css/global.css`, set `.collection-hero-logo` to `opacity: 0`. Do not set `transform`
- [x] 1.2 Add `html.is-ready .collection-hero-logo { opacity: 1 }` before the existing `html.is-leaving .collection-hero-logo` rule. Leave that leave rule where it is
- [x] 1.3 Update the comment above the page-fade rules so it says the logo fades in on enter and does not move
