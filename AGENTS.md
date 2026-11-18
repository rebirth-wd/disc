# Subagent directives — read fully before writing anything

You are one of several agents building `/home/claude/site` (Astro 7 + Tailwind v4 + GSAP 3). An orchestrator assembles and QA's your work against the reference.

## 0. Order of authority
1. `DESIGN.md` (root), `src/styles/theme.css`, `src/styles/variables.css`, `src/tokens/tokens.json` — **these four style docs come before any other judgement.** Read all four first. Use their tokens (Tailwind utilities generated from `theme.css`, or `var(--…)` from `variables.css`). Follow the Do's/Don'ts. Never edit these files.
2. The reference page (measurements, layout, motion).
3. `DECISIONS.md`, then this file.
Where the docs give a value, use the doc's value/token. Where the docs are silent (they only sampled the homepage at 1680px), take the measured value from the reference and write it as an arbitrary Tailwind value, e.g. `mt-[72px]`.

## 1. What "replica" means here
Match the reference's **layout, spacing, typography metrics, colour, radii and motion** section by section at a 1680px viewport (then keep it sane at 1280 / 768 / 390, following how the reference itself reflows). Content is deliberately different:
- **Copy:** from `content/rebirth-copy.md` (text of rebirthwebdesign.com.au), fitted to the matching section; similar character count to the reference so line counts and block heights match. Lorem Ipsum only when nothing fits. Brand name: "Rebirth" / "Rebirth Web Design".
- **Photos:** Unsplash only. Find them (WebSearch, or `curl "https://unsplash.com/napi/search/photos?query=…&per_page=20"`), download from `images.unsplash.com/photo-…?w=1600&q=80&auto=format&fit=crop` into `src/assets/photos/<your-prefix>-name.jpg`, use via `astro:assets` `<Image>`. Pick one cohesive set: deep indigo / violet / magenta / neon-green tones, moody tech/workspace/people — it must look single-source next to the indigo canvas. Add every photo to `docs/CREDITS.md` (append one line: file, photographer, Unsplash URL). No photos of recognisable public figures.
- **Graphics:** every illustration, icon, logo, 3D-ish object and animated infographic is an **original** inline SVG / CSS / canvas piece you draw, in the same *feel* (chunky, playful, angular flat shapes, soft blurred far-field objects, pixel stars). Where the reference has a Lottie/video/animated infographic, build an original looping animation in a similar style with GSAP timelines (`repeat:-1`), SVG and CSS.
- **Hard rule — no reference brand assets:** do not download, embed, trace or redraw the Discord logo, wordmark, mascots or characters (Wumpus, Clyde, the hero people, etc.), product screenshots, fonts, videos, Lotties or any other file from discord.com. Do not write the word "Discord" in the built site. Invent different characters/objects.

## 2. Reference material (already captured, 1680×1000 viewport)
`/home/claude/ref/<home|download|nitro|careers|quests>/`
- `vp-NN.png` — viewport screenshots every 900px of scroll (NN×900 = scrollY). `full.png` — full page.
- `info.json` — `outline` (DOM tree with class names, page-absolute rect `[x,y,w,h]`, computed styles), `text` (every heading/paragraph/link with rect + computed type styles), `media` (img/video/svg/canvas rects).
- `page.html` — rendered DOM. `js-*` — the page's scripts: Webflow IX2 interaction data (`Webflow.require('ix2').init(` in the big chunk; match `data-w-id` in page.html to its events/actionLists for exact durations, easings, delays, offsets), custom scripts (e.g. `js-homepageOct2026.js`, `js-bodyEnd092026.js`, `js-careers102026.js`, `js-download.js`, `js-questsCaseStudies.js`), and `<style>` blocks/keyframes in page.html.
- Live checks: `cd /home/claude/qa && node shot.mjs <url> <out.png> [--y=N] [--full] [--sel=css] [--hover=css] [--w=390]` and `node measure.mjs <url> '<selector>' …` work for both `https://discord.com/...` and the local build. Write your own Playwright scripts in `/home/claude/qa/<your-prefix>-*.mjs` when you need to sample animation over time (copy the launch/proxy lines from `shot.mjs`). Put scratch output in `/home/claude/qa/out/<your-prefix>/`.
Look at the screenshots (Read tool) — do not work from JSON alone.

## 3. Project conventions
- Tailwind v4, tokens from `theme.css`: `bg-deep-indigo`, `bg-blurple`, `text-white`, `text-white-70`, `bg-white-10`, `font-abc-ginto-discord-nord`, `font-abc-ginto-discord`, `text-heading|heading-lg|display|marquee|body|body-xl|nav|label`, `leading-heading…`, `tracking-heading…`, `rounded-md(12) rounded-lg(16) rounded-4xl(104) rounded-5xl(120)`. **Spacing utilities are literal px names from the theme: `p-16` = 16px, `gap-48` = 48px, `mt-128` = 128px.** Only the listed steps exist (4,8,10,12,16,20,24,28,36,40,48,56,64,128,144,176); anything else is an arbitrary value `p-[52px]`.
- The font families in the tokens are aliased to Unbounded / DM Sans in `src/styles/global.css` (DECISIONS #4). Headings: Nord face, uppercase, weight 700–800, -0.01em. Body face weights 400/500 only.
- No box-shadows, no borders, no pill buttons (DESIGN.md Don'ts) unless the reference page you own measurably has them on an element the docs did not sample — then note it in your report.
- Components: `.astro` files only, in the folder you own. Scoped `<style>` for anything Tailwind can't express. Client JS in a `<script>` tag in the component (Astro bundles it): `import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; gsap.registerPlugin(ScrollTrigger);`. Scope every selector to your component root (`[data-section="…"]`). Wrap motion in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` condition. Elements must be visible if JS fails only where the reference does the same; otherwise set initial states with `gsap.set`/`from` in JS, not CSS.
- Every section root: `<section data-section="<page>-<name>">` (or div) so QA can measure it.
- **File ownership:** write only inside the paths assigned to you. Never touch `package.json`, `astro.config.mjs`, `src/styles/*`, `src/layouts/*`, `DESIGN.md`, other agents' folders, or the real pages unless they are assigned to you. Need a new dependency or a global change? Say so in your report instead.
- A shared dev server runs at `http://127.0.0.1:4321` (HMR). Do **not** run `astro build`, `npm install`, or start another server. If the port is dead: `cd /home/claude/site && (nohup npx astro dev > /tmp/astro-dev.log 2>&1 &)` once, and check `/tmp/astro-dev.log` for errors.

## 4. Definition of done (do this loop yourself before reporting)
1. Screenshot your local section(s) with `shot.mjs` at the same scroll offsets as the reference `vp-NN.png`, view both, and fix differences in layout/spacing/type/colour.
2. Measure with `measure.mjs`: your section rects (x, w, h, and y relative to section top) and heading/paragraph/button computed styles vs `info.json`. Target: within ±2% (or ±4px) on geometry; exact on font-size, weight, line-height, letter-spacing, radius, colours.
3. Motion: list every reference interaction in your area (trigger, property, from→to, duration, ease, delay/stagger) from IX2 data/scripts, implement each in GSAP, and verify by sampling frames/computed transforms over time. Loops must loop seamlessly.
4. No console errors. Check 1280, 768 and 390 widths against the live reference at the same widths.
Report back (final message, concise): files written, a table of reference-vs-build measurements, the motion inventory with implemented parameters, known gaps, and anything you need from the orchestrator. Be factual — report gaps rather than hiding them; never claim a check you did not run.
