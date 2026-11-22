---
name: Catwalk of Curiosity
description: Tạ Minh Hiền's portfolio, staged as a runway you can measure. Electric Baby Pop in flat cuts.
colors:
  cream: "#FFF9F4"
  pink: "#F49CB6"
  blue: "#2463F6"
  orange: "#FF7029"
  pale: "#FFE5EE"
  ink: "#22243A"
  white: "#FFFFFF"
  ink-2: "#4E4F63"
  pale-fg-2: "#46384A"
  pink-fg-2: "#33283C"
  calendar-1: "#779CF5"
  calendar-2: "#9DB6F5"
  calendar-3: "#CCD7F4"
typography:
  display-name:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(64px, 14vw, 200px)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' solved per line to fill the measure (starts at 82%)"
  display:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(52px, 8.4vw, 128px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 78"
  readout:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(72px, 10vw, 152px)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 70"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(34px, 3.6vw, 56px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 92"
  title:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(24px, 2.4vw, 34px)"
    fontWeight: 800
    lineHeight: 1
    fontVariation: "'wdth' 112-120"
  lead:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.7vw, 24px)"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Be Vietnam Pro, Segoe UI, system-ui, sans-serif"
    fontSize: "17px (18px from 1100px)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Anybody Variable, Arial Narrow, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 62"
rounded:
  none: "0px"
  tab: "3px"
  bar-end: "4px"
  pass: "6px"
  pill: "999px"
  round: "50%"
spacing:
  u: "8px"
  gutter: "clamp(16px, 4.4vw, 64px)"
  measure: "1360px"
  section-y: "clamp(96px, 11vw, 168px)"
  header-h: "56px"
components:
  tab:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 20px 0 16px"
    typography: "{typography.label}"
  tab-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "52px"
  chip-on-blue:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 18px"
  chip-on-blue-pressed:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  seg-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "44px"
    padding: "0 18px"
  seg-button-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  backstage-pass:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pass}"
    height: "40px"
    padding: "4px 12px 4px 8px"
  backstage-pass-on:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pass}"
  swing-tag:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    width: "clamp(112px, 9.6vw, 148px)"
    padding: "14px 14px 18px"
  swing-tag-selected:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
  tooltip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  sheet-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: Catwalk of Curiosity

## Overview

**Creative North Star: "A Runway You Can Measure"**

The page is a fashion show whose runway is a tailor's tape. A pink measuring tape runs across the top as the header, with the running order printed at measured positions and a small ink cat walking to the current place. Sections sit at measured points along it; every chart is read like a fitting; a Backstage pass reveals the method (pattern paper, dashed seams, the pixel width of the name). Personality supports the analyst: the evidence is always the loudest thing in its field.

The material is Electric Baby Pop in flat cuts: each section is one solid field of colour (cream, pale pink, Electric Blue, Baby Pink, Vivid Orange), with no gradients and no shadows anywhere. One ink silhouette anchors each scene (the cat, the dress form, the hangers), all authored SVG. Type is a two-voice cut: Anybody, whose width axis is tailored to the measure, for everything that is display, label or number; Be Vietnam Pro for reading. Density is generous: big fields, large display, long measures of whitespace between sections.

Motion is one authored entrance and one measured reveal. The runway's weekly lights switch on far to near while the cat walks in; data bars measure out along the tape the first time the metrics field is seen. Reduced motion removes all of it.

**Key Characteristics:**
- Flat colour fields, one per section; depth only from overlap (the dropped floor tape, the fixed tape header)
- Orange is law: it marks the live reading, with one cited exception (the After-the-show field)
- Anybody's `wdth` axis is the display voice; the name is fitted per line to span the full measure
- Controls are tailoring objects: tape tabs, swing tags, a backstage pass, pill chips
- Simulated data is hatched; certainty is drawn, intervals are shown
- Figures are numbered like plates (FIG. 1, FIG. 2) and each has a table view
- All illustration is inline SVG; no raster ships

## Colors

Six owner-pinned colours ("Electric Baby Pop"), used as flat fields, with ink doing almost all the text work.

### Primary
- **Electric Blue** (blue): the runway and the metrics field. On blue, small text is white; cream is reserved for large numbers and marks. Blue as text appears only on cream (the hero role line, case finding, secondary links), never small on pale pink.

### Secondary
- **Baby Pink** (pink): the tape. Header tape, the dropped floor tape, the month tape under the calendar, the tape strip on every ink tab, the Off-the-Runway field, the pass's "on" state. Always carries ink ticks or ink text.
- **Pale Pink** (pale): the Patterns field and hover wash on cream rows and segmented buttons.

### Tertiary
- **Vivid Orange** (orange): the live reading only. The tape's position hairline, the measurement handles and their bracket, the active preset chip, the selected month bar, the this-week runway light, the current leader's rank, the selected swing tag, the playing action, the current item in the phone running-order sheet. The single exception is the closing After-the-show field, the curtain call, where orange becomes a full colour block with ink on it.

