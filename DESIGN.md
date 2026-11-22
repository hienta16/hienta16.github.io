---
name: Catwalk of Curiosity
description: Hien Ta's GitHub companion (v3). Real GitHub numbers on flat Electric Baby Pop fields, a measuring-tape header, and a soft 2.5D tortoiseshell cat with her toys as the only dimensional art. The profile README is a second surface of the same system.
colors:
  cream: "#FFF9F4"
  pink: "#F49CB6"
  blue: "#2463F6"
  orange: "#FF7029"
  pale: "#FFE5EE"
  ink: "#22243A"
  white: "#FFFFFF"
  ink-2: "#4E4F63"
  ink-3: "#2C2F4A"
  night-2: "#C9CAD8"
  pale-fg-2: "#46384A"
  pink-fg-2: "#33283C"
  level-0: "#383B5C"
  level-1: "#FFE5EE"
  level-2: "#F9C2D3"
  level-3: "#F49CB6"
  level-4: "#FF7029"
  tortie-base: "#221B1F"
  tortie-lit: "#3B3034"
  tortie-rust: "#9A4220"
  tortie-ginger: "#D2672A"
  tortie-tan: "#D9A06A"
  tortie-peach: "#EDBE97"
  tortie-ear: "#B98683"
  tortie-iris-hi: "#F3F0A6"
  tortie-iris: "#D7DC72"
  tortie-iris-lo: "#A3AD3D"
  yarn-pink-deep: "#C95F80"
  yarn-blue-deep: "#163A9E"
  feather-deep: "#C94E16"
  kraft-front: "#D49A5E"
  kraft-side: "#B07738"
typography:
  display:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(48px, 7vw, 108px)"
    fontWeight: 800
    lineHeight: 0.88
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 80"
  display-close:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(64px, 10vw, 156px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 76"
  hello:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 62px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 92"
  role:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(30px, 3.3vw, 50px)"
    fontWeight: 850
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 100"
  numeral:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(48px, 5.6vw, 84px)"
    fontWeight: 850
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 100"
  streak:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(64px, 7vw, 104px)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  lead-display:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(22px, 2vw, 30px)"
    fontWeight: 750
    lineHeight: 1.22
    fontVariation: "'wdth' 94"
  card-title:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(20px, 1.7vw, 24px)"
    fontWeight: 800
    lineHeight: 1.15
    fontVariation: "'wdth' 92"
  button:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "17px"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 90"
  shield:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "15px"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 84"
  label:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 64"
  lead:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(18px, 1.5vw, 22px)"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "17px (18px from 1100px)"
    fontWeight: 400
    lineHeight: 1.6
  note:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  swatch: "3px"
  bar: "4px"
  tooltip: "10px"
  role: "12px"
  gift: "18px"
  pin: "20px"
  card: "24px"
  panel: "28px"
  pill: "999px"
  round: "50%"
spacing:
  u: "8px"
  gutter: "clamp(16px, 4.4vw, 64px)"
  measure: "1360px"
  section-y: "clamp(88px, 10vw, 152px)"
  header-h: "58px (54px under 760px)"
  tape-lane: "26px"
  card-gap: "clamp(14px, 1.6vw, 22px)"
components:
  button-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "52px"
    padding: "0 24px"
    typography: "{typography.button}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "52px"
    padding: "0 24px"
    typography: "{typography.button}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "52px"
    padding: "0 24px"
    typography: "{typography.button}"
  role-cut:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.role}"
    padding: "0.08em 0.32em 0.12em"
    typography: "{typography.role}"
  status-pill:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 18px 10px 14px"
  github-pill:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "26px"
    padding: "0 12px"
  shield-key:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    typography: "{typography.shield}"
  shield-value:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    typography: "{typography.shield}"
  seg-button:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  seg-button-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  gh-card:
    backgroundColor: "{colors.ink-3}"
    textColor: "{colors.cream}"
    rounded: "20px"
    padding: "16px 20px 14px"
  year-tooltip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tooltip}"
    padding: "8px 12px"
  beat-play:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    size: "clamp(120px, 12vw, 156px)"
  toy-panel:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(20px, 2.2vw, 28px)"
  gift-option:
    backgroundColor: "{colors.pale}"
    textColor: "{colors.ink}"
    rounded: "{rounded.gift}"
    padding: "10px 14px 10px 10px"
  gift-option-on:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.gift}"
  scene-tag:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  scene-tag-preview:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
  pin-slot:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pin}"
    padding: "20px"
  pin-note:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Catwalk of Curiosity (v3)

