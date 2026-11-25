# Rebirth Web Design

Marketing site built with Astro 7, Tailwind CSS v4, GSAP and React islands, deployed to Cloudflare Workers.

    npm install && npm run dev      # http://127.0.0.1:4321
    npm run build && npm run preview

Routes: `/`, `/services`, `/plans`, `/careers`, `/launch`. The old URLs `/download`, `/nitro` and `/ads/quests` redirect (301) to
`/services`, `/plans` and `/launch`; they are declared in `astro.config.mjs` and emitted to `_redirects` by the Cloudflare adapter.

See `CONTRIBUTING.md` for commands, folder conventions and standards.

- `docs/DESIGN.md`, `src/styles/theme.css` - governing style docs (theme.css is the single token source).
- `docs/DECISIONS.md` - every ambiguity resolved during the build.
- `docs/QA-REPORT.md` - final measurements and known gaps. `docs/CREDITS.md` - Unsplash credits. `docs/source-copy.md` - source text for the page copy.

## Regression gate

    npx playwright install chromium   # once per machine
    npm run verify:baseline           # record this machine's baseline from a known-good commit
    npm run verify                    # build + compare layout, overflow, console errors, screenshots
    npm run verify:motion             # after a build: animation liveness per section

Baselines are per machine (fonts and anti-aliasing differ between systems) and are not committed.
See `docs/RESTRUCTURE-PLAN.md` for the rules around the gate.
