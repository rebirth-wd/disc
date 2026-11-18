# Rebirth Web Design — site replica (Astro + Tailwind v4 + GSAP)

    npm install && npm run dev      # http://127.0.0.1:4321
    npm run build && npm run preview

Routes: `/`, `/download`, `/nitro`, `/careers`, `/ads/quests`.

- `DESIGN.md`, `src/styles/theme.css`, `src/styles/variables.css`, `src/tokens/tokens.json` — governing style docs (unmodified).
- `DECISIONS.md` — every ambiguity resolved during the build. `AGENTS.md` — subagent directives.
- `docs/QA-REPORT.md` — final measurements and known gaps. `docs/CREDITS.md` — Unsplash credits.
- `src/pages/_preview/` — per-section preview pages (excluded from the build; rename to `preview` to use).
- `qa-tools/` — Playwright scripts used for capture and comparison (need `npm i playwright`).
