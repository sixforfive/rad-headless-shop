## 1. Hero CSS

- [x] 1.1 In `css/global.css`, next to the thumb block: stack `.hero-photo-dark` on `.collection-hero-photo`, fade only that overlay with `body.dark-mode`, override `.hero-photo-dark.is-none` so it can show, leave `.hero-photo-light` opaque
- [x] 1.2 Add `.hero-photo-dark` to the `prefers-reduced-motion` duration `0s` list
- [x] 1.3 In `css/global.css`, fade only `.thumb-dark`; leave `.thumb-light` opaque; drop `.thumb-light` from the reduced-motion list

## 2. Publish

- [ ] 2.1 Point the site-wide Head `<link>` for `css/global.css` at the new commit SHA and publish
