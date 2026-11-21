# Discord — Style Reference
> arcade night sky. A saturated indigo canvas dusted with pixel stars, frosted-glass slabs floating on it, and loud white uppercase type doing the talking.

**Theme:** dark

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components. Measured from the discord.com homepage at a 1680px desktop viewport; other pages and breakpoints were not sampled. Values marked "declared" are CSS variables defined on the site but not measured on a visible homepage element.

Discord's marketing site runs on a deep indigo canvas (#1a2081) under a starfield texture, with Blurple (#5865f2) glowing through the background gradient rather than sitting on many controls. Text is almost entirely white. Structure comes from oversized frosted-glass feature blocks with 120px corner radii, each holding a 104px-radius media inset filled with a vivid gradient (magenta, green, or indigo) and a product screenshot. Headings are extra-wide, extra-bold, uppercase ABC Ginto Discord Nord with tight leading; body copy is ABC Ginto Discord at 16–20px. Controls are compact rounded rectangles (12–16px radius), mostly solid white, with one Blurple filled button. No box shadows and no borders were measured anywhere — depth comes from translucency, blur, and 3D illustration.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Blurple | `#5865f2` | `--color-blurple` | Secondary filled CTA ("Open Discord in your browser"), brand glow in the page gradient, footer wash — Discord's signature brand color; declared on the site as --blurple |
| Deep Indigo | `#1a2081` | `--color-deep-indigo` | Page canvas (body background) — the saturated dark indigo every section sits on; a starfield/gradient texture is layered over it |
| White | `#ffffff` | `--color-white` | All text on the indigo canvas, primary CTA fill, nav pill and nav button fill — the dominant foreground and the highest-emphasis control surface |
| Black | `#000000` | `--color-black` | Text on white controls (nav button, logo pill), footer base color beneath the footer gradient image |
| Not Quite Black | `#23272a` | `--color-not-quite-black` | Label text on the white hero download button; declared on the site as --not-quite-black |
| Fog | `#c7c8ce` | `--color-fog` | Hover fill of the white nav button — the only measured hover color on a filled control |
| Signal Green | `#35ed7e` | `--color-signal-green` | Skip-to-content link background; the same vivid green family fills green media insets inside feature blocks |
| Spring Green | `#57f287` | `--color-spring-green` | Declared brand accent (--spring-green) — link hover accent and media-inset fills; not used for controls on the homepage |
| Fuchsia | `#eb459e` | `--color-fuchsia` | Declared brand accent (--fuchsia) — magenta glow in media-inset gradients and link hover accent |
| Yellow | `#fee75c` | `--color-yellow` | Declared brand accent (--yellow) — link hover accent only; absent from homepage surfaces |
| White 70 | `rgba(255, 255, 255, 0.7)` | `--color-white-70` | Footer column headings and field labels (Product, Company, Language, Social) — muted white on indigo |
| White 10 | `rgba(255, 255, 255, 0.1)` | `--color-white-10` | Language select fill in the footer — translucent control surface on dark |

## Tokens — Typography

### ABC Ginto Discord Nord — All headings, the hero headline, the marquee band and the wordmark. An extra-wide, extra-bold grotesque always set in uppercase with tight leading and -0.01em tracking. · `--font-abc-ginto-discord-nord`
- **Substitute:** Unbounded, Archivo Expanded (ExtraBold), Syne ExtraBold
- **Weights:** 700, 800
- **Sizes:** 36px, 48px, 56px, 61px
- **Line height:** 0.86–1.20 (0.41 on the single-line marquee)
- **Letter spacing:** -0.01em at every size (-0.36px at 36px, -0.56px at 56px)
- **Text transform:** uppercase, always
- **Role:** All headings, the hero headline, the marquee band and the wordmark. The width of the face is the personality — headlines read as blocky, playful slabs rather than elegant titles.

