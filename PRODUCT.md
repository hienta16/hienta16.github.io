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

- **Primary:** people who find Hien on GitHub and click through to the linked site: recruiters, mentors, classmates,
  other developers. The site is a creative GitHub companion, not a formal portfolio (owner, 23/11/2026).
- The owner reads it as a statement of who they are becoming.

## Product Purpose

A creative personal site that complements the GitHub profile @hienta16: identity line "Data Analyst" (never
"aspiring"), real and current GitHub data, an interactive cat personality, and witty, light copy linking data with cats,
music, dance and fashion. Success: it feels related to the GitHub profile, alive with real data, and clearly Hien's.

## Positioning

The one person who reads both kinds of pattern: patterns in data and patterns in fashion. The site treats analysis as a
show with a backstage, so the method (sources, definitions, caveats) is part of the performance, not hidden.

## Operating Context

- Repository `hienta16/hienta16.github.io`, **PRIVATE**. GitHub Pages is not enabled. Nothing is deployed or pushed
  without the owner's decision; the only approved preview is localhost.
- GitHub account `hienta16`, created 09/05/2025. **0 public repositories** (4 private) on 22/11/2026.

## Capabilities and Constraints

- **English only** (owner, 23/11/2026). Display name "Hien Ta"; GitHub name "Hien Minh Ta".
- GitHub data comes from `scripts/snapshot-github.mjs` (run before every `npm run dev`, and by a scheduled Action once
  published). The calendar must match the anonymous public calendar; counts (commits, PRs, issues, stars, repositories,
  languages) include private repositories as numbers only, never names. Live public profile data is fetched in the
  browser with a graceful fallback.
- Community toys: visitors leave a toy for the cat by opening a GitHub issue; an Action turns issues into
  `src/data/cat-toys.json`. Needs a public repository and the proposed workflow (`ops/proposed-workflows/`).
- No API credentials in the frontend. No contact form. No autoplay audio.

## Brand Commitments

- Name on the site: **Hien Ta** ("Hi, I'm Hien Ta!"); GitHub display name "Hien Minh Ta". The name is never the giant headline.
- Concept name: **Catwalk of Curiosity** (Data Runway + Backstage Pass), pinned by the owner.
- Palette **Electric Baby Pop**, pinned: Warm Cream #FFF9F4, Baby Pink #F49CB6, Electric Blue #2463F6, Vivid Orange
  #FF7029, Pale Pink #FFE5EE, Dark Ink #22243A.
- Primary identity: **Data Analyst** (never "aspiring"). Supporting identity: cats, music, dance, fashion.

## Evidence on Hand

- Education: Management Information Systems, National Economics University (NEU) (owner's brief).
- The simulated B2B outreach case from the first site is **not the owner's work** and must never appear again.
- GitHub contribution calendar, 23/11/2025 to 22/11/2026: 1,469 contributions on 75 active days, all from September
  2026 (Sep 293, Oct 622, Nov 554 to the 22nd); 1,467 are private-repository contributions GitHub shows as counts only.
  Matches the anonymous public calendar day for day (checked 22/11/2026).
- Learning evidence on disk (names only, not published): NEU Python course notebooks and a 30-prompt Python practice
  log (private repo `neu-python-programming`, Oct 2026); NEU C++ OOP coursework; an online Data Analyst course with
  Python scripts and CSV labs, partly unfinished; Excel / Power Query drills (group by, conditional columns, merging
  columns, pulling data across workbooks).
- GitHub (23/11/2026): 1,471 contributions in the last year, 1,366 commits, 83 PRs, 111 issues, 4 repositories
  (all private), 0 stars, contributed to 2; public avatar is a personal photo (shown small, can be switched off).
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
