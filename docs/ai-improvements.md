# Portfolio improvements

Ten improvements for arielplascencia.com, ranked by impact for a hiring / freelance audience.
Produced on 2026-09-17 by four parallel audit agents (SEO & content, accessibility & UX,
code quality & DX, performance) reading the codebase after the fire/power/AI redesign
(commit `b122d8f`). Implementation status as of the follow-up pass is tracked in the table
below and in the **Status** line under each item.

| #   | Improvement                                                                               | Area        | Effort | Impact | Status                |
| --- | ----------------------------------------------------------------------------------------- | ----------- | ------ | ------ | --------------------- |
| 1   | Ship a real `<head>`: OG/Twitter cards, canonical, JSON-LD, robots + sitemap, fixed title | SEO         | S      | High   | Done                  |
| 2   | Replace invented credibility signals with verifiable ones                                 | Content     | S–M    | High   | Done, copy is a draft |
| 3   | Turn project cards into mini case studies                                                 | Content     | M      | High   | Code done, needs data |
| 4   | CTA hierarchy, contact form, tracked events, self-hosted resume                           | Conversion  | M      | High   | Done, needs env + PDF |
| 5   | Fix primary CTA contrast (1.7:1 → AA)                                                     | A11y        | S      | High   | Done                  |
| 6   | Fix three sukuna-ui gaps upstream and delete the workarounds                              | Code / A11y | M      | Medium | Interim done, lib TBD |
| 7   | Full reduced-motion coverage plus keyboard polish                                         | A11y        | S      | Medium | Done                  |
| 8   | Make the animations cheap: gate canvases, bake the glow, fix the paint pipeline           | Perf        | M      | High   | Done                  |
| 9   | Faster first paint: drop the 31 kB Base UI stack, self-host fonts, prerender              | Perf        | S–M    | Medium | Done except prerender |
| 10  | Safety net and DX: CI, tests, shared hooks, typed config, real README                     | DX          | M      | Medium | Done                  |

Effort: S = under 2 hours, M = half a day to a day, L = multiple days.

---

## 1. Ship a real `<head>`

**Status.** Done: new title, description, canonical, OG/Twitter tags, JSON-LD Person, `public/og.png` (generated), `robots.txt`, `sitemap.xml`. Deploy to make it live.

**Why.** Every share on LinkedIn, WhatsApp or X renders as a bare link with no image or
description. Search engines get no canonical, no entity data and no crawl hints. The
LinkedIn preview is often the first impression a recruiter gets, and right now it is empty.
The live site is also behind the repo: `curl https://arielplascencia.com/` returned only
`charset`, `viewport`, `theme-color` and the title at audit time, and `robots.txt` and
`sitemap.xml` both 404.

**Evidence.** `index.html:2-19` has no `og:*`, `twitter:*`, `canonical` or JSON-LD.
`public/` holds only `favicon.svg` and `icons.svg`. The title "Ariel Plascencia -- Portafolio"
mixes English content with a Spanish noun and is set twice (`index.html:18`, `src/App.tsx:16`).

**Do.**

- Title: `Ariel Plascencia — Full-Stack Developer (React, Next.js, TypeScript)`. Set it once
  (drop the `document.title` effect in `App.tsx`).
- Add `canonical`, `og:type/url/title/description/image`, `og:locale=en_US`,
  `twitter:card=summary_large_image` and matching `twitter:*` tags.
- Add a JSON-LD `Person` block: `name`, `url`, `jobTitle`, `email`, `sameAs` (GitHub, LinkedIn),
  `worksFor` (The Shift Network), `knowsAbout` (from `config.skills`), `address.addressCountry: MX`.
- Export `public/og.png` (1200×630) from the hero. The unused `src/assets/hero.png` can be the base.
- Add `public/robots.txt` and a one-URL `public/sitemap.xml`.
- Redeploy so the description in `index.html` actually ships.

## 2. Replace invented credibility signals

**Status.** Done in code: stats are derived from config, skill percentages are gone (grouped chips instead), dead `avatarUrl`/`tagline` fields and unused assets removed. **Needs you:** the About paragraph is a draft written from your experience entries (marked `TODO(ariel)` in the config); confirm `location`; decide which GitHub account is canonical (`arielplas` in socials vs `imariel2d` on the Chess Analysis repo).

