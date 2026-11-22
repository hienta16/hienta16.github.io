# Product

<!-- impeccable:product-schema 1 -->

> Interview substitution: the owner asked for no intermediate approval rounds (brief of 22/11/2026), so this record was
> written from that brief plus evidence checked on disk and on GitHub. Facts marked *(inferred)* were not confirmed by
> the owner; correct them here.

## Platform

web

## Stack

Delegated: the brief allows React + Vite + TypeScript. Chosen: Vite + React + TypeScript, static build for GitHub Pages
(user site, served from `/`), self-hosted fonts, no backend, no runtime third-party calls.

## Users

- **Primary:** recruiters, hiring managers and mentors looking at an early-career Data Analyst candidate, usually from a
  CV link or a GitHub profile, on a laptop or a phone, deciding in a minute or two whether to read further *(inferred)*.
- **Secondary:** classmates, collaborators and people in the Vietnamese data community *(inferred)*.
- The owner reads it as a statement of who they are becoming.

## Product Purpose

A personal portfolio for Tạ Minh Hiền that shows an aspiring Data Analyst who is curious, analytical, creative and still
learning. Success: a visitor leaves knowing the person's direction (data analysis, business analytics, data
visualization), sees honest evidence of real learning and real activity, and remembers the site.

## Positioning

The one person who reads both kinds of pattern: patterns in data and patterns in fashion. The site treats analysis as a
show with a backstage, so the method (sources, definitions, caveats) is part of the performance, not hidden.

## Operating Context

- Repository `hienta16/hienta16.github.io`, **PRIVATE**. GitHub Pages is not enabled. Nothing is deployed or pushed
  without the owner's decision; the only approved preview is localhost.
- GitHub account `hienta16`, created 09/05/2025. **0 public repositories** (4 private) on 22/11/2026.

## Capabilities and Constraints

- Bilingual: the previous site was Vietnamese; the redesign serves English and Vietnamese *(inferred: keeps the existing
  Vietnamese voice while opening to international readers)*.
- GitHub activity comes from a build-time snapshot of the contribution calendar. The snapshot script refuses to write
  data that differs from the anonymous public calendar, so the site never shows more than GitHub shows publicly.
- No API credentials in the frontend. No contact form. No autoplay audio.

## Brand Commitments

- Name: **Tạ Minh Hiền** (GitHub display name "Hien Minh Ta"). Vietnamese diacritics must render correctly.
- Concept name: **Catwalk of Curiosity** (Data Runway + Backstage Pass), pinned by the owner.
- Palette **Electric Baby Pop**, pinned: Warm Cream #FFF9F4, Baby Pink #F49CB6, Electric Blue #2463F6, Vivid Orange
  #FF7029, Pale Pink #FFE5EE, Dark Ink #22243A.
- Primary identity: aspiring Data Analyst. Supporting identity: fashion, music, dancing, cats.

## Evidence on Hand

- Education: Management Information Systems, National Economics University (NEU) (owner's brief).
- Previous site's case study (commit `2b8c5d7`, `index.html`): simulated B2B outreach, 100 hypothetical businesses,
  one contact each. Email 50 contacted / 8 replies (16%); WhatsApp 25 / 6 (24%); LinkedIn 25 / 5 (20%). Lesson: the
  count and the rate crown different winners. **Simulated data**; label it so everywhere.
- GitHub contribution calendar, 23/11/2025 to 22/11/2026: 1,469 contributions on 75 active days, all from September
  2026 (Sep 293, Oct 622, Nov 554 to the 22nd); 1,467 are private-repository contributions GitHub shows as counts only.
  Matches the anonymous public calendar day for day (checked 22/11/2026).
- Learning evidence on disk (names only, not published): NEU Python course notebooks and a 30-prompt Python practice
  log (private repo `neu-python-programming`, Oct 2026); NEU C++ OOP coursework; an online Data Analyst course with
  Python scripts and CSV labs, partly unfinished; Excel / Power Query drills (group by, conditional columns, merging
  columns, pulling data across workbooks).
- **Absent, never fabricate:** employers, internships, job titles, clients, metrics of impact, SQL experience (no
  evidence found), public projects, testimonials, email address or other social accounts, specifics about the owner's
  cats, music or dance (not supplied).
- Work done for other organisations is confidential and stays off the site.

## Product Principles

1. Show the working: every number carries its source, window and definition.
2. Honest emptiness beats invented fullness; a reserved slot is a design object, not a gap.
3. Personality supports the analyst; it never outshouts the evidence.
4. Every interaction must teach, reveal or delight, and work by keyboard, touch and with reduced motion.

## Accessibility & Inclusion

WCAG 2.2 AA contrast for text; full keyboard operation; `prefers-reduced-motion` respected; audio only on explicit user
action with a visible stop; Vietnamese and English both first-class.
