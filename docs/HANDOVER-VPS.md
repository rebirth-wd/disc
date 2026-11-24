# Handover: restructure continues on the VPS

Written 2026-11-24 on the Mac. Read with `docs/RESTRUCTURE-PLAN.md` (binding sub-agent rules, target structure,
wave table) and `docs/HANDOVER-CODE-MODE.md` (decisions, carried-forward issues per wave). This file supersedes
the status table in `HANDOVER-CODE-MODE.md` and `claude/recap.md`, which are stale.

## User's instruction (2026-11-24)

"Restructure the site properly whilst maintaining the closest visual replication of the original. Use sub-agents
for the work while you orchestrate." The user does not want to be consulted per wave: run every remaining wave
without asking for an OK. When a change alters look or behaviour versus the original, choose the closest
replication of the original; do not ask.

## Status

Repo `rebirth-wd/disc`, branch `restructure`. Do not merge to `main`.

| Wave | Scope | State |
|---|---|---|
| 1–4 | Foundations, routes/folders, `motion.ts`, Button/Section/Heading/Header | committed |
| 5a | AbortSignal lifecycle | committed `fabc8fd` |
| 5b | One Accordion, Dropdown, Carousel | committed `01ed127` |
| 5c | Restore original carousel autoplay timing | committed `fb71bca`; all five gates pass on the VPS |
| 6a | One star system: `graphics/stars/` (Starfield, Twinkles), `lib/twinkle.ts` (item 19) | committed (see git log); Hero and ClosingBanner keep their own stars (different eases/sequences) |
| 6b | `graphics/Parallax.astro` + `lib/parallax.ts` (item 20) | committed (see git log); PlansFaq/Compare/Cta migrated; offset-keyframe timelines, FeatureBlock, FeatureObjects, CareersCta, ServicesBanner kept as is (see DECISIONS 23) |
| 7 | Content into `src/data`, site config, per-page SEO (13–15) | committed (see git log; DECISIONS 24) |
| 8 | Font token rename, px→rem font sizes (23, 26) | committed (see git log; DECISIONS 25) |
| 9a | Single token source; colour, breakpoint (px), type, z-index tokens (24, 25, 27–29) | committed (see git log; DECISIONS 26) |
| 9b | Hard-coded heights → spacing tokens, Section adoption, "For wave 9" fixes, per-page theme-color (32) | not started |
| 10 | Lazy motion, images, view transitions, smoke tests (30, 31, 33, 34) | not started |
| Final | Rename `data-section` values + keys in `qa/motion-baseline.json`, delete/rewrite `tools/qa`, `tools/previews`, full review | not started |

### Gate result on `01ed127` (Mac, 2026-11-24)

`check`, `lint`, `format:check` pass. `verify`: VERIFY PASSED, 0.000% on all 10 screenshots.
`verify:motion`: FAILED on `careers/careers-party` only (11 → 0).

Cause (confirmed with a Playwright run on `/careers`): 5b made `src/lib/carousel.ts` hold autoplay while
the carousel is off screen (`holds.inView` in `sync()`). The original ran the 9s countdown from page load,
pausing only on hover. The gate samples ~5.7s after scrolling a section in, so nothing moves. Not broken,
but a behaviour change. Decision: restore the original timing.

### 5c (done by sub-agent, reviewed, NOT committed at hand-over)

A Sonnet sub-agent changed `src/lib/carousel.ts` only. Its gates on the Mac: `check` 0/0/0, `lint` clean,
`format:check` pass, `verify` PASSED (0.000%), `verify:motion` PASSED (careers-party 11 → 11; launch/quests-steps
14 → 12, inside noise). The orchestrator read the diff and it is clean. All tasks were stopped there on the
user's request, before committing. The exact change, in case the working tree did not travel to the VPS:

```diff
--- a/src/lib/carousel.ts
+++ b/src/lib/carousel.ts
@@ -97,7 +97,8 @@
   // Autoplay runs only while none of these hold it.
-  const holds = { hover: false, drag: false, focus: false, inView: false };
+  const holds = { hover: false, drag: false, focus: false };
+  let inView = false;
@@ -156,7 +157,7 @@
   const sync = () => {
-    const held = holds.hover || holds.drag || holds.focus || !holds.inView;
+    const held = holds.hover || holds.drag || holds.focus;
@@ -280,17 +281,16 @@
-  // Arrow keys work while the carousel is on screen, and autoplay runs only then.
+  // Arrow keys work only while the carousel is on screen; autoplay ignores visibility.
   const io = new IntersectionObserver((entries) => {
-    holds.inView = entries[entries.length - 1].isIntersecting;
-    sync();
+    inView = entries[entries.length - 1].isIntersecting;
   });
@@ (keydown handler)
-      if (!holds.inView || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
+      if (!inView || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
```