**Why.** Hiring managers pattern-match hard against template portfolios. "Hi! I'm a passionate
developer…", "15+ happy clients", "100% powered by caffeine" and "TypeScript 95%" read as filler
and lower trust, especially next to a real six-year work history that is more impressive than
the fake numbers. Percent skill bars are unfalsifiable and widely mocked in dev hiring.

**Evidence.** Generic About copy at `src/config/portfolio.config.ts:47-50`. Hard-coded `STATS`
at `src/components/About.tsx:9-14`. Invented `skillLevels` at `portfolio.config.ts:75-84`
rendered as "Power levels" with a fake `sys.diagnostics --live` label at
`src/components/Skills.tsx:85-107`. Unused octocat `avatarUrl` at `portfolio.config.ts:51`.
GitHub handle mismatch: socials link `github.com/arielplas` (line 55) but the Chess Analysis
repo is under `github.com/imariel2d` (line 107).

**Do.**

- Rewrite `about` as three concrete sentences: current role and since when, specialty
  (Next.js/TypeScript product work plus AI-assisted internal tooling), location and time zone,
  what you are open to (full-time, contract, remote).
- Derive stats from data: years from `experience[last].period` (Oct 2019 → "6+ years"),
  `projects.length`, `experience.length`. Drop the caffeine line.
- Replace `skillLevels` with grouped skills (`Core`, `Backend & Data`, `Tooling & AI`) or bind
  the sukuna-ui `Progress` to something defensible like years used. Rename "Power levels".
- Pick one GitHub account and use it everywhere. Wire `avatarUrl` to a real headshot or delete it.

## 3. Turn project cards into mini case studies

**Status.** Code done: `Project` has optional `role`, `stack`, `year`, `outcome` and `image`, and the card renders each when present. `role` is filled where the description already said it. **Needs you:** screenshots in `public/projects/` (800×500), outcomes, years, a real Duckstore description, and a visitor-friendly name for the "Tepache Projects" category.

**Why.** Projects are the only place a client can judge real output, but each card is one
sentence, a flame icon and tags. "Duckstore: Online shopping project." linking to Instagram
tells a buyer nothing. Screenshots plus role, stack and outcome is the single biggest lever
for freelance conversion, and it surfaces Mexican fintech and legal-tech domain expertise
(Centavos, Dolar en Bancos, Es Legal Mi Trabajo).

**Evidence.** `Project` type at `portfolio.config.ts:7-14` has no `image`, `role`, `stack`,
`outcome` or `year`. `ProjectCard` at `src/components/Projects.tsx:11-76` renders only icon,
title, description and tags. The "Tepache Projects" category label is never explained.

**Do.**

- Extend `Project` with `image` (`public/projects/<slug>.webp`, 800×500), `role`, `stack`,
  `year` and optional `outcome` (one measurable line, or scope such as "0 → 1 MVP in 6 weeks").
- Render `<img loading="lazy">` at the top of the card, role/year in a mono caption, outcome
  highlighted above the tags.
- Rename "Tepache Projects" to something a visitor understands, e.g. "Tepache Studio (agency work)".
- Give Duckstore a real description or drop it.
- Later: a `caseStudyUrl` per project pointing to `/projects/:slug`, which also gives search
  engines more than one URL.

## 4. CTA hierarchy, contact form, tracked events, self-hosted resume

**Status.** Done: every CTA is a real link and fires a Vercel Analytics event through `src/lib/analytics.ts`; the hero is now primary "See my work", secondary "Contact me", ghost "Resume"; Navbar "Hire me" scrolls to the form; the Contact section is a form (name, email, intent, message, honeypot) posting to `api/contact.ts` (Resend) with a mailto fallback. **Needs you:** set `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` on Vercel (until then the form falls back to mailto), and commit the CV PDF then update the resume URL (`TODO(ariel)` in config).

**Why.** Every CTA on the page (Hire me, Get in touch, Say hello, both email links) opens the OS
mail client, which often fails silently on desktop, and there is zero data on which one converts.
Nothing distinguishes "recruiter with a role" from "client with a project", and there is no
lower-commitment option such as a call link.

