---
name: Catwalk of Curiosity
description: Hien Ta's GitHub, styled. GitHub's own anatomy recut as a fashion show in Electric Baby Pop flat cuts, with a paper-cut tuxedo cat for a guide.
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
  empty-day: "#383B5C"
  contrib-1: "#FFE5EE"
  contrib-2: "#F9C2D3"
  contrib-3: "#F49CB6"
  contrib-4: "#EE6F9A"
  yarn-strand: "#C94E16"
  yarn-line: "#B9440F"
  cut-edge-ink: "#3D4062"
  cut-edge-orange: "#FFA477"
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
  numeral:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(56px, 7vw, 104px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 74"
  headline:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 50px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 92"
  title:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1.1
    fontVariation: "'wdth' 90"
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
rounded:
  none: "0px"
  swatch: "3px"
  tab: "6px"
  tag: "8px"
  card: "14px"
  bubble: "18px"
  pill: "999px"
  round: "50%"
spacing:
  u: "8px"
  gutter: "clamp(16px, 4.4vw, 64px)"
  measure: "1360px"
  section-y: "clamp(88px, 10vw, 152px)"
  header-h: "58px (54px under 760px)"
  card-gap: "16px"
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
  button-github-exit:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    height: "68px"
    padding: "0 28px"
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
  chip-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
  chip-blue:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  chip-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  chip-pink:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  seg-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "36px"
    padding: "0 14px"
  seg-button-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  stat-card-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "26px 26px 24px"
  stat-card-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "26px 26px 24px"
  stat-card-pink:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "26px 26px 24px"
  github-pill:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "26px"
    padding: "0 12px"
  status-pill:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 18px 10px 14px"
  swing-tag:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tab}"
    padding: "14px 18px 16px"
  swing-tag-on:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
  toy-button:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "46px"
    padding: "0 16px 0 8px"
  toy-button-hover:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
  speech-bubble:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "12px 16px"
  runway-tooltip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "7px 12px"
  rail-tag-reserved:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tag}"
    padding: "10px 18px"
---

# Design System: Catwalk of Curiosity

## Overview

**Creative North Star: "My GitHub, Styled"**

The page restyles GitHub's own anatomy as a fashion show. The profile becomes a hero with an avatar disc and a status pill; the contribution graph becomes a 3D runway of the year; the stats cards are cut from the palette; issues become the way a visitor leaves the cat a toy. A pink measuring tape runs across the top as the header, a small ruler cat walks it to the reader's place, and a 2.5D paper-cut tuxedo cat is the one silhouette that carries every scene. Copy is short; the real GitHub numbers are the loudest thing in their field.

The material is Electric Baby Pop in flat cuts. Each section is one solid field (cream, pale pink, Dark Ink "GitHub night", baby pink, cream, vivid orange), with no gradients, no shadows and no blur. Depth is built from paper: cut layers stacked at CSS depths with a lighter edge peeking out behind each one, and a perspective projection drawn as flat-filled faces. Type is two voices: Anybody, whose width axis carries display, labels, numbers and buttons, and Be Vietnam Pro for reading. Orange is the energy colour: it is on every primary action, the role shield, the GitHub pill, the streak card, the cat's eyes and collar, the busiest day, hovered data and the closing field.

Motion is one entrance per scene and a few small living loops. Blocks rise and rings fill once when the GitHub night is first seen; the ruler cat walks, runs, sits, sleeps and plays at the tape's end; the tail swishes; the empty hangers sway. Reduced motion stops all of it and leaves every control usable.

**Key Characteristics:**
- One flat field per section; the GitHub data lives on Dark Ink
- Orange is the energy: actions, the role shield, the busiest day, the hovered reading, the closing field
- Paper cut edges instead of shadows; the cat is SVG layers at translateZ depths
- GitHub vocabulary restyled: two-tone shields, status pill, stats cards, contribution runway, issues as toys
- Empty data recedes into the field; it never wears a brand colour
- Anybody's width axis carries the display voice; Be Vietnam Pro reads
- All illustration is authored inline SVG; no raster ships

## Colors

Six owner-pinned colours ("Electric Baby Pop") used as flat fields, with a small set of supporting tones that exist only for the night field, the data ramp and the paper cuts.