## Wave 6 draft design (orchestrator's, check against the code before briefing)

Components today:
- `layout/Starfield.astro`: seeded CSS starfield (pixel stars + plus sparkles, CSS keyframe twinkle). Used by
  `home/HomeBackground`, `careers/CareersBanner`, `careers/CareersCta`. It is art, not layout: move to
  `graphics/stars/`.
- `graphics/objects/FeatureStars.astro` (10 fixed stars, x as % of 1680, blur 1px, GSAP twinkle,
  `playWhileInView`) and `graphics/objects/Twinkles.astro` (stars from props, x from the 1680 centre,
  GSAP twinkle, `MQ.md` only). Same three fade sequences (`[1,2,1,2]`, `[2,2,1,2]`, `[1,1,1,2]`, 0.5s
  power1.in). Merge into one hand-placed-stars component in `graphics/stars/` with typed props covering the
  real differences (position origin, blur, play condition) and one shared sequence table. Hand-placed stars in
  the home hero and closing banner should use it if they match; otherwise report.
- `graphics/objects/ParallaxFloat.astro` (scroll parallax ≥768 + idle float) is the basis of a generic
  Parallax wrapper. Per-page objects (`FeatureObjects`, `PlansObject`, `CareersObject`, `LaunchObject`,
  `ServicesObject`, `HeroIllustration`) should become art only, wrapped by it where their parallax fits the
  same parameters; where it does not fit, the agent stops and reports rather than adding special cases.
  `FeatureObjects` uses `motion(document.body, …)` on purpose (stagger index counts across instances).
- Behaviour frozen: same positions, timings, eases, triggers; both gates must pass unchanged.

## How to run it

- Orchestrator plans, briefs, reviews, commits; sub-agents do the wave work, one at a time (shared tree).
  Models: Sonnet for 5c, 6, 7, 9, 10; Haiku for 8.
- Brief preamble used so far: point at `docs/RESTRUCTURE-PLAN.md` (binding) and the handover docs; overriding
  goal is closest replication of the original; agents cannot ask mid-task, so on ambiguity or a design that
  does not fit they stop, leave the tree, and report options; run all gates (`check`, `lint`,
  `format:check`, `verify`, then `verify:motion`); never edit `qa/`, never commit; grep every reader
  before renaming a class/id/data attribute/event/CSS variable; final report lists files, gate tails, doubts.
- Review each wave: read the diff, run the gates yourself, then commit (`Wave N: …`), send back, or revert.
  Before approving a patch, weigh reverting and rebuilding more simply.
- Accepted, attributed geometry changes (wave 9 spacing tokens especially): review `qa/output/` diff images,
  then re-record `npm run verify:baseline` on that reviewed state before the next wave. Log in
  `docs/DECISIONS.md`.

## VPS setup

1. Node `>=22.23.4` (`.nvmrc`), `npm ci`.
2. `npx playwright install --with-deps chromium`.
3. `qa/baseline/` is not committed (fonts/anti-aliasing differ per machine). Record it on the VPS from the
   last reviewed commit, before any new work: `npm run verify:baseline`. Then `npm run verify` twice to learn
   the noise. Never re-record on top of unreviewed changes.
4. `qa/motion-baseline.json` is committed (recorded on Linux from the pre-restructure site, noise 2):
   `npm run build && npm run verify:motion`. If it fails on a reviewed head only because the VPS renders
   differently, re-record (`npm run verify:motion -- baseline`) and note it in `docs/DECISIONS.md`.
5. `verify` and `verify:motion` both serve `dist` on fixed ports (4455 / 4466): run them one after the other.

## Open items (carried)

See "Carried forward" in `docs/HANDOVER-CODE-MODE.md`: carousel pause control (WCAG 2.2.2), wave 9 overflow
items, marquee rebuild after breakpoint revert (wave 10), `data-section` renames (final), content the user
must review before going public (`docs/QA-REPORT.md`).

## Resuming on the VPS: step by step

You are the orchestrator. Do these in order; do not skip the gate steps.

### 0. Get the code

- `git fetch && git checkout restructure && git pull`. Run `git log --oneline -5` and `git status`.
- Work out which of these you have:
  - **A.** A commit titled "Wave 5c: …" (or a WIP commit containing `src/lib/carousel.ts` and this file) is at
    the head: 5c travelled. Go to step 1.
  - **B.** Head is still `01ed127` and this file arrived some other way: re-apply the 5c diff above by hand
    (four small edits in `src/lib/carousel.ts`). It is mechanical; no sub-agent needed. Go to step 1.
- Load the context: this file, `docs/RESTRUCTURE-PLAN.md`, `docs/HANDOVER-CODE-MODE.md` (decisions and
  "Carried forward"), `docs/DECISIONS.md` entries 17 onwards.

### 1. Set up the gate (VPS setup section above)

