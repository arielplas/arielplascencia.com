# arielplascencia.com

Personal portfolio of Ariel Plascencia, full-stack developer. Live at
[arielplascencia.com](https://arielplascencia.com/).

## Stack

- React 19, TypeScript, Vite 5
- Tailwind CSS v4 through `@tailwindcss/vite`
- [`@sukunagg/ui`](https://www.npmjs.com/package/@sukunagg/ui) components and
  [`@sukunagg/fx`](https://www.npmjs.com/package/@sukunagg/fx) effects (HoloCard, FlowField),
  with the library's crimson `--sk-*` palette and Archivo set in `src/index.css`
- Vercel for hosting, analytics and the `api/contact` serverless function

## Develop

Bun only.

```bash
bun install
bun run dev          # http://localhost:5173 (or --port 5199 in .claude/launch.json)
```

Checks, which CI also runs on every push and PR:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

`bun run build` also prerenders the page into `dist/index.html` (`scripts/prerender.ts`), so the
first paint needs only HTML and CSS; the client then hydrates it. `bun run preview` serves the
result.

`bun run format` runs Prettier.

## Editing content

Everything visible lives in `src/config/portfolio.config.ts` and is typed: name, availability,
about copy, socials, skill groups, projects, experience and every section's eyebrow, title and
subtitle. To add a project, append to `projects`. Optional `role`, `stack`, `year`, `outcome`
and `image` fields turn a card into a mini case study; put images in `public/projects/`
(800×500).

Stats on the hero floor and the career level are derived from that data (years since the
earliest experience entry, number of projects, number of companies), so they never go stale.
Skills carry a `tier` (main / daily / proficient) drawn as a loot rarity; mark one project
`featured` for the beamed card.

## Contact form

`src/components/Contact.tsx` posts to `api/contact.ts`, which sends through
[Resend](https://resend.com). Set these environment variables on Vercel:

| Variable         | Example                                                     |
| ---------------- | ----------------------------------------------------------- |
| `RESEND_API_KEY` | `re_…`                                                      |
| `CONTACT_TO`     | `imariel2d@gmail.com`                                       |
| `CONTACT_FROM`   | `Portfolio <hello@arielplascencia.com>` (a verified sender) |

If they are missing the endpoint returns 503 and the form falls back to opening the visitor's
mail client with the message pre-filled.

## SEO assets

`index.html` carries Open Graph, Twitter card, canonical and JSON-LD `Person` metadata.
`public/og.png` (1200×630), `public/robots.txt` and `public/sitemap.xml` are static.

## Improvement backlog

See [`docs/ai-improvements.md`](docs/ai-improvements.md).