### Primary
- **Electric Blue** (blue): the avatar disc in the hero, the runway's far edge in the 3D graph, the cat-stage floor with its cream runway lights, the second shield value, the MUSIC chip, small icons in the stats card, and the hero's second witty line and the Backstage follow link on cream. Small text on blue is white.

### Secondary
- **Baby Pink** (pink): the tape. Header tape, the tape strip closing About, the month tape along the 3D runway, the hanger rail, the cat-stage floor edge; also the Off-the-runway field, the languages card and the cat's inner ears, nose and paw pads. Always carries ink ticks or ink text.
- **Pale Pink** (pale): the About field, the track of the "showing up" ring, the cut edge behind the cat's cream bib and blaze, and the lightest contribution step.

### Tertiary
- **Vivid Orange** (orange): the energy. Primary buttons, the role shield's value, the GitHub pill on the tape's end and the avatar status pill, the tape's progress fill behind the walking cat, the streak card, the "showing up" ring arc, the cat's eyes and collar, the ruler cat's eye, the yarn ball, the busiest day and any hovered day on the runway, the swing tag that is on or hovered, the toy button on hover, the live-update dot, and the closing "Say hi" field. On the night field orange may be text (the total, the peak label, the GitHub link); on light fields it is only a fill.

### Neutral
- **Warm Cream** (cream): the floor. Hero and Backstage fields, first paint, the stats card, swing tags, the runway tooltip, the cat's bib and blaze, text on ink.
- **Dark Ink** (ink): all text on light fields, the GitHub night field, the cat's body, shield keys, the ink chip and button, the language bars, borders and strings.
- **Raised Ink** (ink-3): surfaces on the night field: the runway floor and the avatar's placeholder.
- **Night Secondary** (night-2): secondary text on ink (9.6:1): meta, legend, footnote.
- **Secondary Ink** (ink-2): secondary text on cream (7.7:1); per-field secondary tones pale-fg-2 on pale and pink-fg-2 on pink.
- **White** (white): small text on blue only.
- **Empty Day** (empty-day): the tile of a day with no contributions on the night runway, a quiet step up from ink.
- **Contribution ramp** (contrib-1 to contrib-4): four pink steps for contribution bands; side faces of each block are the same hue darkened toward ink.
- **Yarn** (yarn-strand, yarn-line): the rope behind the yarn cursor and the wrap lines on yarn balls.
- **Cut edges** (cut-edge-ink, cut-edge-orange): the lighter offset layer behind the cat's ink parts and its collar.

### Named Rules
**The Orange Energy Rule.** Orange goes where the energy is: the action to take, the role, the streak, the busiest day, the thing under the pointer, the closing call. It is never text on cream, pale or pink; text on orange is ink.

**The Flat Cut Rule.** Every surface and every face is one solid colour. No gradients, no shadows, no glow, no blur. Shading on the 3D runway is a separate flat fill per face, mixed toward ink.

**The Empty Recedes Rule.** An empty day is drawn in the field's own quiet tone (empty-day on ink), never in a brand colour. The palette is spent on what happened.

**The Data Colours Stay Data Rule.** The contribution ramp and the empty tile colour blocks and swatches, never text. The one orange label on the runway is the callout for the busiest day, keyed to its orange block, and sits on ink.

## Typography

**Display Font:** Anybody Variable (wdth axis), fallback Arial Narrow
**Body Font:** Be Vietnam Pro (400, 500, 600, 700, latin), fallback Segoe UI, system-ui
Both self-hosted through @fontsource.

**Character:** Anybody is the made-to-measure voice: the same family is cut narrow for labels and tape marks (64-74%), mid for display and numerals (74-80%), and nearer normal for headlines, buttons and card titles (84-96%), so width carries hierarchy. Be Vietnam Pro is a calm, round reading face.