Recorded from the shipped code on 23/11/2026: site `D:\hienta16.github.io` (`src/styles/base.css`, `src/components/*`) and hub `D:\hienta16` (`catwalk/render/*.py`, `README.md`). Where this file and the code disagree, the code wins and this file is out of date.

## Overview

**Creative North Star: "My GitHub, styled, with my cat"**

A one-page GitHub companion. Seven full-bleed sections, each one flat field of colour, in this order (`src/App.tsx`):

| # | Section | Component | Field | Job |
|---|---|---|---|---|
| 1 | Hello | `Hero.tsx` | cream | "Hi, I'm Hien Ta!", the orange Data Analyst cut, two lines, GitHub + LinkedIn, the cat in a blue disc with a status pill |
| 2 | About | `About.tsx` | pale | title, display lead, shields, the story column; a tick tape closes it |
| 3 | GitHub activity | `GitHubStats.tsx` | ink | one compact dashboard: the 3D year with streaks (60%), GitHub stats and top languages (40%) |
| 4 | Contribution beat | `Beat.tsx` | blue | every day since the first contribution as one step; play with sound |
| 5 | The cat's toy box | `ToyBox.tsx` | pink | a room with the cat, visitors' toys and a gift panel |
| 6 | Backstage | `Backstage.tsx` | cream | three honestly empty pinned-repository slots |
| 7 | Let's talk data. | `Contact.tsx` | orange | the closing title, ink buttons, the cat bowing |

Above them sits `TapeHeader.tsx`: a fixed pink measuring tape with section marks and a small ruler cat walking it to the reader's place.

Two materials, kept apart. **Everything that carries information is flat**: solid fields, solid cards, solid bars, a projected 3D year drawn as flat-filled faces. **Only the cat and her toys are dimensional**: the tortoiseshell cat (`TortieCat.tsx`) and the toys (`Cat.tsx`) use radial and linear gradients, soft blurred rims and blurred ground shadows, so they read as living objects on a printed page.

**Key Characteristics:**
- One flat field per section; GitHub data on the ink field, the beat on blue, the cat on pink, the close on orange
- Orange is the energy: the role, the primary actions, the status and GitHub pills, the busiest level, the streak, the current beat step, the closing field
- The numbers come only from data; a missing number reads `n/a`
- Soft 2.5D art for the cat and toys only; flat everywhere else
- Anybody's width axis carries display, labels and numerals; Be Vietnam Pro reads
- All art and icons are inline SVG; no raster ships

## Colors

Six owner-pinned colours (Electric Baby Pop), declared in `src/styles/base.css` `:root` and mirrored in the hub's `catwalk/render/theme.py`. Supporting tones exist only for secondary text, the contribution levels and the cat.

