# Handover: restructure moves to Claude Code (Code Mode) on the Mac

Written at the end of the cloud session, 2026-11-21. Read with `docs/RESTRUCTURE-PLAN.md` (rules, target
structure, wave table) and `docs/DECISIONS.md` (entries 17–21 cover the restructure so far).

## Where things are

- Repo: `https://github.com/rebirth-wd/disc`. Branch: `restructure`. `main` is untouched since `a8e8601`.
- The head of `restructure` is the commit that adds this file. Do not merge to `main` until the user says so.

| Wave | Scope (review items) | State | Commit |
|---|---|---|---|
| 1 | Foundations: TypeScript + aliases, check/lint/format, Cloudflare adapter, React, sitemap, SEO head, CI, file moves (1–7, 11) | committed | `ad9c365` |
| 2 | Routes, role-based folders, content-based names (8–10) | committed | `27024a6` |
| 3 | `src/lib/motion.ts`, every script migrated (21) | committed | `9c1f121` |
| 4 | One Button, Section, Heading, Header split, navigation data (12, 16, 22) | committed | `2189259`, `4eba080` |
| 5 | One Accordion, one Dropdown, one Carousel (17, 18) | not started | |
| 6 | One star system; objects + Parallax wrapper (19, 20) | not started | |
| 7 | Content into `src/data`, site config, per-page SEO (13–15) | not started (only `src/data/navigation.ts` exists) | |
| 8 | Font token rename, remaining px→rem font sizes (23, 26) | not started | |
| 9 | Colour, breakpoint, type and z-index tokens; single token source; hard-coded heights (24, 25, 27–29, 32) | not started | |
| 10 | Lazy motion, images, view transitions, smoke tests (30, 31, 33, 34) | not started | |
| Final | Rename `data-section` values, full review, hand-over | not started | |

No wave is partly done: the working tree was clean at hand-over.

## Decisions already made (do not reopen without the user)

- Routes: `/download` → `/services`, `/nitro` → `/plans`, `/ads/quests` → `/launch`, with 301 redirects (in place).
- Exact pixel parity with the reference site is no longer the goal where it blocks a clean system. The user:
  "button and headings can vary within an approx range". Wave 9 deliberately gives up parity where
  hard-coded section heights become spacing tokens; list the resulting geometry changes for the user.
- Button scale: `nav` 39, `sm` 40, `md` 48, `lg` 56, `xl` 65 (56 below 1440). Heading scale: `xl`/`lg`/`md`/`sm`,
  stepping at 480 and 1440. One gutter schedule for all pages (6vw / 40 / 80 / 120 at 0 / 480 / 992 / 1440).
  No page-named variants in shared primitives.
- Class naming: block = the component's kebab-case name, `__element`, `--modifier`.
- `session: false` and `imageService: 'compile'` in `astro.config.mjs` (no KV namespace, no Images binding).
  The adapter config was checked against the installed adapter source and Astro 7 examples; no deploy has
  been run.

## How the work is run

Orchestrator (Fable 5.2) plans, briefs, reviews and commits; it does not do wave work itself.

- One wave at a time, one agent at a time (they share the working tree).
- Models: Sonnet for waves 5, 6, 7, 9, 10; Haiku for wave 8 (mechanical). Nothing needs more if the brief
  specifies the design.
- Each brief: point the agent at `docs/RESTRUCTURE-PLAN.md` (its rules are binding), state the design, the
  files in scope, what must not change, and the gates.
- Agent rules: ask, never guess. On an unforeseen problem, stop and report; no workarounds, no added rules
  to make a check pass.
- Review of every wave: read the diff, run the gates yourself, then commit, send back, or revert. Before
  approving any patch, weigh reverting finished work and rebuilding more simply.
- Within a tolerance the user accepts (a few px on buttons/headings, attributed and listed), do not stop
  the agent for every pixel; stop for breakage: overflow, overlap, lost animation, console errors,
  unexplained geometry change.
- Whenever a class, id, data attribute, event name or CSS variable is renamed or removed, grep every reader
  across `src` first. Wave 2 broke three animations this way (renamed an event, not its listeners) and the
  layout gate could not see it; the motion gate exists because of that.
- It is not confirmed whether sub-agents run in Code Mode. Every wave can be run either way: with a
  sub-agent per wave, or by the orchestrator session doing the wave directly under the same rules and gates.
  If you run a wave directly, keep the review step honest: gates first, then read your own diff before
  committing.

### Code Mode notes

- Batch repeated edits across many files into one code step, and run the independent checks in parallel in
  one step: `npm run check`, `npm run lint`, `npm run format:check`, `npm run verify`. Return only failures.