### Hierarchy
- **Display** (800, clamp 48-108px, 0.88, wdth 80, uppercase, balanced): section titles. The closing "That's a wrap." runs a bigger cut (display-close).
- **Numeral** (800, clamp 56-104px, wdth 74, orange on ink): the year's contribution total; card numerals use the same narrow cut at 30-44px.
- **Headline** (800, clamp 32-50px, 1.0, wdth 92, sentence case): the hero greeting, at a natural display size rather than a backdrop.
- **Title** (800, 21px, wdth 90): stat card titles; hints and the toy box title use 19-24px display at wdth 86-96.
- **Button** (750, 17px, wdth 90): every pill button and the GitHub exit (20-28px).
- **Shield** (750, 15px, wdth 84, 0.05em, uppercase): shield badges; the hero shield scales to 18-26px.
- **Lead** (500, clamp 18-22px, 1.45, max 44ch, secondary colour): the line under a section title and the hero lines.
- **Body** (400, 17px / 18px from 1100px, 1.6).
- **Label** (700, 13px, wdth 64, 0.06em, uppercase): tape marks, ring labels, small headings.

### Named Rules
**The Tailored Width Rule.** Hierarchy moves along Anybody's width axis as much as along size. Pick a cut from the steps in use (64, 70-76, 80, 84-92, 96); never add a second display family.

**The Numbers Are Tabular Rule.** Stat values, percentages and table figures use tabular numerals.

## Layout

A single column of full-bleed fields, each holding a centred wrap (measure 1360px plus a fluid 16-64px gutter). Vertical rhythm is one section pad (88-152px); spacing derives from an 8px module.

The header is fixed at 58px (54px on phones): a 26px cream lane for the ruler cat over a pink tape carrying section marks at their measured scroll positions, an orange progress fill, and the GitHub pill at the tape's end. The hero is two columns (copy 11fr, avatar stage 10fr) filling the viewport on screens at least 1024 x 680; under 900px the avatar stacks below the copy. About is intro left, lessons right, shields across the bottom. The GitHub night runs head, total, the full-width runway, then three cards (1.25fr 1fr 1fr), two columns under 1100px and one under 720px. The cat stage is one screen tall (520-700px) with tags hung either side of the cat; on phones the tags become one even row.

Breakpoints observed: 720, 760, 860, 900, 1024 (with 680 height), 1100.

## Elevation & Depth

No shadows anywhere. Depth comes from paper and projection. The tuxedo cat is a stack of SVG layers placed at CSS translateZ depths inside a 900px perspective, so the head turns toward the pointer; each ink layer has a lighter copy offset 2-3px up and left behind it (cut-edge-ink, pale behind cream, cut-edge-orange behind the collar), which reads as a cut paper edge. The contribution runway is a projected scene drawn as flat polygons, its side faces darker mixes of their top colour. Elsewhere, things in front simply overlap: the cat breaks out of the avatar disc's top edge, the status pill sits on the disc's rim inside a 4px cream ring, the tags hang over the stage.

### Named Rules
**The Cut Edge Not Shadow Rule.** When a shape needs to lift, give it a lighter offset cut behind it or a translateZ depth; never a shadow, glow or blur.

## Shapes

Toy-like and soft where you touch, square where you read. Every button, pill, segmented control and toy is a full pill (999px). Stat cards round at 14px, GitHub-card style; speech bubbles at 18px; swing tags at 6px top and 12px bottom; the reserved hanger tags at 8px; legend swatches at 3px. Shields, chips, tooltips and fields stay square. Borders are 2-2.5px ink (2px dashed for reserved, unfilled slots). Recurring silhouettes: the ticked measuring tape (pink with ink ticks), punched tag holes in pink with an ink ring, the circular avatar disc ringed with dotted ticks, and empty wire hangers on a tape rail.

## Components

### Buttons
Toy buttons: chunky pills that lift when touched.
- **Shape:** full pill (999px), 52px tall, 2.5px border, display font.
- **Orange (primary):** orange fill, ink text; on cream, pale or pink fields the border is ink, on ink and orange it matches the fill.
- **Ghost:** transparent, border and text in the field's foreground.
- **Ink:** ink fill, cream text (toy-box issue link).
- **GitHub exit:** ink pill, 68px tall, 20-28px type, the GitHub mark leading.
- **Hover / Active:** lift 2px over 200ms, settle on press. Focus: 3px outline in the field's focus colour (orange on ink), 3px offset.
- **Text button:** 600 weight, 2px underline at 0.22em offset, 44px target.

### Shields
Two-tone badges as on a GitHub profile: an ink key and a coloured value, square, uppercase. The role shield's value is orange; the About shields cycle orange, blue (white text), pink and cream.