### ABC Ginto Discord — Body copy, nav links, button labels, footer links and labels. · `--font-abc-ginto-discord`
- **Substitute:** DM Sans, Figtree, Inter
- **Weights:** 400, 500
- **Sizes:** 16px, 20px
- **Line height:** 1.20–1.50
- **Letter spacing:** 0.25px on 20px button labels, 0.32px on the 20px hero paragraph, normal elsewhere
- **Role:** Body copy, nav links, button labels, footer links and labels. Regular (400) for reading text and large buttons; Medium (500) for nav links and the compact nav button.

Also loaded but not rendered on the homepage: gg sans (the product UI face), Noto Sans, Source Code Pro / gg mono.

### Type Scale

Sizes are in `rem` so they follow the visitor's browser text size. The four display sizes are fluid: `clamp()` from their small size at 768px up to their full size at 1440px and wider (heading-lg reaches 48px at 1280px, matching the reference), so every layout at 1440px+ is unchanged. Letter-spacing on headings is -0.01em so it scales with the size.

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| body | ABC Ginto Discord | 400 | 1rem (16px) | 1.5 | — | `--text-body` |
| nav | ABC Ginto Discord | 500 | 1rem (16px) | 1.2 | — | `--text-nav` |
| label | ABC Ginto Discord | 400 | 1rem (16px) | 1.25 | — | `--text-label` |
| body-xl | ABC Ginto Discord | 400 | 1.25rem (20px) | 1.3 | 0.016em | `--text-body-xl` |
| heading | ABC Ginto Discord Nord | 800 | fluid 27→36px | 0.93 | -0.01em | `--text-heading` |
| heading-lg | ABC Ginto Discord Nord | 700 | fluid 32→48px | 1.2 | -0.01em | `--text-heading-lg` |
| display | ABC Ginto Discord Nord | 700 | fluid 36→56px | 0.857 | -0.01em | `--text-display` |
| marquee | ABC Ginto Discord Nord | 700 | fluid 47→61px | 0.41 | -0.01em | `--text-marquee` |

## Tokens — Spacing & Shapes

**Density:** spacious

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 28 | 28px | `--spacing-28` |
| 36 | 36px | `--spacing-36` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 128 | 128px | `--spacing-128` |
| 144 | 144px | `--spacing-144` |
| 176 | 176px | `--spacing-176` |

### Border Radius

| Element | Value |
|---------|-------|
| buttons | 12px |
| nav controls | 16px |
| inputs | 16px |
| media | 104px |
| cards | 120px |

### Layout

- **Page max-width:** 1240px (container), with 40px side gutters
- **Section gap:** ~190px between feature blocks (measured 144–190px)
- **Card padding:** 28px (52px on the text side)
- **Card inner gap:** 48px between media inset and text column
- **Element gap:** 8px

## Components

### Primary CTA Button (White)
**Role:** Main conversion action ("Download for Mac")

