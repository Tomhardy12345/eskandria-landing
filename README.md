# Eskandria — Landing Page Handoff

Production-ready static HTML/CSS/JS for the Eskandria restaurant landing page.
Unlike a typical design-reference handoff, **these files are meant to be used
directly** — plain HTML/CSS/vanilla JS, no build step, no framework
dependency. Open `index.html` in a browser and it works.

## Files

- `index.html` — full page markup, all copy in EN + DE (toggle switches which is shown)
- `styles.css` — all styling, using CSS custom properties for the design tokens
- `script.js` — language toggle + GSAP ScrollTrigger scroll animations

## Fidelity

High-fidelity. Colors, type, spacing and component shapes are final. The one
open item is imagery — every photo/video is a labeled placeholder (see
"Assets needed" below).

## Structure — "Chapters"

The page is built as a sequence of full-viewport chapters (`<section class="chapter">`,
each `min-height: 100vh`), styled after cinematic long-scroll sites (e.g.
otsuka-air.jp) but rendered in this project's Industry wireframe visual
system. Each chapter has an `id` and `data-screen-label` for reference:

| id | Chapter |
|---|---|
| `hero` | Hero — headline, CTAs, hero image |
| `story` | 01 — From Alexandria to Germany (brand origin) |
| `philosophy` | 02 — Our Food, Our Story (3-cell philosophy) |
| — | Interlude — pull quote |
| `dishes` | 03 — Signature Dishes (4-row spec plate) |
| `more-than-a-restaurant` | 04 — split intro + 4-cell extras (events, halal, games, buffet) |
| `visit` | 05 — Visit Us (address/hours/contact + map) |
| `reserve` | 06 — Reservations close + footer |

## Design tokens (`styles.css` `:root`)

\`\`\`
--color-bg: #f2f2f3        paper ground
--color-text: #1d1f20
--color-accent: #5980a6    steel blue — the one accent
--color-accent-600/700/900 hover / pressed / dark-field steps
--color-divider: rgba(29,31,32,.16)
--font-heading: "Barlow Condensed" (600) — all headings, uppercase
--font-body: "Barlow" (400/500/600) — body copy
--leading: 24px             base vertical rhythm unit
--edge: clamp(20px,5vw,72px) page gutter
\`\`\`

Fonts load from Google Fonts in `<head>`. Self-host if required.

## Visual language

- Square corners everywhere — no `border-radius` except explicit `0`.
- Cards/figures/the signature-dishes plate are hairline-bordered line
  drawings with 4 corner "+" registration marks (`.corner.tl/tr/bl/br`)
  — never filled. The primary button (`.btn-primary`) is the one solid
  accent-filled object on the page, by design.
- The hero uses the dark `--color-accent-900` field with reversed (light)
  type — the system's one sanctioned "dark section."
- Photography wrapped in `.blueprint.duotone` is meant to be desaturated
  and tinted toward the accent blue once real photos are in (see below).

## i18n (EN/DE)

No i18n library — every piece of copy is duplicated inline:

\`\`\`html
<span data-en-only>English copy</span>
<span data-de-only>Deutsche Kopie</span>
\`\`\`

`script.js` sets `data-lang="en"|"de"` on `<html>`; CSS
(`[data-lang="en"] [data-de-only] { display:none }` and the inverse) shows
only the active language. Persisted to `localStorage`. To add Arabic:
duplicate the pattern with `data-ar-only` + a third toggle state.

## GSAP scroll animations (`script.js`)

GSAP 3 + ScrollTrigger loaded from CDN in `index.html` — pin exact versions
before shipping. What's wired up:

- **Hero entrance**: eyebrow → headline lines → subhead → CTAs, staggered
  timeline on load.
- **Hero parallax**: `[data-gsap-parallax]` (the hero figure) drifts via
  `scrub: true` as the hero scrolls past.
- **Chapter reveal**: any `[data-gsap="chapter"]` fades + rises in when it
  enters the viewport (`ScrollTrigger start: 'top 85%'`).
- **Staggered groups**: `[data-gsap-stagger]` wraps a set of `.gsap-reveal`
  children (dish rows, feature cells) and staggers their reveal.
- Respects `prefers-reduced-motion` (animations are skipped, content is
  just shown).
- Progressive enhancement: `.gsap-reveal` elements are only hidden once
  `.js-ready` is added to `<html>` (after GSAP loads) — no FOUC/invisible
  content if JS fails.

Extension notes are commented at the bottom of `script.js` (video hero,
scroll-reactive nav, pinned chapters).

## Cross-browser & performance hardening

Applied on top of the original handoff, still using only plain CSS/vanilla JS:

- **Mobile viewport bug**: `.chapter` (and the `.chapter-60`/`-70`/`-auto`
  modifier classes that replaced the old per-section inline `min-height`
  styles) use `100dvh` with a `100vh` fallback, so chapters don't clip or jump
  when the mobile Safari/Chrome address bar shows/hides mid-scroll.
- **`ScrollTrigger.config({ ignoreMobileResize: true })`** in `script.js` stops
  that same address-bar resize from being treated as a real resize and
  re-triggering/replaying reveals; genuine orientation changes still refresh
  normally.
- **Font-swap layout shift**: `script.js` calls `ScrollTrigger.refresh()` once
  `document.fonts.ready` resolves, so trigger start positions (`top 85%`)
  match the page after Barlow/Barlow Condensed finish loading, not before.
- **`aspect-ratio` fallback**: an `@supports not (aspect-ratio: 1 / 1)` block
  in `styles.css` keeps `.hero-figure`/`.split-figure`/`.map-figure` open via
  the padding-bottom trick for older engines (e.g. Safari <15).
- **Perf**: `preconnect` to `cdnjs.cloudflare.com` + `preload` hints for the
  two GSAP files, and `defer` on all three `<script>` tags, so script fetch
  starts without blocking parsing. Add SRI `integrity`/`crossorigin` once
  you've verified the hashes for the pinned GSAP version (e.g. via
  srihash.org) — not added here since they couldn't be verified in this pass.
- Each `.media-placeholder` now has a comment with the recommended
  `loading`/`decoding`/`fetchpriority` attributes for the eventual `<img>`/
  `<video>` swap (hero stays eager since it's the LCP element; everything
  else should lazy-load).

## Assets needed

Every `.media-placeholder` div marks a spot for a real photo/video:

- Hero (`#hero`) — video or photo, Alexandria coastline or the kitchen
- Story (`#story`) — restaurant interior or founder photo
- More Than a Restaurant — group dinner / celebration photo
- Visit (`#visit`) — a map (static image or embed) for Medebacher Weg 24, 13507 Berlin

Swap the `<div class="media-placeholder">` for an `<img>`/`<video>`,
keeping the parent `.blueprint.duotone` wrapper and the 4 `<i class="corner …">`
marks so the frame stays consistent.

## Known follow-ups

- No real booking/ordering system yet — all CTAs are `tel:`/`mailto:` links.
- Map is a placeholder; swap for a static export or embed once you have a
  Google/OSM API key and privacy sign-off for a live embed.
- Arabic support is scoped out of this build (see i18n note above).