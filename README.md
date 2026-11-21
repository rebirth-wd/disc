# Rebirth Web Design

Marketing site built with Astro 7, Tailwind CSS v4, GSAP and React islands, deployed to Cloudflare Workers.

    npm install && npm run dev      # http://127.0.0.1:4321
    npm run build && npm run preview

Routes: `/`, `/services`, `/plans`, `/careers`, `/launch`. The old URLs `/download`, `/nitro` and `/ads/quests` redirect (301) to
`/services`, `/plans` and `/launch`; they are declared in `astro.config.mjs` and emitted to `_redirects` by the Cloudflare adapter.

See `CONTRIBUTING.md` for commands, folder conventions and standards.

- `docs/DESIGN.md`, `src/styles/theme.css`, `src/styles/variables.css`, `src/tokens/tokens.json` - governing style docs (unmodified).
- `docs/DECISIONS.md` - every ambiguity resolved during the build.
- `docs/QA-REPORT.md` - final measurements and known gaps. `docs/CREDITS.md` - Unsplash credits. `docs/source-copy.md` - source text for the page copy.
- `tools/previews/` - per-section preview pages (reference material, excluded from the build; copy one into `src/pages/` to use it).
- `tools/qa/` - Playwright scripts used for capture and comparison (need `npm i playwright`).
