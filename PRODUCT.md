# Product

<!-- impeccable:product-schema 1 -->

> Interview substitution: the owner asked for no intermediate approval rounds (brief of 22/11/2026), so this record was
> written from that brief plus evidence checked on disk and on GitHub. Facts marked *(inferred)* were not confirmed by
> the owner; correct them here.

## Platform

web

## Stack

Two repositories, one system (v3, 23/11/2026, owner's Python-first brief):
- **Hub** `hienta16/hienta16`: Python 3.12 standard library (`catwalk/`): GitHub API client, stats, SVG rendering,
  the toy box rules; GitHub Actions run it (refresh every 6 hours, toy issues on open). Also the profile README.
- **Site** `hienta16/hienta16.github.io`: Vite + React + TypeScript, static build for GitHub Pages; TypeScript only for
  in-browser interaction. Data is copied from the hub (`scripts/sync_hub.py`) and, once the hub is public, read live
  from raw.githubusercontent.com. No backend, no credentials in the frontend.

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

- Repository `hienta16/hienta16.github.io`, **PRIVATE**. GitHub Pages is not enabled. Nothing is deployed without
  the owner's decision. Pushing review branches was approved on 23/11/2026 (`feature/python-catwalk-cat-toys`).
- Hub `hienta16/hienta16` created **PRIVATE** as a staging repository on 23/11/2026 (it did not exist). A private
  special repository does not show on the profile; making it public is the owner's separate decision.
- All workflows are inert until the owner sets the repository variables `CATWALK_AUTOMATION` / `CATWALK_TOYS` to `on`
  (hub `docs/ACTIVATION.md`).
- GitHub account `hienta16`, created 09/05/2025. **0 public repositories** (4 private) on 22/11/2026.

## Capabilities and Constraints

- **English only** (owner, 23/11/2026). Display name "Hien Ta"; GitHub name "Hien Minh Ta".
- GitHub data comes from the hub's Python (`python -m catwalk refresh`). The calendar must match the anonymous public
  calendar; counts (commits, PRs, issues, stars, repositories, languages) include private repositories as numbers
  only, never names. Contributions and commits are different measures and are labelled separately; bot commits are
  not the owner's and are not counted. Every section carries the time it was last true.
- The cat's toy box: visitors give a yarn ball (7 days), feather (48 hours) or box (14 days) by opening a pre-filled
  issue on the hub; Python accepts one gift per account per rolling 24 hours, at most 9 visible, and replies on the
  issue. Lifetimes are editable in the hub's `config/toys.json`. Not live until the hub is public and switched on.
- No API credentials in the frontend. No contact form. No autoplay audio.

## Brand Commitments

- Name on the site: **Hien Ta** ("Hi, I'm Hien Ta!"); GitHub display name "Hien Minh Ta". The name is never the giant headline.
- Concept name: **Catwalk of Curiosity** (Data Runway + Backstage Pass), pinned by the owner.
- Palette **Electric Baby Pop**, pinned: Warm Cream #FFF9F4, Baby Pink #F49CB6, Electric Blue #2463F6, Vivid Orange
  #FF7029, Pale Pink #FFE5EE, Dark Ink #22243A.
- Primary identity: **Data Analyst** (never "aspiring", no ROLE badge). Supporting identity, as metaphors for data
  work only: cats (observation), music (pattern), dance (rhythm, iteration), fashion (presentation, storytelling).
- The cat is the owner's **tortoiseshell** (photo supplied 23/11/2026): mottled black, rust and ginger coat, big round
  yellow-green eyes, curious. Drawn soft 2.5D, never a flat cut-out. LinkedIn: https://www.linkedin.com/in/hienta16/
  (verified by the owner).

## Evidence on Hand

- Education: **Information Systems (IS)**, National Economics University (NEU). Not "Management Information
  Systems" / MIS: corrected by the owner on 23/11/2026.
- The simulated B2B outreach case from the first site is **not the owner's work** and must never appear again.
- GitHub contribution calendar, 23/11/2025 to 22/11/2026: 1,469 contributions on 75 active days, all from September
  2026 (Sep 293, Oct 622, Nov 554 to the 22nd); 1,467 are private-repository contributions GitHub shows as counts only.
  Matches the anonymous public calendar day for day (checked 22/11/2026).
- Learning evidence on disk (names only, not published): NEU Python course notebooks and a 30-prompt Python practice
  log (kept in a private repository, Oct 2026); NEU C++ OOP coursework; an online Data Analyst course with
  Python scripts and CSV labs, partly unfinished; Excel / Power Query drills (group by, conditional columns, merging
  columns, pulling data across workbooks).
- GitHub (23/11/2026, Python refresh): 1,473 contributions in the last year, 1,366 commits authored, 85 PRs, 111
  issues, 4 repositories (all private), 0 stars, contributed to 2.
- **Absent, never fabricate:** employers, internships, job titles, clients, metrics of impact, SQL experience (no
  evidence found), public projects, testimonials, email address, specifics about the owner's music or dance (not
  supplied), the cat's name.
- Work done for other organisations is confidential and stays off the site.

## Product Principles

1. Show the working: every number carries its source, window and definition.
2. Honest emptiness beats invented fullness; a reserved slot is a design object, not a gap.
3. Personality supports the analyst; it never outshouts the evidence.
4. Every interaction must teach, reveal or delight, and work by keyboard, touch and with reduced motion.

## Accessibility & Inclusion

WCAG 2.2 AA contrast for text; full keyboard operation; `prefers-reduced-motion` respected; audio only on explicit user
action with a visible stop. English only (owner, 23/11/2026).
