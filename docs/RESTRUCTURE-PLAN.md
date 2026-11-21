# Restructure plan

Goal: make the site easy to edit and easy to extend (React islands, Astro integrations, server routes) without
changing how it looks or moves. Branch: `restructure`. One sub-agent works at a time; the orchestrator reviews
and commits each task before the next starts.

## Rules for every sub-agent (binding)

1. **Do not guess.** If you are unsure about an API, a version, a file's purpose, or what a rule here means,
   stop and ask the orchestrator (SendMessage to `main`) and wait. Check current docs (Context7 / official
   docs) for Astro 7, Tailwind 4, GSAP 3 and any integration before using an API from memory.
2. **No patching over problems.** If something unforeseen breaks (verify fails for a reason you cannot fix by
   correcting your own change cleanly, a design in this plan turns out not to fit the code, two rules
   conflict): stop, leave the tree as it is, and report what happened, what you tried, and your options. Do
   not add workarounds, `!important`, overrides, special cases or try/catch to make a check pass. The
   orchestrator decides whether to patch, or to revert finished work and rebuild more simply.
3. **The gate.** `node /home/claude/qa/verify.mjs` builds the site and compares it with the pre-restructure
   baseline: section geometry at four widths, document height, overflow, console errors, and full-page
   screenshots (pixel diff limit 0.3%; baseline noise is 0.000%). It must print `VERIFY PASSED` before you
   report, unless your task says a difference is expected. Never edit anything under `/home/claude/qa/`.
   `npm run check` and `npm run lint` (once they exist) must also pass with zero errors.
4. **Behaviour is frozen.** Same DOM output where practical, same computed styles, same motion parameters
   (durations, eases, triggers). `data-section` values never change. No visual redesign, no new features
   beyond the task, no dependency not named in the task.
5. **Scope.** Touch only what the task needs. No drive-by refactors; list anything else you notice in your
   report. Do not commit, push, or switch branches. Do not start long-running servers.
6. **Quality bar.** Typed props on every component, no `any`, no dead code or commented-out code, no
   leftover agent/owner/TODO comments, names that describe content (never `featA`, `Feature3`, `nitro`).
   Comments explain why, not what. Prefer deleting code to adding it.
7. **Report** (final message, short and factual): files added/moved/deleted, what you verified and the
   verify output tail, anything you did not do or are unsure of. Never claim a check you did not run.

## Target structure

```
src/
  components/
    ui/          Button, Accordion, Dropdown, Carousel, Tabs
    layout/      Header (+ NavDropdown, MobileMenu), Footer, Section, Starfield, LogoMark
    graphics/    objects/*, loops/*, characters/*  (art only, no page layout)
    sections/    home/ services/ plans/ careers/ launch/   (one file per page section)
  islands/       React components (client:visible by default)
  data/          typed content: site.ts, navigation.ts, faqs, plans, slides, features
  lib/           motion.ts, carousel.ts, other shared client code
  layouts/       BaseLayout.astro
  pages/         index, services, plans, careers, launch
  styles/        global.css, theme.css (single token source)
tools/           QA scripts, previews
docs/            DESIGN.md, DECISIONS.md, CREDITS.md, QA-REPORT.md, this plan
```

Routes: `/download` → `/services`, `/nitro` → `/plans`, `/ads/quests` → `/launch` (old URLs redirect).
Aliases: `@components/*`, `@layouts/*`, `@lib/*`, `@data/*`, `@islands/*`, `@styles/*`, `@assets/*`.

## Waves (in order)

| # | Task | Items from the review | Model |
|---|---|---|---|
| 1 | Foundations: tsconfig + aliases, check/lint/format, Cloudflare adapter, React, sitemap, SEO head, favicon, unused deps, CI, move build-process files | 1–7, 11 | Sonnet |
| 2 | Structure: route and folder renames, redirects, role-based folders, content-based file names | 8–10 | Sonnet |
| 3 | Motion: `src/lib/motion.ts`, migrate every component script to it, lifecycle-safe init/cleanup | 21 (prepares 33) | Sonnet |
| 4 | UI primitives: one Button, Section wrapper, split Header | 12, 16, 22 | Sonnet |
| 5 | UI behaviour: one Accordion, one Dropdown, one Carousel | 17, 18 | Sonnet |
| 6 | Graphics: one star system, objects + Parallax wrapper | 19, 20 | Sonnet |
| 7 | Content: `src/data`, site config, per-page SEO | 13–15 | Sonnet |
| 8 | Tokens A (mechanical): font token rename, px→rem font sizes | 23, 26 | Haiku |
| 9 | Tokens B: colour, breakpoint, type and z-index tokens, single token source, hard-coded heights | 24, 25, 27–29, 32 | Sonnet |
| 10 | Performance and robustness: lazy motion, images, view transitions, smoke tests | 30, 31, 33, 34 | Sonnet |

Fable (orchestrator) reviews every wave: reads the diff, runs the gate itself, checks the rules above, and
either commits, sends it back, or reverts.