**Evidence.** `mailto:` handlers at `Navbar.tsx:20-22`, `Hero.tsx:132-141`, `About.tsx:76-82`,
`Contact.tsx:31-44`. Hero has three same-weight buttons at `Hero.tsx:118-142`.
`@vercel/analytics` is mounted in `App.tsx` but `track()` is never called. The resume is a
Google Drive link (`portfolio.config.ts:57-61`), which risks "request access", is not indexable
and cannot be tracked as a download.

**Do.**

- `src/lib/analytics.ts` exporting `trackCta(name)` wrapping `track()`; call it from every CTA
  and from project live/repo links.
- Replace the single "Say hello" button with a short form (name, email, intent select, message)
  posted to `api/contact.ts` on Vercel forwarding to Resend or Web3Forms. Keep `mailto:` as a
  secondary text link.
- Hierarchy: hero primary "See my work", secondary "Book a 20-min call" (Cal.com) or "Contact me"
  (scrolls to form), tertiary resume and socials as icons. Navbar "Hire me" scrolls to `#contact`.
- Make the "Available for work" badge specific via a new `availability` config field.
- Commit `public/Ariel-Plascencia-CV.pdf` and point the resume link at it.

## 5. Fix primary CTA contrast

**Status.** Done in `src/index.css`: dark `--sk-on-accent`, gradient trimmed to the three light stops, `--sk-text-faint` raised, accent Badge text overridden.

