# arielplascencia.com

Personal portfolio. React 19 + Vite 5 + Tailwind v4 + TypeScript, styled with `@sukunagg/ui`
and `@sukunagg/fx` (the owner's own component and effects libraries). Deploys to Vercel from
`main`.

## Toolchain

- Bun only. `bun install`, `bun run dev` (port 5199), `bun run lint`, `bun run typecheck`,
  `bun run test`, `bun run build`, `bun run format`.
- Run `bun run lint && bun run typecheck && bun run test && bun run build` before committing.
  CI runs the same four steps.

## Conventions

- Content lives in `src/config/portfolio.config.ts` (typed). Edit copy there, not in components.
- Theme is defined by overriding `--sk-*` tokens in `src/index.css`. Do not restyle
  `@sukunagg/*` components with DOM-shape selectors; if a component lacks an API, fix it in
  the sukunagg-ui repo.
- Sections use `overflow-clip`, not `overflow-hidden` (hidden creates a scroll container that
  `scrollIntoView` can shift sideways).
- Every animation must respect `prefers-reduced-motion` (CSS in `index.css`, JS via
  `useReducedMotion`).
- Navigation uses real anchors (`<Button as="a" href>`), never
  `<button onClick={location.href = …}>`.
- Prettier settings are in `.prettierrc`; keep the no-semicolon, single-quote style.
