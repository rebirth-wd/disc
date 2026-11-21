# Contributing

## Stack

Astro 7 (static by default) with Tailwind CSS v4, GSAP 3 for motion, React islands for interactive widgets,
and the Cloudflare adapter for deployment to Workers with static assets. Node version is pinned in `.nvmrc`.

## Commands

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Dev server at http://127.0.0.1:4321                      |
| `npm run build`        | Production build to `dist/`                              |
| `npm run preview`      | Serve the production build locally                       |
| `npm run check`        | Type-check Astro and TypeScript (`astro check`)          |
| `npm run lint`         | ESLint                                                   |
| `npm run format`       | Prettier, write                                          |
| `npm run format:check` | Prettier, verify only (what CI runs)                     |
| `npm run deploy`       | Build, then `wrangler deploy` (needs a Cloudflare login) |

CI runs check, lint, format:check and build on every push to `main` and on every pull request. All four must pass.

## Folder conventions

```
src/
  components/    Astro components, grouped by role (see below)
  islands/       React components, hydrated on the client (see src/islands/README.md)
  data/          Typed content that components render
  lib/           Shared client and server code (motion helpers, utilities)
  layouts/       BaseLayout.astro: head, SEO tags, page chrome
  pages/         One file per route
  styles/        global.css and the token files
  assets/        Images processed by Astro
public/          Files served as-is (favicon, robots.txt)
tools/           QA scripts and per-section preview pages (reference material, not part of the build)
docs/            Design system, decision log, credits, QA report
```

### Components

```
src/components/
  ui/          Button
  layout/      Header, Footer, Starfield, LogoMark
  graphics/    art only, no page layout: objects/ loops/ characters/ mocks/ icons/
  sections/    one folder per page (home, services, plans, careers, launch), one file per page section
```

A file that mixes section layout with art stays in `sections/`. Shared client code lives in `src/lib/`
(for example `carousel.ts`).

### Naming

Files and component names describe content (`PlansTiers`, `FeatureMonitoring`), never a reference or an
author. CSS follows BEM with the component's kebab-case name as the block: `PlansHero.astro` gives
`.plans-hero`, elements `.plans-hero__title`, modifiers `.plans-hero--x`. Data attributes and ids use the same
block name (`data-services-hero-layout`, `#services-platforms`). Page-level shared classes use the page name
(`.plans-page`, `.launch-wrap`). `data-section` values keep their original names (the regression gate keys
on them), as does `data-nav-trigger`.

Import across folders with the aliases `@components/*`, `@layouts/*`, `@lib/*`, `@data/*`, `@islands/*`,
`@styles/*` and `@assets/*`. Same-folder imports stay relative (`./Thing.astro`).

Pages are prerendered. To render a route on demand, opt in per route with `export const prerender = false`.

## Styling rules

`docs/DESIGN.md` and the token files (`src/styles/theme.css`, `src/styles/variables.css`,
`src/tokens/tokens.json`) govern all styling and take precedence over any other guidance. Use the tokens
(Tailwind utilities generated from `theme.css`, or `var(--...)`) and follow the Do's and Don'ts in the design
doc. Do not edit the token files to make a component fit; raise it instead.

`docs/DECISIONS.md` records choices made where the docs were silent. Add a numbered entry for any new one.

## Code standards

- Typed props on every component; no `any`, no `@ts-ignore`.
- Respect `prefers-reduced-motion`: wrap GSAP motion in `gsap.matchMedia()`.
- Every section root carries `data-section="<page>-<name>"`.
- Comments explain why, not what.
