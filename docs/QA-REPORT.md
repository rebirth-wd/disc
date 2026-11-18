# QA report — final pass (production build, Playwright, headless Chromium)

Measured by the orchestrator against the reference captures taken at a 1680×1000 viewport.

## Section geometry at 1680px (top-level sections: page y and height vs reference, tolerance 3px)
| Page | Document height (build / reference) | Sections matched |
|---|---|---|
| `/` | 8125 / 8124 | 11 of 11 |
| `/download` | 6376 / 6376 | 5 of 5 |
| `/nitro` | 12660 / 12659 | 9 of 9 |
| `/careers` | 8826 / 8825 (reference minus the omitted 6718px job-listings block) | 10 of 10 (banner 3172/677 vs reference 3171/677, checked by hand; the script's cut-off excluded it) |
| `/ads/quests` | 6689 / 6689 | 12 of 12 |

No console or page errors and no horizontal overflow on any page at 1680, 1280, 768 or 390px.
No reference brand text or reference-hosted asset URL in the built HTML.

## What this does and does not show
- It shows layout parity: section positions and sizes. Type metrics, radii, colours and motion parameters were measured per section by the building agents (tables in their reports, summarised in the hand-over message); the orchestrator spot-checked screenshots of every page's first screen and four home offsets.
- It is **not** a pixel-similarity score. Copy, photos, illustrations and fonts differ from the reference by brief, so a pixel diff was not used as the acceptance number.

## Known gaps
- Fonts are substitutes (Unbounded, DM Sans): heading and nav text widths differ by a few percent.
- 768px and 390px: section heights drift where text wraps differently (largest: nitro comparison table 480px shorter at 390; careers cards 104px shorter at 768).
- Motion not time-sampled against the reference: burger menu and footer accordions, home inset loops for features 1–4 and 6 across the loop wrap, four of six nitro loops, quests carousel easing curve. Reduced-motion mode was not run in a browser on any page.
- Additions not in the reference: idle float on home features 4–6 objects, idle motion on the closing-banner cast, seamless marquee loop (reference resets visibly).
- Not reproduced: home "eyes" animation above feature 4, download-page nav background fade on scroll, closing-banner easter-egg audio, 31-language list (8 built), quests carousel has 8 slides (reference 22).
- Content to review before publishing: six careers FAQ answers composed from feature copy; nav labels; placeholder prices/stats ("$XX", "XX%"); the `download-workspace.jpg` credit (two names shown on its Unsplash page); `featA-purple-setup.jpg` source file contains hardware brand logos outside the crop used.