**Why.** The highest-value text on the site fails WCAG 1.4.3. Near-white `--sk-on-accent`
(#fff7ed) sits on the orange gradient; two of the three stops are below 3:1.

| Foreground         | On #ffb347 | On #ff5a1f | On #c9220f |
| ------------------ | ---------- | ---------- | ---------- |
| #fff7ed (current)  | 1.68       | 2.94       | 5.32       |
| #1a0a05 (proposed) | 10.8       | ~7         | 3.4        |

Other tokens are fine: `--sk-text-dim` is above 7.7:1 everywhere. `--sk-text-faint` (#8a776e)
is 4.36:1 on `surface-2`, a narrow fail; `#9a877d` passes everywhere with no visible change.

**Evidence.** `src/index.css:18,25`. Affects `Hero.tsx:119`, `Navbar.tsx:54,90`,
`Contact.tsx:31`, the active tab at `Projects.tsx:116-131`, accent Badges at
`Projects.tsx:69` and `Experience.tsx:62`.

**Do.** In `src/index.css`:

```css
--sk-on-accent: #1a0a05;
--sk-gradient-accent: linear-gradient(135deg, #ffb347 0%, #ff7a2a 55%, #ff5a1f 100%);
--sk-text-faint: #9a877d;
```

The accent Badge hard-codes `text-text` in the library, so add
`.bg-gradient-accent.text-text { color: var(--sk-on-accent) }` or pass `className="text-void"`.

## 6. Fix three sukuna-ui gaps upstream and delete the workarounds

**Status.** Interim done here: `LinkButton` replaces every navigating Button, the tab strip has full WAI-ARIA semantics (roving tabindex, arrow keys, `aria-controls`, `tabpanel`), card titles are `h3`, and `Progress`/`Tooltip` are no longer used at all. **Needs you:** the three library changes in the sukuna-ui repo (export Tabs, Button `render` prop, Progress `tone`).

**Why.** You own the library, so each hack in this repo is one small upstream change away
from disappearing. Each hack also couples the site to internals that can change on any `0.x`
minor. Two of them are accessibility bugs today.

**Evidence.**

- **Tabs is built but not exported.** `README.md:85` lists it, `dist/components/tabs/` exists,
  `dist/index.d.ts` has no `Tabs` line. Result: `Projects.tsx:110-140` hand-rolls
  `role="tablist"`/`role="tab"` with no `tabpanel`, no `aria-controls`, no roving `tabIndex`
  and no arrow-key navigation. Screen readers are told "tab 1 of 2" and then find no panel.
- **Button cannot render as a link.** `ButtonProps` is `ComponentPropsWithoutRef<'button'>`
  with no `render`/`as`. Every navigation is an `onClick` (`Hero.tsx:119,127,136`,
  `Navbar.tsx:20`, `Contact.tsx:35`), losing middle-click, ctrl-click, hover URL, copy-link
  and the link role.
- **Progress indicator restyled through DOM-shape selectors.** `Skills.tsx:47` uses
  `[&>div>div]:bg-gradient-accent` and a dead `[data-slot=indicator]` selector (no
  `data-slot` exists in the dist).

**Do (sukuna-ui).**

1. `export { Tabs, type TabItem, type TabsProps }` from `src/index.ts`. Add `classNames` so the
   glass-pill look survives.
2. Support Base UI's `render` prop on `Button` (the README already uses it for `Dialog.Close`):
   `<Button render={<a href="#projects" />}>View my work</Button>`.
3. `Progress`: add `tone?: 'accent' | 'gradient' | 'premium'` and `classNames.indicator`, plus
   `data-slot` attributes.

**Do (this repo, after bumping).** Replace the tab strip with `<Tabs>`, replace every navigating
`Button` with `render={<a …/>}`, and reduce `Skills.tsx:47` to
`<Progress tone="gradient" classNames={{ indicator: 'duration-1000' }} />`. Also change project
card titles from `h4` to `h3` (`Projects.tsx:54`) to fix the heading skip.

Interim, before the library ships: a local `LinkButton` that renders an `<a>` with the button
class string, and keyboard handling on the tablist (ArrowLeft/Right, Home/End, roving `tabIndex`,
`aria-controls` and a `role="tabpanel"` on the grid).

## 7. Full reduced-motion coverage plus keyboard polish

**Status.** Done: `useReducedMotion` hook gates the typewriter, count-up and reveals; CSS disables ping/bounce/pulse and smooth scroll; skip link, `scroll-margin-top`, Escape + focus return and `aria-controls` on the mobile menu, larger icon hit areas, global `a:focus-visible` outline.

**Why.** The site is motion-heavy. Users who ask for reduced motion still get infinite ping and
bounce, a typewriter rewriting text every 90 ms, count-up numbers, smooth scrolling and slide-in
reveals (WCAG 2.3.3, 2.2.2). Keyboard users must tab through eight header controls before
reaching content, and the mobile menu cannot be dismissed with Escape.

**Evidence.** `index.css:279-291` only covers the custom keyframes. Not covered: `animate-ping`
(`Experience.tsx:44`, `Skills.tsx:97`), `animate-bounce` (`Hero.tsx:161`), smooth scroll
(`index.css:43`, `Hero.tsx:53`), `Reveal.tsx:35-37`, the CountUp loop (`About.tsx:28-36`) and
the typewriter (`Hero.tsx:11-36`). No skip link in `App.tsx`. No `scroll-margin-top` for the
64 px fixed header. `Navbar.tsx:59-64` toggle lacks `aria-controls`; the menu has no Escape
handler and does not return focus.

**Do.**

- CSS: under `prefers-reduced-motion`, set `html { scroll-behavior: auto }` and disable
  `.animate-ping, .animate-bounce, .animate-pulse`.
- A `useReducedMotion` hook (`useSyncExternalStore` on the media query) used by Hero (show
  the first word, no typewriter), CountUp (jump to target), Reveal (always visible) and the
  scroll helper (`behavior: 'auto'`).
- Skip link as the first child of `App`, `<main id="main" tabIndex={-1}>`, and
  `section[id] { scroll-margin-top: 5rem }`.
- Navbar: `aria-controls="mobile-menu"`, label "Open menu"/"Close menu", Escape closes and
  returns focus to the toggle.
- Small wins: `p-2 -m-2` on the 20 px icon links for touch targets, `aria-hidden` on the scroll
  chevron and the logo underscore, a global `a:focus-visible` outline in `@layer base`.

## 8. Make the animations cheap: gate the canvases, bake the glow, fix the paint pipeline

**Status.** Done: both canvases draw pre-rendered glow sprites (no `shadowBlur`), run only while intersecting and the tab is visible, cap DPR at 1.5, debounce resize; NeuralNet batches links into seven stroke calls and caps nodes at 90; scanlines lost `mix-blend-mode`; navbar blur is 8 px; `pulse-glow` animates pseudo-element opacity; `text-fire` sweeps three times then settles.

**Why.** This is the dominant runtime cost. On a 1920×1080 laptop the hero spawns about 230
embers and Contact about 125; each one does a `fill()` with `shadowBlur` set, which is a
Gaussian blur pass per draw call on a backing store up to 4× the CSS pixels. All three
canvases run at 60 fps even when scrolled out of view. On top of the canvas, several
paint-phase effects force the browser to re-blend or repaint the whole hero every frame,
which is why scrolling feels heavy on integrated GPUs.

**Evidence.**

- `FireParticles.tsx:102-105` sets `shadowBlur = 12` per ember; `:62` caps DPR at 2 (4× fill
  area for a decorative layer); `:113,138` run `requestAnimationFrame` unconditionally with no
  `IntersectionObserver`. `NeuralNet.tsx:119-122` does the same per node and allocates a
  template-string `strokeStyle` per node pair at `:82-93`.
- Neither `resize` handler is debounced (`FireParticles.tsx:61-70`, `NeuralNet.tsx:46-62`),
  and mobile URL-bar show/hide fires it.
- `index.css:245-257`: `.scanlines::after` covers the whole hero with `mix-blend-mode: overlay`.
- `index.css:190-193`: the fixed header's `backdrop-filter: blur(14px)` re-samples the
  animating canvas every frame once scrolled.
- `index.css:76-83`: `pulse-glow` animates `box-shadow` (non-composited) on the hero badge and
  primary button, forever.
- `index.css:85-95,175-182`: `.text-fire` animates `background-position` with a two-layer
  `text-shadow` on the `<h1>`, which is the LCP element, so it repaints every frame.

**Do.**

- Pre-render one radial-gradient glow sprite on an offscreen canvas and `drawImage` it per
  particle instead of `shadowBlur`. Typically a 5–10× draw-cost reduction.
- Gate each loop with an `IntersectionObserver` on the canvas (start `rAF` when intersecting,
  cancel otherwise). Cap DPR at 1.5. Debounce `resize`.
- NeuralNet: compare squared distances before `hypot`, batch links into two `beginPath` groups
  by quantized alpha, hoist `strokeStyle` out of the pair loop.
- Drop `mix-blend-mode` from the scanlines (a low-alpha overlay looks the same). Lower the
  navbar blur to 8 px or apply `.glass` only after scrolling past the hero.
- `pulse-glow`: animate `opacity` of a `::after` pseudo-element that owns the shadow.
- `text-fire`: run the gradient shift once on load instead of infinitely.
- `canvas[aria-hidden] { will-change: transform; contain: strict }`.

## 9. Faster first paint: shrink the bundle, self-host fonts, prerender

**Status.** Done except prerender: Tooltip is CSS-only (`.tip[data-tip]`), Progress is gone, so the Base UI stack is out of the bundle (main chunk 118 kB to 84 kB gzipped); fonts are self-hosted through `@fontsource` packages; Projects, Experience and Contact are lazy chunks with a `react` vendor chunk. **Not done:** build-time prerender. It is a separate PR with its own risk; `vite-prerender-plugin` is the low-code path.

**Why.** The page is 100% static content, yet `index.html` ships an empty root, so first paint
waits for the whole JS chunk to download, parse and render. Two components account for more
bytes than the entire app source three times over.

Measured breakdown of the single 368 kB (118 kB gzipped) chunk:

| Stack                                                                           | gzipped | share |
| ------------------------------------------------------------------------------- | ------- | ----- |
| react + react-dom                                                               | 60.2 kB | 51%   |
| @base-ui-components + @floating-ui (pulled in by `Tooltip` and `Progress` only) | 31.5 kB | 27%   |
| tailwind-variants + tailwind-merge (sukuna-ui's `tv`)                           | 12.9 kB | 11%   |
| app source                                                                      | 10.5 kB | 9%    |
| sukuna-ui component code                                                        | 2.7 kB  | 2%    |

sukuna-ui's own tree-shaking works. The cost is what `Tooltip` (six icon links) and
`Progress` (a styled div with an ARIA role) drag in.

**Evidence.** `tooltip.logic.js:3` and `progress.logic.js:2` import from
`@base-ui-components/react`. Call sites: `Hero.tsx:146`, `Projects.tsx:24,32`, `Skills.tsx:43`.
`index.html:13-19` loads three font families through a render-blocking Google Fonts
stylesheet; the LCP `<h1>` in Archivo 900 waits on a three-hop cross-origin chain. Archivo 500
and 800 and Inter 500 are requested but never used. `App.tsx:23-28` imports every section
statically; `main.tsx:6` uses `createRoot`, not `hydrateRoot`.

**Do.**

- Replace the six `Tooltip`s with a CSS-only `data-tip` tooltip (`::after` with
  `content: attr(data-tip)`, shown on `:hover` and `:focus-visible`) and the `Progress` with a
  native `role="progressbar"` div. That deletes the 31.5 kB stack. Longer term, make sukuna-ui's
  Tooltip and Progress not depend on Base UI, or ship them as separate subpath exports.
- Consider `createTV({ twMerge: false })` in sukuna-ui to halve the tailwind-variants chunk.
- Self-host Archivo 700/900, Inter 400–600 (variable) and JetBrains Mono as WOFF2 in
  `public/fonts/` with `font-display: swap`, `<link rel="preload" as="font">` for Archivo 900
  and Inter 400, and a `size-adjust` fallback face to zero out swap CLS. Remove the Google
  Fonts links.
- `React.lazy` Projects, Experience and Contact behind a `Suspense` with a fixed-height
  fallback; add a `react` manual chunk in `vite.config.ts`.
- Prerender at build time: a `scripts/prerender.tsx` that `renderToString`s `<App />` into
  `dist/index.html`, then `hydrateRoot` in `main.tsx`. Both canvases only touch the DOM in
  `useEffect` and the typewriter's initial state is deterministic, so this is safe today.
  `vite-prerender-plugin` does the same with less code.

## 10. Safety net and DX

**Status.** Done: GitHub Actions CI (lint, typecheck, test, build), Vitest + Testing Library with 11 tests across three suites, `useInView` shared by Reveal/CountUp, typed config with all copy moved in, Prettier + EditorConfig, `CLAUDE.md`, real README, dependency ranges normalised.

**Why.** Content edits are the most frequent commits (the git log is mostly config changes) and
nothing runs lint, typecheck or build before Vercel deploys. A bad config edit ships unchecked.
The README is still the Vite template, and three components duplicate the same
IntersectionObserver block.

**Evidence.** No `.github/`, no `*.test.*`, no `test`/`typecheck` scripts in `package.json`.
`README.md:1-73` is untouched boilerplate. Observer copies at `Reveal.tsx:15-29`,
`About.tsx:21-42`, `Skills.tsx:15-29`. Loose types: `SocialLink.icon: string` feeds a switch
that returns `null` on typos; `Project.category` is free-form so "My Project" would create a
second tab. Dead config fields `tagline` and `avatarUrl`; unreferenced `src/assets/hero.png`
and `public/icons.svg`.

**Do.**

- GitHub Actions: `setup-bun` → `bun install --frozen-lockfile` → lint → `tsc -b` → test → build.
- Vitest + Testing Library with three tests: config invariants (icons are valid keys, every
  project has a URL, levels 0–100), Projects category switching, and `Reveal` intersection flip.
- `src/hooks/useInView.ts` used by Reveal, CountUp and PowerMeters; `useReducedMotion` lives
  beside it (see item 7).
- Type the config: `SocialIconName` union, `ProjectCategory` union, move section copy
  (`STATS`, `WORDS`, eyebrows, titles, nav links, footer) into `portfolio.config.ts`, delete
  dead fields and assets.
- Real README (stack, Bun-only, dev port, how to add a project, the sukuna-ui coupling),
  `.prettierrc` matching the current style (`semi: false`, `singleQuote: true`,
  `printWidth: 100`), `.editorconfig` with `end_of_line = lf`, and a tracked `CLAUDE.md`.
- Normalise `tailwindcss` / `@tailwindcss/vite` to `^4.3.3` and plan the Vite 7 bump separately.

---

## Also considered

- **Spanish (es-MX) version with `hreflang`.** Half the projects target a Mexican audience and
  the title already slipped into Spanish. Needs a second crawlable `dist/es/index.html`, not
  just a client-side toggle. Effort L; worth doing after items 1–4.
- **"Writing" or "Latest on GitHub" section.** Cheap credibility once the GitHub handle
  mismatch is resolved and the chosen account has public activity.
- **Dark-only theme.** sukuna-ui supports `data-theme="light"`, but the fire palette is
  designed dark-first. Leave it.

## Suggested order

Week 1: 5, 1, 7 (all S, all shipped in an afternoon). Week 2: 8, 2, 4. Week 3: 9, 3, 6 (the
library changes). Ongoing: 10.