### Brand
- **Warm Cream** (`--cream` #FFF9F4): Hello and Backstage fields, first paint, the tape's cat lane, the toy panel, the year tooltip, text on ink.
- **Pale Pink** (`--pale` #FFE5EE): About field, the toy room's wall, gift options, Backstage placeholder lines, level 1.
- **Baby Pink** (`--pink` #F49CB6): the tape (header, About's closing strip, the year's month tape), the toy-box field, the room's rug, past beat steps, the streak meter, icons in the activity rows, level 3. On ink it may be text (the year's "contributions" label, 7.4:1).
- **Vivid Orange** (`--orange` #FF7029): see the Orange Energy Rule. Also level 4 (the busiest days).
- **Electric Blue** (`--blue` #2463F6): the hero avatar disc, the beat field, the weekly-rhythm bars, the hero's second line (display, 19-24px, on cream), the sleeping "z z" in the toy room. Text on blue is white (5.0:1).
- **Dark Ink** (`--ink` #22243A): all text on light fields, the GitHub field, shield keys, ink buttons, the shelf, toy tags, the wand string, the phone section sheet.

### Supporting
- **Secondary text:** `--ink-2` #4E4F63 on cream (7.7:1), #46384A on pale, #33283C on pink, `--night-2` #C9CAD8 on ink (9.6:1). Each field sets its own `--fg-2`.
- **Raised Ink** (`--ink-3` #2C2F4A): the four GitHub cards and the year's floor slab.
- **Contribution levels** (`LEVEL_COLORS` in `src/lib/stats.ts`, `LEVEL_TOP` in `theme.py`): level 0 #383B5C (an empty day, a quiet step up from ink), then #FFE5EE, #F9C2D3, #F49CB6, #FF7029. Front and side faces are the top colour mixed toward ink by 22% and 42% (`iso.py`).
- **Tortoiseshell** (`TORTIE` in `TortieCat.tsx`): base #221B1F, lit #3B3034, rust #9A4220, ginger #D2672A, tan #D9A06A, peach #EDBE97, ear #B98683, yellow-green iris #F3F0A6 / #D7DC72 / #A3AD3D. These belong to the cat and the ruler cat only.
- **Toys** (`TOY_COLORS` in `Cat.tsx`): yarn in pink or blue with a deeper and a lighter strand tone, the feather in orange, the box in kraft browns.

### Named Rules
**The Orange Energy Rule.** Orange marks the thing with energy: the role, the action to take, the status, the streak, the busiest days, the step playing now, the selected gift, the closing call. On cream, pale, pink and blue it is only ever a fill; text on orange is ink. Orange text appears only on ink (the streak numeral, the contributions row, the current item in the phone sheet, the GitHub link on hover).

**The Field Token Rule.** Every section is `.field .field--{cream|pale|pink|orange|blue|ink}` and gets `--bg`, `--fg`, `--fg-2`, `--rule` and `--focus` from it. Components read those tokens instead of hard-coding a colour.

**The Empty Recedes Rule.** An empty day is level 0 on ink, a rest step on the beat is a 6px pill at 45% white, an unfilled slot is a dashed outline. Nothing empty wears a brand colour.

**The Level Colours Stay Data Rule.** The level ramp colours blocks and legend swatches and nothing else; it is never text.

**The Cat's Own Palette Rule.** The tortoiseshell colours and the yellow-green eyes are the cat's; they do not leak into UI, and the brand palette does not recolour the cat.

## Typography

**Display:** Anybody Variable (wdth axis, weights to 900), fallback Arial Narrow. **Text:** Be Vietnam Pro 400/500/600/700, fallback Segoe UI, system-ui. Both self-hosted through @fontsource.

Hierarchy runs along Anybody's width as much as its size: narrow cuts (64-76%) for labels and tape marks, mid (80-92%) for titles, buttons and card titles, full width (94-100%) for the role, the hero's second line and the big numerals.

| Token | Use | Spec |
|---|---|---|
| display | section titles (`.title`) | 800, wdth 80, clamp 48-108px, lh 0.88, -0.02em, uppercase, balanced |
| display-close | "Let's talk data." | 800, wdth 76, clamp 64-156px, lh 0.86, uppercase |
| hello | the hero greeting (h1) | 800, wdth 92, clamp 36-62px, lh 1, sentence case |
| role | "Data Analyst" on its orange cut | 850, wdth 100, clamp 30-50px, lh 1.1 |
| numeral | the year's contribution total | 850, wdth 100, clamp 48-84px, cream on ink |
| streak | the current streak | 850, clamp 64-104px, lh 0.9, orange on ink |
| lead-display | About's lead; the beat's status line uses 750, wdth 90, 18-22px | 750, wdth 94, clamp 22-30px, lh 1.22 |
| card-title | GitHub card titles; gift names 19px, pin kinds 20px | 800, wdth 92, clamp 20-24px |
| button | every pill button | 750, wdth 90, 17px, 0.01em |
| shield | About shields | 750, wdth 84, 15px, 0.05em, uppercase |
| label | tape marks (14px, wdth 72), legend and weekdays (12px, wdth 76), room hints and panel legends (12-13px, wdth 80) | 700, wdth 64, 13px, 0.06em, uppercase |
| lead | `.sub`, the hero lines, section lines | 500, clamp 18-22px, lh 1.45, max 36-44ch, `--fg-2` |
| body | reading text; About's first paragraph is 500 at 19-22px with a 6px orange left rule | 400, 17px (18px from 1100px), lh 1.6 |
| note | footnotes, card notes, status lines | 400, 14px, lh 1.5 |

### Named Rules
**The Tailored Width Rule.** Pick a width from the steps in use (64, 72-80, 84-94, 100); never add a second display family.

**The Numbers Are Tabular Rule.** Stat values, percentages, counts and table figures use `font-variant-numeric: tabular-nums`.

## Layout

Full-bleed fields, each holding a centred `.wrap` (measure 1360px plus a fluid 16-64px gutter); vertical rhythm is `--section-y` (88-152px); spacing derives from an 8px module.

- **Header:** fixed, 58px (54px under 760px): a 26px cream lane for the ruler cat over the pink tape. `scroll-padding-top` clears it.
- **Hello:** two columns (copy 11fr, stage 10fr), filling the viewport at 1024 x 680 and up; stacked under 900px.
- **About:** 5fr intro, 6fr story column (max 60ch); one column under 900px.
- **GitHub stats:** head with title and "updated" meta; the 3D year full width with its headline in the empty top-right corner (static and left-aligned under 760px, where the compact 177-day drawing replaces the full year); a 12-column card grid (activity 7 + streaks 5, languages 7 + rhythm 5), one column under 1000px.
- **Beat:** head 6fr / 5fr; the play disc beside the strip; under 760px the strip goes on top.
- **Toy box:** head 6fr / 5fr; the room 7fr beside the gift panel (min 300px) 4fr; one column under 1000px. The room is 16:11 (1:1.02 on phones).
- **Backstage:** 5fr text, 7fr three pins; pins become one-line rows under 600px.
- **Contact:** title and links 7fr, cat 3fr; one column under 760px.

Breakpoints in use: 599, 759, 899, 999, 1024 x 680, 1100.

## Elevation & Depth

Information has no elevation. Fields, cards, pills, shields and bars are solid; things in front overlap (the cat breaks out of the top of the blue disc, the status pill sits on the disc's rim inside a 4px cream ring).

Depth lives in two places only:
1. **The 3D year** is a projection drawn as flat polygons: an ink-3 slab, a pink month tape, one block per day with a top face in its level colour and front and side faces mixed toward ink. No gradients, no shadows.
2. **The cat and toys** are soft 2.5D: radial shading gradients, a ginger rim light (blurred, masked), a blurred ground-shadow ellipse in ink at 28% (cat) or 14-18% (toys), white highlight strokes. The cardboard box is split into back and front parts so the cat can sit inside it.

### Named Rules
**The Flat Information Rule.** No gradient, shadow, glow or blur on any field, card, control or chart. The toy room's wall and floor are two flat bands (a hard-stop gradient); inset box-shadows appear only as flat ring strokes on the rug and as the orange stripe on the selected gift.

**The Dimensional Art Rule.** Gradients and blur are allowed inside `TortieCat.tsx` and the toy art in `Cat.tsx`, and nowhere else.

## Shapes

Soft where you touch, square where you read a label. Buttons, pills, toy tags, the segmented control and the GitHub pill are full pills (999px); the beat play button and the avatar disc are circles. GitHub cards round at 24px, the toy room and gift panel at 28px, gift options 18px, Backstage pins 20px, the role cut 12px, the year tooltip 10px, legend swatches 3px, language bars 4px, rhythm bars 6px top / 3px bottom. Shields and field edges stay square. Borders are 2-2.5px ink; unfilled slots are 2px dashed. Recurring silhouettes: the ticked measuring tape (pink, ink ticks every 8px, longer every 40px), the blue disc ringed with cream ticks, the oval pink rug.

## Components

### Buttons (`base.css` `.btn`)
- **Orange (primary):** orange fill, ink text; ink border on cream, pale and pink, orange border elsewhere.
- **Ghost:** transparent, border and text in the field's `--fg`.
- **Ink:** ink fill, cream text; the closing links. The toy panel's full-width give button is this button recoloured orange with an ink border.
- **States:** hover lifts 2px over 200ms; active settles; focus is a 3px outline in the field's `--focus` colour, 3px offset (orange on ink, cream on blue). 52px tall, icons 20px.
- **Text button / link:** 600, 2px underline at 0.22em offset, 44px target.

### Tape header (`TapeHeader.tsx`)
Pink tape with ink ticks; the brand label with an ink tip at the left; section names in the label cut at their measured scroll positions above 2px ink marks. The current section is weight 900 and `aria-current="location"`. A 5px orange fill grows to the reader's place. The orange GitHub pill sits on the tape's end. Under 760px its label hides and an ink menu button opens a full-screen ink sheet (pink tick margin, items in display 800 up to 52px, the current item orange, a 360ms clip-reveal).

### Ruler cat (`RulerCat` in `Cat.tsx`)
A side-view tortoiseshell on the tape. Poses: **walk** while scrolling, **run** on fast scroll, **sit** 260ms after stopping (a tail flick every 2.8s), **sleep** after 9s idle (floating z's), **play** with a pink yarn ball at the end of the page. It faces the scroll direction. Click: an ink "meow" bubble for 1.3s.

### The tortoiseshell cat (`TortieCat.tsx`, `TortieCat.css`), the signature
A 320 x 380 soft 2.5D SVG of the owner's cat: mottled coat, peach blaze, big yellow-green eyes. **Gaze:** head, face, ears and pupils follow the pointer (260ms ease); pupils dilate with curiosity. **Life** (`alive`): breathing (3.8s), a tail flick (5.4s), random blinks (every 2.4-6.2s), ear twitches (every 4.2-9.4s). **Moods:** `idle`, `blink`, `happy` (half-closed eyes), `sleep` (eyes closed, head lowered, slower breath), `crouch` (body squashed, head down), `swat` (paw raised), `bob` (head nod), `bow` (head down 14px). Used in the hero (click = happy, then a slow blink), the toy room (each toy has its own play sequence) and the close (bows once when seen, and on click).

### Toys (`Cat.tsx`)
`YarnBall` (pink or blue, wrapped strands, a loose end), `Feather` (orange; in the room it hangs from the ceiling on a string as a swinging wand), `CardboardBox` (`whole`, `back` and `front` parts so the cat can get in: peek, sleep with "z z", blink, sit up). In the room the pointer becomes a yarn ball on fine pointers; a tap leaves an orange ripple. Each toy carries a tag (ink pill, shown on hover and focus).

### GitHub activity (`GitHubStats.tsx`, `GitHubStats.css`)
One compact dashboard, modelled on the proportions of a GitHub README stats block (owner, 23/11/2026): the whole
section fits one desktop viewport. Title in display uppercase at clamp(28px, 3vw, 42px); card titles 16px; values
16–24px; labels 11–14px. No giant numbers.

- **Grid:** `minmax(0, 60fr) minmax(0, 40fr)`, 16px gaps; one column below 1000px (the right cards side by side
  until 760px, then stacked).
- **Left panel (ink-3, 20px corners):** the total and span on one line; the 3D year; a row of three small streak
  tiles (current streak in orange, longest in pink, active days in light blue #8DB0FF); the level legend; a
  `<details>` "Weekly rhythm and monthly numbers" holding seven small blue bars and the month table.
- **Right column:** a *GitHub stats* card (six aligned rows: contributions as the strong orange row, commits
  authored, pull requests, issues opened, repos contributed to, stars earned; icons alternate orange, pink, light
  blue) with an "i" tooltip that explains contributions versus commits; a *Top languages* card with one stacked bar
  (2px gaps; orange, pink, #8DB0FF, pale, blue, and grey for Other), a two-column key with percentages, and a small
  By size / By repo toggle.
- **Below:** one line of source note, plus a stale warning once the data is 3 or more days old.

The earlier detail of this section (kept for the year's mechanics):
- **The 3D year:** not drawn in React. Python in the hub (`catwalk/render/iso.py`, `site_svg`) writes `assets/generated/iso-site.svg` and `iso-site-compact.svg`; `scripts/sync_hub.py` copies them to `src/data/hub/iso.svg` and `iso-compact.svg`, which are inlined (`?raw`) and replaced by the live file once the hub is public (`useLiveSvg`). Every block is `.iso-b.iso-l{0-4}` with `data-date`, `data-count` and `--w` (its week). The site adds the total line, the five-swatch legend, the cream tooltip over the hovered block (count and weekday date), and the rise-in.
- If the data fails to load, the section keeps its title and says so rather than showing a guess.

### Contribution beat (`Beat.tsx`)
On blue: one cream pill per day since the first contribution, height by the square root of the count; rest days are 6px pills; a gap opens at each new week. The orange play disc pulses an orange ring on each hit (scaled by loudness); played steps turn pink, the current one orange. A live line names the date and count. Sound plays only after a press (Web Audio, `src/lib/sonify.ts`), with a visible stop; a note appears when audio is unsupported.

### Toy box (`ToyBox.tsx`)
The room (pale wall, cream floor, pink rug, an ink shelf showing gift counts by toy) beside a cream panel: a radio list of gifts (pale options; the chosen one white with an ink border and an orange left stripe), the give button, a live status line, two counts and a "How the toy box works" `<details>`. Giving opens the pre-filled hub issue; while the hub is private the toy appears as a local **Preview** (cream tag with a dashed ink outline). Demo data carries a dashed note saying it is made up.

### Shields (`base.css` `.shield`)
Two-tone GitHub-style badges: ink key; value in orange, then blue (white text), pink and cream for the second to fourth shield.

### Backstage pins (`Backstage.tsx`)
Three pinned-repository slots: 2px dashed at 35% ink, 20px corners, a repo icon, a kind, two pale placeholder lines and an orange note pill. Nothing invented fills them.

## Motion

Easing: `--ease-out` cubic-bezier(0.16, 1, 0.3, 1) for state changes and entrances, `--ease-in-out` cubic-bezier(0.65, 0, 0.35, 1) for loops.

- **Entrances, once:** the year's blocks rise from scaleY 0.04 over 700ms, staggered 11ms per week, when the section is first seen; the closing cat bows once.
- **Responses:** buttons lift 2px (200ms), the GitHub pill 1px (180ms), the play disc scales 1.04, gift options change border and fill (140ms), language bars grow (420ms), the sheet clip-reveals (360ms), the meow bubble (1.3s).
- **Living loops:** the cat's breath, tail, blinks and ear twitches; the ruler cat's legs (380ms walk, 190ms run); the feather wand's swing (requestAnimationFrame); z's floating while asleep.
- **Play sequences:** the room cat trots (240ms x 3), jumps (420ms) and crosses the room (720ms).

### Named Rules
**The Reduced Motion Rule.** Under `prefers-reduced-motion: reduce` every loop and entrance stops and every control still works: smooth scroll is off; the cats render with `alive={false}` and no gaze transition; the ruler cat holds its pose; the year shows full-height blocks at once; the room cat goes straight to each toy's end state; the wand hangs still at 14 degrees; the yarn cursor follows without easing; the beat plays without the pulse or step transitions; the README's SVG animations stand still.

## Second surface: the profile README

`D:\hienta16\README.md` shows SVG cards drawn by Python (`catwalk/render/*.py` into `assets/generated/`) with the same tokens from `catwalk/render/theme.py`. Each card is a self-contained SVG on its own 28px-rounded field, so it reads the same on GitHub's light and dark themes. Anybody is embedded as a base64 subset (GitHub's image proxy blocks external fonts); reading text uses GitHub's system stack instead of Be Vietnam Pro. Text styles (`svg.py`): `black` 850 wdth 100, `bold` 760 wdth 88, `label` 700 wdth 76 uppercase, `text` 500.

| README card | Site section | Field |
|---|---|---|
| `banner.svg` | Hello + tape header: greeting, orange role cut, the cat in a blue disc, status pill, ruler cat walking a pink tape | cream, pink tape |
| `btn-site.svg`, `btn-linkedin.svg`, `btn-{yarn,feather,box}.svg` | hero and toy-box buttons, pills with a 2px ink border | ink / blue / toy colour |
| `stats.svg` | Activity + Streaks: the total, an orange "contributions" tag, pale tiles, an ink footer with the source | cream |
| `iso.svg` (`readme_svg`) | the 3D year with its own headline and legend | ink |
| `languages.svg` | Languages | ink |
| `rhythm.svg` | Weekly rhythm | pale |
| `beat.svg` | Contribution beat, silent: steps flash orange, then pink, in a loop | blue |
| `toybox.svg` | Toy box room | pink |

The README links to the site (`/#beat`, `/#cat`) for what it cannot do: sound, hover, giving a toy.

## Data rules that shape the design

- **Numbers only from data.** Every figure comes from `src/data/hub/github.json` (computed by the hub's Python) or its live copy; components only lay them out.
- **Commits are not contributions.** They sit on separate rows with separate labels ("Commits I authored"), and a note defines a contribution.
- **`n/a`, never a guess.** A missing count renders `copy.github.notAvailable` on the site and "· n/a" in the README; nothing is estimated.
- **Freshness is shown.** "Updated ..." in the GitHub head, a stale warning after 3 days, the refresh time in the README footer.
- **Private stays private.** Private repositories appear as counts only; bot commits are not counted.
- **Previews say so.** A locally given toy is tagged **Preview**; demo data is labelled as made up.

## Do's and Don'ts

### Do:
- **Do** give every section one flat field and read `--fg`, `--fg-2`, `--rule`, `--focus` from it.
- **Do** put GitHub data on the ink field and keep its cards ink-3.
- **Do** spend orange on energy, and keep text on orange in ink.
- **Do** keep gradients, blur and soft shadows inside the cat and toy art.
- **Do** draw the 3D year in the hub's Python and let the site add only headline, legend, tooltip and rise-in.
- **Do** change a brand colour in both `base.css` and `theme.py`.
- **Do** label commits and contributions separately, show `n/a` for a missing number, and tag local toys "Preview".
- **Do** draw every illustration and icon as inline SVG (icons on a 24px grid, 2px round strokes).
- **Do** keep targets at 44px or more with a 3px focus outline in the field's focus colour.
- **Do** stop every loop and entrance under reduced motion and leave every control usable.

### Don't:
- **Don't** set orange text on cream, pale, pink or blue.
- **Don't** put a gradient, shadow, glow or blur on a field, card, control or chart.
- **Don't** colour text with the level ramp, or colour an empty day with a brand colour.
- **Don't** recolour the cat with brand colours, or use her tortoiseshell tones in UI.
- **Don't** draw the cat flat or as a tuxedo; she is the owner's tortoiseshell with yellow-green eyes.
- **Don't** add a second display family or a system display face; the fallbacks exist only for loading.
- **Don't** fill the Backstage slots with placeholder projects.
- **Don't** play audio without a press, or ship raster illustration or icon fonts.
