## 1. Hero CSS

- [x] 1.1 In `css/global.css`, next to the thumb block: stack `.hero-photo-dark` on `.collection-hero-photo`, crossfade opacity with `body.dark-mode`, override `.hero-photo-dark.is-none` so it can show, keep `.hero-photo-light` when dark is empty (`:has()`)
- [x] 1.2 Add `.hero-photo-light` and `.hero-photo-dark` to the `prefers-reduced-motion` duration `0s` list

## 2. Publish

- [ ] 2.1 Point the site-wide Head `<link>` for `css/global.css` at the new commit SHA and publish
