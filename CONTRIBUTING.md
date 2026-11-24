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
| `npm run test:smoke`   | Smoke test of `dist/client` (run `npm run build` first)  |
| `npm run deploy`       | Build, then `wrangler deploy` (needs a Cloudflare login) |

CI runs check, lint, format:check and build on every push to `main` and on every pull request. All four must pass.
CI does not run Playwright, so `npm run test:smoke` (the five routes, the three old-URL redirects, one h1, title,
description and canonical per page, no horizontal overflow from 320 to 1680px; about 10 seconds, needs
`npx playwright install chromium` once) is run by hand after a build.

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
tools/smoke/     Smoke test (npm run test:smoke); the layout and motion gates live in qa/
docs/            Design system, decision log, credits, QA report
```

### Components

```
src/components/
  ui/          Button, Heading, CheckItem
  layout/      Header, HeaderDropdown, MobileMenu, Footer, Section, Starfield, LogoMark
  graphics/    art only, no page layout: objects/ loops/ characters/ mocks/ icons/
  sections/    one folder per page (home, services, plans, careers, launch), one file per page section
```

A file that mixes section layout with art stays in `sections/`. Shared client code lives in `src/lib/`
(for example `carousel.ts`). Navigation and footer links live in `src/data/navigation.ts`.

Use the primitives; do not restyle them from a page. Placement (margin, alignment, width) goes in `class`.

- `Button`: `variant` (`white` | `blurple` | `ghost`), `size` (`nav` | `sm` | `md` | `lg` | `xl`), `glow`, `block`,
  `href` (renders `<a>`, otherwise `<button type="button">`), `class`, plus any anchor attribute. The icon goes in
  the `icon` slot (give 24px svgs `width="24" height="24"`). Sizes are a fixed scale (nav 39px, sm 40, md 48,
  lg 56, xl 56 and 65 from 1440px); if a design needs another height, raise it rather than add a class.
- `Section`: `section` (the `data-section` value), `id`, `as`, `container` (`narrow` | `wide` | `ultra` | `none`),
  `padding` (`none` | `section`), `class`. It supplies the one gutter schedule (6vw, 40px, 80px, 120px at 0, 480,
  992 and 1440px) and the centred container; the `before` and `after` slots hold decor. Not used by the hero
  sections of careers, services and launch, the services platforms section, the launch subnav, logos and CTA,
  or any home section: they have their own geometry, so moving them would shift pixels.
- `Heading`: `level` (1 to 4), `size` (`xl` page and closing headings, `lg` section headings, `md` and `sm`
  sub-headings), `italic` (plans), `class`. No margin or alignment of its own.
- Rules for sections: no `is:global`, no `!important`, and no `:global()` to reach into another component unless
  that component forwards `...rest` for a scoped class. Tailwind utilities are layered and lose to unlayered
  scoped CSS, so a component must not set `margin` on an element a parent places with utilities.

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

`docs/DESIGN.md` and the token file (`src/styles/theme.css`) govern all styling and take precedence over any other guidance. Use the tokens
(Tailwind utilities generated from `theme.css`, or `var(--...)`) and follow the Do's and Don'ts in the design
doc. Do not edit the token files to make a component fit; raise it instead.

`docs/DECISIONS.md` records choices made where the docs were silent. Add a numbered entry for any new one.

## Code standards

- Typed props on every component; no `any`, no `@ts-ignore`.
- Respect `prefers-reduced-motion`: start animation with `motion()` from `@lib/motion` (see Motion below).
- Every section root carries `data-section="<page>-<name>"`.
- Comments explain why, not what.

## Motion

All GSAP code goes through `src/lib/motion.ts`. It registers ScrollTrigger and CustomEase once and re-exports
`gsap` and `ScrollTrigger`, so components never import from `gsap` or call `registerPlugin` themselves
(`Draggable` is the exception: only the carousels load it).

- `onPage(init)`: the component script's entry point. Runs `init` when the DOM is ready, and again after each
  client-side navigation if the Astro client router is enabled (it reverts every `motion()` context on
  `astro:before-swap`).
- `motion(root, setup, when?)`: runs `setup` only without a reduced-motion preference, optionally also within a
  breakpoint such as `MQ.md`. Everything created inside (tweens, timelines, ScrollTriggers) is reverted
  automatically. `media(root, setup, query)` is the same without the reduced-motion condition, for static states
  and in-view triggers.
- `ease.css`, `ease.in`, `ease.inOutSine`, `ease.outQuart`: the registered cubic-bezier curves. Do not call
  `CustomEase.create` in a component.
- `MOTION_OK`, `MOTION_REDUCE`, `MQ`, `reducedMotion()`: the media-query strings and a live check for code that
  zeroes durations instead of skipping the tween. Do not write these strings out.
- `playWhileInView(trigger, ...animations)`: plays looping timelines only while their section is on screen.

```ts
import { gsap, motion, onPage, MQ } from '@lib/motion';

onPage(() => {
  motion(
    document.querySelector<HTMLElement>('[data-section="plans-cta"]'),
    (root) => {
      gsap.to(root.querySelector('[data-par="flag"]'), {
        y: 150,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    },
    MQ.md,
  );
});
```