### Neutral
- **Warm Cream** (cream): the floor. Default page field, first-paint background, swing tags, sheet card, readout numerals and calendar top bin on blue.
- **Dark Ink** (ink): all text on light fields, silhouettes, tab bodies, the header's metal tab, tooltips, rules and borders on cream.
- **White** (white): small text, chip strokes and weekday labels on the blue field.
- **Secondary Ink** (ink-2): secondary text on cream (7.7:1). Per-field secondary tones: pale-fg-2 on pale, pink-fg-2 on pink.
- **Calendar ramp** (calendar-1 → calendar-3 → cream): a sequential blue-to-cream ramp for contribution bins on the blue field; zero days are dots, not filled cells.

Rules on fields use translucent ink (18 to 32% by field) or translucent white (34%) on blue.

### Named Rules
**The Orange Is Law Rule.** Orange marks what is live now: the measurement, the playhead, this week, the current place, the chosen reading. It is never decoration, never body text, never text on cream. The only field of orange is After the show.

**The Flat Cut Rule.** Every surface is one solid colour. No gradients, no shadows, no blur. Lighter tints of blue on the runway are opacity steps of cream over blue, not gradients.

**The Contrast Pairing Rule.** Text pairs only as measured: ink on cream 15.4, on pale 12.8, on pink 7.4, on orange 5.5; white on blue 5.0; cream on blue 4.8 (large only). Blue text on pale pink is large-only.

## Typography

**Display Font:** Anybody Variable (wdth 50–150%), fallback Arial Narrow
**Body Font:** Be Vietnam Pro (400, 500, 600, 700), fallback Segoe UI, system-ui
Both self-hosted through @fontsource with Vietnamese subsets; diacritics (Ạ, Ề) must clear their lines.

**Character:** Anybody is the made-to-measure voice: the same family is cut narrow for labels (62–70%), mid for titles (78–92%) and wide for role lines and stamps (112–130%), so width itself carries hierarchy. Be Vietnam Pro is a calm, legible reading face that renders Vietnamese natively.

### Hierarchy
- **Fitted name** (800, up to 200px, 0.84): the hero backdrop, uppercase, solved per line in FittedName.tsx so each line fills the measure; extra top padding and line gap hold stacked marks.
- **Display** (800, clamp 52–128px, 0.86, wdth 78, uppercase): section titles. The After-the-show title runs the same voice at wdth 74, up to 140px.
- **Readout** (800, clamp 72–152px, 0.82, wdth 70, tabular): the measured number on blue, in cream.
- **Headline** (800, clamp 34–56px, 0.98, wdth 92–96): case title and panel titles, sentence case.
- **Title** (800, 24–40px, wdth 112–120, uppercase): wide-cut lines such as the hero role and the sheet-card title.
- **Lead** (500, clamp 19–24px, 1.4, max 46ch): the sub under each section title.
- **Body** (400, 17px / 18px from 1100px, 1.6, max 62ch).
- **Label** (700, 13px, 0.06em, wdth 62, uppercase): figure numbers, table heads, small headings, tape marks. Never smaller than 11px.

### Named Rules
**The Tailored Width Rule.** Hierarchy in display type moves along the width axis as much as size. Pick the cut from the existing steps (62, 70, 78, 92, 112, 130); do not introduce a second display family.

**The Numbers Are Tabular Rule.** Every count, date range and table figure uses tabular numerals.

## Layout

A single column of full-bleed fields, each containing a centred wrap (max measure 1360px plus a fluid gutter of 16–64px). Vertical rhythm is one generous section pad (96–168px). Spacing derives from an 8px module (`u`); offsets of 3u recur under titles.

Section heads are a two-column grid: title left (6–7fr), lead right (5fr), aligned to the bottom edge; they collapse to one column under 760–960px. The hero fills the viewport on desktops (≥1024 × 640): fitted name on top, then a three-column stage of left floor copy, the runway and right floor copy; below that size the runway spans the row and the floor copy follows.

The header is fixed at 56px (52px on phones): a 24px cream lane for the cat, a pink tape below it, and an ink metal tab at the right holding language and the pass. On phones the running order becomes a full-screen ink sheet.

Breakpoints observed: 380, 560, 720, 760, 860, 900, 960, 1024, 1100.

## Elevation & Depth

Flat. There are no shadows in the system. Depth is staged by overlap and colour: the fixed tape header sits over the fields, the floor tape lies rotated (-2.4deg) across the seam between Patterns and Notes, swing tags hang below a string on their own tilt, and the cat stands in front of the runway. Tooltips are solid ink blocks with no lift.

### Named Rules
**The Overlap Not Shadow Rule.** When something must read as in front, place it across a seam or over another field; never add a shadow or a blur.

## Shapes