- `npm run verify:motion` needs a finished build and takes about 4 minutes: run it after `verify`, not
  alongside it (both serve `dist` on fixed ports 4455 / 4466).
- No browser tools are available there. All visual checks go through the Playwright gate; for a closer look
  write a throwaway Playwright script outside `qa/` that screenshots a section, and read the image.

## The gate on the Mac

Node `>=22.23.4` is required (`.nvmrc`).

1. `npx playwright install chromium` once.
2. Record the layout baseline **from the head of `restructure` before any new work**:
   `npm run verify:baseline`. Baselines live in `qa/baseline/` and are not committed, because fonts and
   anti-aliasing differ between machines. Never re-record on top of unreviewed changes.
3. `npm run verify` should then print `VERIFY PASSED` with 0.000% everywhere. Run it twice to learn the
   noise on that machine.
4. `qa/motion-baseline.json` is committed (element counts recorded from the pre-restructure site on Linux,
   noise 2). Run `npm run build && npm run verify:motion`. If it fails on the untouched head because the
   Mac renders differently, re-record it from the head (`npm run verify:motion -- baseline`) and note that
   in `docs/DECISIONS.md`.
5. When a wave causes accepted, attributed layout changes: review the diff images in `qa/output/`, then
   re-record with `npm run verify:baseline` on that reviewed state, before the next wave.

## Carried forward (known issues and open items)

For wave 5:
- Two carousel engines: `src/lib/carousel.ts` (careers) and a private one in `LaunchStories.astro`. Each
  calls `gsap.registerPlugin(Draggable)`; after merging there should be one, in `src/lib/`.
- Two FAQ implementations (`CareersFaq`, `PlansFaq`) and several dropdowns (services dropdown, launch subnav,
  footer language select, header dropdowns).
- `.careers-arrow` is a shared class defined in `CareersHero` and used by `CareersParty`.
- Listeners not removed on page swap (must be fixed before the client router goes on in wave 10): Header
  (`keydown`/`click` on document, `scroll` on window, a media-query listener), Footer (`click`, `keyup`),
  services dropdown (`click`, `keydown`), both FAQs (`click`, `keydown`, a media-query listener),
  launch subnav (`click`), both carousels (`keydown`, `resize`, an IntersectionObserver, Draggable instances
  never killed), tweens created inside event handlers, and the closing-banner easter-egg click handler.
  Decide once whether `onPage()` re-init is enough or registrations need an AbortController.

For wave 6:
- Star components: `layout/Starfield`, `graphics/objects/FeatureStars`, `graphics/objects/Twinkles`, plus
  hand-placed stars in the home hero and closing banner.
- Object components per page (`FeatureObjects`, `PlansObject`, `CareersObject`, `LaunchObject`,
  `ServicesObject`) each bundle art with their own parallax; `ParallaxFloat` is the closest thing to the
  wrapper. `FeatureObjects` uses `motion(document.body, …)` on purpose (its stagger index counts across
  instances).

For wave 9:
- Home heading "Always have something new" overflows its box at 320px (word 214px, box 205px).
- Plans "Faster pages" heading runs 24px past the viewport at 480–500px (no horizontal scroll).
- Plans compare table at 320px: label column is 58px, labels break mid-word. A proper fix is a different
  table layout for the narrowest phones.
- `theme-color` is the indigo canvas on every page, though four pages are black.
- Sections still on their own markup, not `Section`: careers hero, services hero and platforms, launch
  hero, subnav, logos and CTA, and all home sections.
- Token names still carry the reference brand (`--font-abc-ginto-discord…`); wave 8 renames them.

For the final wave:
- `data-section` values still use the old names (`nitro-*`, `quests-*`, `download-*`) because both gates key
  on them. Rename them last, together with the keys in `qa/motion-baseline.json`, then re-record the layout
  baseline.
- `tools/qa/` and `tools/previews/` are leftovers from the original build (absolute cloud paths inside);
  delete or rewrite them.

Content the user should review before the site goes public (unchanged by the restructure, see
`docs/QA-REPORT.md`): six composed careers FAQ answers, nav labels, placeholder prices and stats, one photo
credit with two names.

Related: the design-system canvas is at https://claude.ai/artifact/PJLgVz4Q9Awh2ZfmyWfESu (reference
only; it does not drive the code).

## Working with the user

Two-person team, cost-sensitive. Short, matter-of-fact replies; lead with the answer; one step at a time.
Never fabricate results or alter the gate to make work pass. Do not run expensive tests the user can do for
free. Wait for the user's OK before starting each wave.