Solid White (#ffffff) fill, Not Quite Black (#23272a) text. 12px border-radius. Padding 15px vertical, 24px horizontal (56px left when a leading download icon is present). ABC Ginto Discord 400 at 20px, line-height 26px, letter-spacing 0.25px. Rendered height 65px. No border, no shadow. Transition 0.2s ease-in-out.

### Secondary CTA Button (Blurple)
**Role:** Paired alternative action ("Open Discord in your browser")

Blurple (#5865f2) fill, White text. 12px border-radius. Padding 19.5px vertical, 24px horizontal. Same 20px/400 label as the primary. Rendered height 65px. Sits to the right of the white button with equal height.

### Nav Button
**Role:** Persistent top-right action ("Open Discord")

White fill, Black text. 16px border-radius. Padding 10px vertical, 16px horizontal. ABC Ginto Discord 500 at 16px, line-height 1.2, letter-spacing 0.25px. Rendered 39px tall. Hover fill Fog (#c7c8ce). Stays fixed at the top right while scrolling.

### Navigation Bar
**Role:** Top-level site navigation

Transparent over the canvas at the top of the page: logo lockup left, centered row of White links (ABC Ginto Discord 500, 16px; several with dropdown chevrons), nav button right. After scrolling, the links disappear and the logo lockup collapses into a small White pill (16px radius, ~40px tall, black logo) pinned top-left, mirrored by the nav button top-right. Dropdown panels use a 982px content width.

### Glass Feature Block
**Role:** Alternating product feature sections

1240×610px slab, 120px border-radius. Background is a translucent white diagonal gradient (135deg, starting at 20% white) over a glass texture image, with `backdrop-filter: blur(10px)`. Padding 28px (52px on the text side), 48px gap. Two columns: media inset on one side, heading + paragraph on the other; sides alternate block to block. No border, no shadow.

### Media Inset
**Role:** Screenshot/video frame inside a feature block

104px border-radius, overflow clipped, ~554px tall. Filled with a vivid gradient — magenta/fuchsia, green, or deep indigo — behind a product UI screenshot or looping video. The saturated inset is where accent color lives; it never appears on controls.

### Feature Text Column
**Role:** Copy inside a feature block

Heading: ABC Ginto Discord Nord 800, 36px, line-height 0.93, uppercase, White, -0.36px tracking, wrapping to 2–3 short lines. Paragraph: ABC Ginto Discord 400, 20px, line-height 26px, White.

### Marquee Band
**Role:** Full-width rhythm break between feature groups

Edge-to-edge translucent band scrolling the words TALK / PLAY / CHAT / HANG OUT in ABC Ginto Discord Nord 700 at 61px, uppercase, White, separated by small white Discord logo glyphs.

### Closing CTA
**Role:** End-of-page conversion

Centered two-line heading (ABC Ginto Discord Nord 700, 48px, line-height 1.2, uppercase) above a single centered white Primary CTA Button, followed by a row of character illustrations standing on the footer edge.

### Language Select
**Role:** Footer locale picker

White 10% (rgba(255,255,255,0.1)) fill, 16px border-radius, 314×56px. Padding 17.5px vertical, 24px left, 16px right; 8px gap to the chevron. ABC Ginto Discord 400 at 16px, White text. Label above in White 70%.

### Footer
**Role:** Site map and brand sign-off

Indigo-to-Blurple vertical gradient (black base beneath a gradient image). Left: logo mark, language select, social icon row (monochrome white glyphs). Right: four link columns — heading in White 70% (16px/400, line-height 20px), links in White (16px/400, line-height 24px). Bottom: an oversized, cropped "Discord" wordmark in pale lavender spanning the full width.

### Skip Link
**Role:** Keyboard accessibility

Signal Green (#35ed7e) fill, Black text, 12px radius, padding 13px/24px, 16px/500. Visible on focus only.

## Do's and Don'ts

### Do
- Set every heading in ABC Ginto Discord Nord, uppercase, weight 700–800, with -0.01em tracking and leading under 1.0 for stacked multi-line headlines
- Keep text White on the indigo canvas; use White 70% only for footer headings and field labels
- Use solid White as the primary button fill and Blurple (#5865f2) for one paired secondary action
- Use 12px radius on large buttons and 16px on nav-level controls and inputs
- Build feature sections as frosted-glass slabs: 120px radius, translucent white gradient, 10px backdrop blur, with a 104px-radius media inset
- Put accent color (fuchsia, green) inside media insets and illustrations, not on controls
- Leave generous vertical air (~150–190px) between feature blocks so the starfield reads through

### Don't
- Do not add drop shadows or borders — none were measured; depth comes from translucency and blur
- Do not use pill (fully rounded) buttons — controls are rounded rectangles at 12–16px
- Do not set headings in mixed case or in the body face
- Do not use weights above 500 in ABC Ginto Discord, or below 700 in ABC Ginto Discord Nord
- Do not place body text on a light surface — the homepage has no light sections
- Do not use Blurple as a text color on the indigo canvas; contrast is too low
- Do not apply the 120px radius to small elements — it only works at slab scale (600px+ tall)

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Deep Indigo Canvas | `#1a2081` | Page background — saturated dark indigo with starfield texture |
| 1 | Glass Block | `rgba(255, 255, 255, 0.2)` | Feature blocks — translucent white gradient (135deg, starting at 20% white) over a glass texture with 10px backdrop blur |
| 2 | White Control | `#ffffff` | Primary buttons, nav pill, nav button — solid white controls |
| 3 | Blurple Action | `#5865f2` | Secondary filled CTA — the only solid brand-color control surface |

## Elevation

Shadowless. No `box-shadow` was measured on any homepage element. Hierarchy comes from translucent glass slabs with backdrop blur over the canvas, solid white controls against dark, and 3D-rendered objects (blurred in the far field, sharp in the near field) that create parallax depth around the blocks.

## Imagery

Illustration-led, no photography as art direction. Three layers: (1) a starfield of small square "pixel" stars and plus-shaped sparkles over an indigo-to-blurple gradient; (2) soft 3D-rendered objects — eggs, coins, a box, a radish, a potion — floating between sections, some deliberately out of focus; (3) flat, angular character illustrations (people plus mascots like Wumpus and Clyde) in the hero and above the footer. Product imagery is real UI: phone and desktop screenshots or short looping clips inside the media insets, on vivid gradient fills. Platform and social icons are simple monochrome glyphs.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #1a2081 (Deep Indigo)
- Card/content surface: rgba(255,255,255,0.2) glass gradient + 10px backdrop blur
- Primary text/headings: #ffffff (White)
- Primary action: #ffffff fill, #23272a text
- Secondary action: #5865f2 (Blurple) fill, #ffffff text
- Muted text: rgba(255,255,255,0.7)
- Input fill (dark sections): rgba(255,255,255,0.1)

## 3-5 Example Component Prompts
1. Create a Primary Action Button: #ffffff background, #23272a text, 12px radius, 15px/24px padding, ABC Ginto Discord 400 at 20px with 0.25px letter-spacing. No border, no shadow.

2. **Hero**: #1a2081 background with a blurple radial glow. Left column: h1 in ABC Ginto Discord Nord 700, 56px, line-height 0.857, uppercase, white, -0.56px tracking, three short lines. Paragraph below in ABC Ginto Discord 400 20px/26px white. Centered beneath: white button and #5865f2 button side by side, both 65px tall, 12px radius.

3. **Glass Feature Block**: 1240px wide, 610px tall, 120px radius, background linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)), backdrop-filter blur(10px), padding 28px 52px 28px 28px, 48px gap. Left: media inset with 104px radius and a magenta gradient fill holding a phone screenshot. Right: 36px ABC Ginto Discord Nord 800 uppercase heading (line-height 0.93) and a 20px/26px white paragraph.

4. **Marquee Band**: Full-width band, translucent white ~10%, scrolling words in ABC Ginto Discord Nord 700 at 61px uppercase white, separated by small white logo glyphs.

5. **Footer**: Vertical gradient from #1a2081 to #5865f2. Four link columns: heading rgba(255,255,255,0.7) 16px, links #ffffff 16px/24px. Language select: rgba(255,255,255,0.1) fill, 16px radius, 56px tall. Oversized cropped wordmark across the bottom.

## Signature Motifs

Three visual signatures define the Discord homepage: (1) The glass slab — a 120px-radius frosted block with a 104px-radius vivid media inset; the nested oversized radii are the most recognizable shape on the page. (2) Wide uppercase headlines — ABC Ginto Discord Nord at 700–800, stacked with sub-1.0 leading, reading as chunky white blocks. (3) The indigo night sky — #1a2081 canvas, blurple glow, pixel stars and floating 3D objects, with solid white rounded-rectangle controls sitting on top.

## Similar Brands

- **Twitch** — Saturated purple brand canvas, bold wide display type, and a playful gaming-community tone
- **Figma (Config/brand pages)** — Oversized radii, vivid gradient-filled media frames, and wide grotesque headlines
- **Duolingo** — Mascot- and character-led illustration with chunky rounded shapes and a single dominant brand color
- **Linear** — Dark canvas with glass/blur surfaces and glow gradients standing in for shadows
- **Arc (The Browser Company)** — Bold color fields, 3D playful objects, and compact rounded-rectangle white buttons

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-blurple: #5865f2;
  --color-deep-indigo: #1a2081;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-not-quite-black: #23272a;
  --color-fog: #c7c8ce;
  --color-signal-green: #35ed7e;
  --color-spring-green: #57f287;
  --color-fuchsia: #eb459e;
  --color-yellow: #fee75c;
  --color-white-70: rgba(255, 255, 255, 0.7);
  --color-white-10: rgba(255, 255, 255, 0.1);

  /* Typography — Font Families */
  --font-abc-ginto-discord-nord: 'ABC Ginto Discord Nord', Arial, sans-serif;
  --font-abc-ginto-discord: 'ABC Ginto Discord', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 1rem;
  --leading-body: 1.5;
  --text-nav: 1rem;
  --leading-nav: 1.2;
  --text-label: 1rem;
  --leading-label: 1.25;
  --text-body-xl: 1.25rem;
  --leading-body-xl: 1.3;
  --tracking-body-xl: 0.016em;
  --tracking-button: 0.25px;
  --text-heading: clamp(1.6875rem, 1.0446rem + 1.3393vw, 2.25rem);
  --leading-heading: 0.93;
  --tracking-heading: -0.01em;
  --text-heading-lg: clamp(2rem, 0.5rem + 3.125vw, 3rem);
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01em;
  --text-display: clamp(2.25rem, 0.8214rem + 2.9762vw, 3.5rem);
  --leading-display: 0.857;
  --tracking-display: -0.01em;
  --text-marquee: clamp(2.9375rem, 1.9375rem + 2.0833vw, 3.8125rem);
  --leading-marquee: 0.41;
  --tracking-marquee: -0.01em;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-176: 176px;

  /* Layout */
  --page-max-width: 1240px;
  --page-gutter: 40px;
  --section-gap: 190px;
  --card-padding: 28px;
  --card-gap: 48px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-4xl: 104px;
  --radius-5xl: 120px;

  /* Named Radii */
  --radius-buttons: 12px;
  --radius-nav-controls: 16px;
  --radius-inputs: 16px;
  --radius-media: 104px;
  --radius-cards: 120px;

  /* Effects */
  --blur-glass: 10px;
  --transition-control: 0.2s ease-in-out;

  /* Surfaces */
  --surface-deep-indigo-canvas: #1a2081;
  --surface-glass-block: rgba(255, 255, 255, 0.2);
  --surface-white-control: #ffffff;
  --surface-blurple-action: #5865f2;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-blurple: #5865f2;
  --color-deep-indigo: #1a2081;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-not-quite-black: #23272a;
  --color-fog: #c7c8ce;
  --color-signal-green: #35ed7e;
  --color-spring-green: #57f287;
  --color-fuchsia: #eb459e;
  --color-yellow: #fee75c;
  --color-white-70: rgba(255, 255, 255, 0.7);
  --color-white-10: rgba(255, 255, 255, 0.1);

  /* Typography */
  --font-abc-ginto-discord-nord: 'ABC Ginto Discord Nord', Arial, sans-serif;
  --font-abc-ginto-discord: 'ABC Ginto Discord', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-body: 1rem;
  --leading-body: 1.5;
  --text-nav: 1rem;
  --leading-nav: 1.2;
  --text-label: 1rem;
  --leading-label: 1.25;
  --text-body-xl: 1.25rem;
  --leading-body-xl: 1.3;
  --tracking-body-xl: 0.016em;
  --tracking-button: 0.25px;
  --text-heading: clamp(1.6875rem, 1.0446rem + 1.3393vw, 2.25rem);
  --leading-heading: 0.93;
  --tracking-heading: -0.01em;
  --text-heading-lg: clamp(2rem, 0.5rem + 3.125vw, 3rem);
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -0.01em;
  --text-display: clamp(2.25rem, 0.8214rem + 2.9762vw, 3.5rem);
  --leading-display: 0.857;
  --tracking-display: -0.01em;
  --text-marquee: clamp(2.9375rem, 1.9375rem + 2.0833vw, 3.8125rem);
  --leading-marquee: 0.41;
  --tracking-marquee: -0.01em;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-128: 128px;
  --spacing-144: 144px;
  --spacing-176: 176px;

  /* Border Radius */
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-4xl: 104px;
  --radius-5xl: 120px;
}
```