### Chips
A single word cut from one colour: ink, blue (white text), orange or pink, square, display 800 uppercase. Used for the About lesson words.

### Segmented toggle
A 2px outline pill with 36px pill buttons inside; the pressed option fills ink with cream text. Used for the languages card's by-repository / by-code-size switch (32px there).

### Stat cards
GitHub-style stats cards cut from the palette, 14px corners, 26px padding, ink text, no border: cream (stat list with blue icons, translucent ink hairlines, an orange "showing up" ring on a pale track), orange (streaks: total, current streak in an ink ring, longest), pink (ranked single-series language bars in ink, ends rounded 4px on the growing side, tabular percentages). Rings fill once on first view.

### Navigation
- **Tape ruler header:** section names in the label cut at their scroll positions above ink marks; current section at weight 900. An orange 5px fill grows behind the ruler cat.
- **Ruler cat:** a side-view ink cat on the tape with poses walk, run (fast scroll), sit, sleep (after 9s idle) and play (with a yarn ball, at the tape's end); click for a meow bubble.
- **GitHub pill:** orange pill with ink border on the tape's end; label hides on phones.
- **Phone sheet:** full-screen ink dialog with a pink tick margin; items in display 800 up to 52px; current item orange; clip-reveal from the top.

### Paper-cut tuxedo cat (signature)
A 300 x 360 rig of SVG layers (tail, body, legs, collar, head, eyes) at translateZ depths with lighter offset cut edges. Orange eyes with ink pupils follow the pointer; lids blink; the paw swats; moods bob, sway, wear shades or bow. The tail swishes on a 5.2s loop. It appears in the hero (breaking out of the blue disc), on the cat stage and at the close.

### Contribution runway (signature)
The year as a 3D runway projected into SVG: one block per day, height by count, on an ink-3 floor with a blue far edge and a pink month tape. Bands fill with the pink ramp, empty days are quiet tiles, the busiest day is orange with an orange callout, and the hovered day turns orange with a cream square tooltip. Blocks rise once on first view. Backed by a "Show the numbers" table.

### Cat stage, yarn and swing tags
A one-screen stage: a cream tick tape at the top, cream swing tags with pink punched holes on ink strings at their own tilt and drop, the cat on a blue runway floor with cream lights. Inside the stage the pointer becomes an orange yarn ball trailing a yarn-strand rope (verlet rope physics); on touch the yarn is dragged. Hovered or chosen tags turn orange and swing; the cat answers in a cream speech bubble with an ink border. Below, the toy box offers toy buttons (cream pills that turn orange and lift on hover) and a toss lands a toy on the runway.

### Empty-hanger rail
Placeholder for future work: three ink wire hangers on a pink tape rail, swaying slowly out of phase, each over a dashed "Soon" tag in ink-2. Nothing is invented to fill them.

## Do's and Don'ts

### Do:
- **Do** give every section one flat field and switch its field tokens (`--fg`, `--fg-2`, `--rule`, `--focus`) with it; put GitHub data on the ink field.
- **Do** spend orange on energy: the primary action, the role, the streak, the busiest day, the hovered reading, the closing field.
- **Do** lift shapes with lighter offset cut edges or translateZ depth.
- **Do** let empty data recede into the field (empty-day on ink).
- **Do** restyle GitHub's own anatomy (shields, status pill, stats cards, contribution graph, issues) rather than inventing generic portfolio parts.
- **Do** draw every illustration and icon as inline SVG (2px strokes on a 24px grid for icons).
- **Do** keep targets at 44px or more (36px segmented options inside a 44px control) with a 3px focus outline in the field's focus colour.
- **Do** run each scene's entrance once, and stop every animation and transition under prefers-reduced-motion.

### Don't:
- **Don't** use gradients, shadows, glows or blur on any surface or face.
- **Don't** set orange text on cream, pale or pink; on orange, text is ink.
- **Don't** colour text with the contribution ramp or the empty-day tone.
- **Don't** colour "nothing" with a brand colour.
- **Don't** introduce a second display family or a system display face; the fallbacks exist only for loading.
- **Don't** fill the hanger rail with placeholder projects; empty is the honest state.
- **Don't** ship raster illustration or icon fonts.