Tailoring geometry. Fields and containers are square-cornered. Radius is reserved for small objects with a physical reason: pill chips and segmented buttons (999px), the pass (6px), handle tabs (3px), bar ends rounded only on their growing end (4px), and true circles for lights, pin marks and tag holes. Borders are 2px ink on cream, white on blue. Signature silhouettes: the notched pattern-sheet card (ink triangles cut into its top and bottom edge), the clipped swing tag (angled shoulders), outlined rotated stamps, dimension lines with end ticks, and dashed seams in the backstage layer.

## Components

### Buttons
Tailoring controls, confident and flat.
- **Tape tab (primary):** ink body, cream label in Anybody uppercase (wdth 88, 17px), a 22px pink tape strip with ink ticks on the leading edge, square corners, 52px tall. Hover slides 4px along the tape; active 2px.
- **Ghost tab:** transparent with a 2px current-colour border, no tape strip.
- **GitHub exit:** ink block, 64px tall, cream Anybody (wdth 92) at 20–28px; lifts 2px on hover.
- **Text link:** current colour, 2px underline at 0.22em offset; arrow links add an inline SVG arrow.

### Chips (on blue)
- **Style:** 2px white outline pill, 44px tall, white 15px semibold text.
- **State:** hover adds a 12% white wash; pressed fills orange with ink text and a check mark, because the pressed preset is the live measurement.

### Segmented control (on cream)
- 2px ink outline pills; hover pale pink; pressed fills ink with cream text. Ink, not orange: choosing a metric is a selection; the orange goes to the rank that results.

### Cards / Containers
- **Pattern sheet:** cream, 2px ink border, square corners, ink notch triangles, head and foot divided by 2px ink rules, rows by translucent ink hairlines; rows wash pale pink on hover. Responsive: becomes stacked blocks with labelled cells under 900px.
- **Stamp:** outlined ink label, Anybody uppercase wdth 72, rotated -2deg or 1.5deg.
- **Tooltip:** solid ink, cream text, 13px with an 18px bold value, square.

### Navigation
- **Tape header:** pink tape with ink tick pattern; section names in Anybody label cut at their measured positions above ink marks; current section set at weight 900. An orange 3px hairline and the walking side-view cat mark the scroll position.
- **Metal tab:** ink block at the right; EN / VI buttons in cream (62% opacity off, full with an underline on); the backstage pass (cream card with a punched ink hole, name and state) turns pink when on.
- **Phone sheet:** full-screen ink dialog with a pink tick margin, items in Anybody 800 uppercase up to 52px, current item orange, clip-reveal from top.

### Measured Year (signature)
A contribution calendar on the blue field read like a fitting. Two orange tape-tab handles drag along a pink month tape to measure any span; an orange bracket hangs the reading (cream readout numeral, unit, range) from the measured span. Legend swatches are controls that light their bins; non-matching cells dim to 26%. Horizontal on wide screens, vertical (rotated) on phones. Every figure is numbered and backed by a table.

### Runway (signature)
An Electric Blue trapezoid receding to the name, 53 weekly lights along its edges: unlit weeks outlined, lit weeks cream, this week orange. Lights switch on far to near once, stripes fade in with them.

### Swing tags
Cream clipped tags on ink strings hanging from a cream tick tape, each at its own tilt and drop; hover counter-tilts; selected straightens and turns orange.

### Lineup bars (simulated data)
Blue bars hatched with cream diagonals to mark simulated values, ink interval whiskers, tabular values; rows re-order with a 640ms ease when the metric changes.

## Do's and Don'ts

### Do:
- **Do** give every section exactly one flat field colour from the palette and switch field tokens (`--fg`, `--fg-2`, `--rule`, `--focus`) with it.
- **Do** reserve orange for the live reading: position, measurement, this week, current place, the chosen preset or tag. After the show is the only orange field.
- **Do** use white for small text on blue and cream only for large numerals and marks there.
- **Do** carry hierarchy on Anybody's width axis and fit hero lines to the measure rather than to a fixed size.
- **Do** hatch simulated data and show its intervals; number figures and give each a table view.
- **Do** draw illustration as inline ink SVG silhouettes, one per scene.
- **Do** keep interactive targets at 40px or more (44px for chips and segmented buttons) with a 3px focus outline in the field's foreground colour.
- **Do** remove every animation and transition under prefers-reduced-motion.

### Don't:
- **Don't** use gradients, shadows, glows or blur on any surface.
- **Don't** set orange text on cream, or use orange as a decorative accent, divider or hover colour.
- **Don't** set blue text below large size on pale pink.
- **Don't** introduce a second display family or a system display face; the fallbacks exist only for loading.
- **Don't** round fields or cards; radius belongs to pills, the pass, handle tabs, bar ends and circles.
- **Don't** add new looping ambient motion; the cat's tail idles and the hanger sway are the full allowance.
- **Don't** ship raster illustration or icon fonts.