- `node -v` must be ≥ 22.23.4. `npm ci`. `npx playwright install --with-deps chromium`.
- Record the layout baseline from committed, reviewed code. Case B: `git stash` the re-applied 5c edit, run
  `npm run verify:baseline` on `01ed127`, then `git stash pop`. Case A: run `npm run verify:baseline` on the
  head (5c does not change pixels).
- `npm run verify` twice: expect VERIFY PASSED and 0.000%. If the VPS shows noise above 0, write the noise
  level down and use it when judging later waves.

### 2. Close out 5c

- Run all five gates on the 5c state: `npm run check`, `npm run lint`, `npm run format:check`, `npm run verify`,
  then `npm run verify:motion` (after verify, never in parallel).
- Expect `verify:motion` to pass with `careers/careers-party` ≈ 11. If other sections fail on the VPS only
  because Linux renders differently from the original baseline machine, re-record the motion baseline from
  this reviewed state (`npm run verify:motion -- baseline`) and log it in `docs/DECISIONS.md`.
- Commit (case B, or amend nothing in case A): `Wave 5c: carousel autoplay ignores visibility again (original timing)`.
- Add a `docs/DECISIONS.md` entry: 5b paused autoplay off screen; reverted because fidelity to the original wins.

### 3. Fix the stale docs (one small commit)

- `docs/HANDOVER-CODE-MODE.md` status table: Wave 5 row → "committed (`01ed127` 5b, 5c commit)".
- `claude/recap.md`: state = waves 1–5 done; next = wave 6; point it at this file.

### 4. Run waves 6 → 10 → Final, one at a time

For each wave:

1. **Plan.** Read the wave's row in `RESTRUCTURE-PLAN.md`, the matching "For wave N" notes in
   `HANDOVER-CODE-MODE.md`, and the code it touches. Write the design yourself (component names, props,
   what moves where, what must not change). Wave 6's draft is above; check it against the code first.
2. **Brief.** One sub-agent (general-purpose; model per the table: Sonnet, Haiku for wave 8). Use the
   preamble in "How to run it" verbatim, then the design, files in scope, what must not change, and
   "expected gate result". Agents cannot ask you mid-task: tell them to stop and report on any doubt.
3. **Wait.** One agent at a time; nothing else touches the tree meanwhile.
4. **Review.** Read the full `git diff`. Run all five gates yourself (do not trust the agent's tail).
   Check the plan's quality rules: typed props, no `any`, no dead/commented code, content-based names,
   no new dependencies, no edits under `qa/`. Grep for readers of anything renamed.
5. **Decide.**
   - Gates pass, diff clean → commit `Wave N: <summary>` (end with the Co-Authored-By line from the
     session's attribution instructions).
   - Fixable issues → send the same agent back (SendMessage / resume) with specific findings.
   - Design does not fit, or fixes would be patches → `git checkout -- .` / `git clean` the wave's files,
     redesign more simply, re-brief.
   - A wave that deliberately changes geometry (wave 9: hard-coded heights → spacing tokens; heading/button
     sizes may vary "within an approx range" per the user): review `qa/output/` diff images, keep each change
     small and attributed, list them in `docs/DECISIONS.md`, then re-record `npm run verify:baseline` on
     the committed state before the next wave. Still prefer the option closest to the original.
6. **Record.** Update the status table in this file after each commit.

Wave notes worth remembering:
- Wave 7: only `src/data/navigation.ts` exists; target files `site.ts`, faqs, plans, slides, features.
- Wave 8 (Haiku): rename `--font-abc-ginto-discord…` tokens to brand-neutral names; px → rem font sizes.
  Mechanical; brief it with an exact old→new mapping you write first.
- Wave 9: the "For wave 9" list in `HANDOVER-CODE-MODE.md` (overflow at 320px, plans heading at 480–500px,
  compare table at 320px, `theme-color`, sections not yet on `Section`).
- Wave 10: marquee `document.fonts.ready.then(build)` race; client router needs the AbortSignal lifecycle
  (already in place since 5a).
- Final: rename `data-section` values together with `qa/motion-baseline.json` keys (orchestrator edits
  `qa/`), re-record the layout baseline, delete or rewrite `tools/qa/` and `tools/previews/`, full review
  of the branch against `RESTRUCTURE-PLAN.md`, then report to the user. Do not merge to `main`; the user
  decides.

### 5. Things not to do

- Do not ask the user for per-wave OKs (see "User's instruction"). Do ask before pushing, merging,
  deploying, or anything outward-facing.
- Do not edit `qa/` gate logic to make a wave pass; do not re-record a baseline on unreviewed changes.
- Do not run `verify` and `verify:motion` at the same time (fixed ports 4455 / 4466).
- Do not run expensive extra tests; the user is cost-sensitive. The five gates are enough.
