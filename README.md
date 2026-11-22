# hienta16.github.io · Catwalk of Curiosity

Personal portfolio of **Tạ Minh Hiền**, aspiring Data Analyst (Management Information Systems, NEU).
A runway you can measure: a fashion show whose runway is a tailor's tape, with a backstage pass that reveals the method.

> Status: **local preview only.** The repository is private, GitHub Pages is not enabled, and this clone has pushing
> disabled on purpose (see "Publishing later").

## Run it

```bash
npm install
npm run dev          # http://127.0.0.1:5173/   (?lang=vi for Vietnamese)
```

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Type-check, then build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` at http://127.0.0.1:4173/ |
| `npm test` | Unit tests for every statistic shown on the page |
| `npm run snapshot:github` | Refresh the GitHub contribution snapshot (see below) |

## Edit the content

Everything a visitor reads lives in **`src/content/site.ts`**, in English (`en`) and Vietnamese (`vi`).

- `profile`: name, GitHub login and URL, an optional `email` (empty = no email link), and `outreachSourceUrl`
  (empty = no source link; set it once the repository is public).
- `outreachCase`: the six numbers behind the simulated outreach case. Charts, intervals and the p-value recompute.
- `notes.rows`: the fitting record (Backstage notes). Add a row when you start something new; keep "evidence" honest.
- `off.tags`: the four Off-the-runway tags. The lines describe the interests; swap in your own specifics.
- `backstage`: the notes shown with the Backstage pass on.
- Words in `{braces}` are filled from the data: keep them when you translate. Numbers are never typed into the copy.

## GitHub data

`src/data/github-snapshot.json` holds one number per day for the last 365 days, plus totals and the date it was taken.
Every figure on the page (totals, streaks, busiest day and week, weekday rhythm, months) is computed from it in the
browser by `src/lib/stats.ts`, which `src/lib/stats.test.ts` checks.

```bash
npm run snapshot:github            # uses `gh auth token`, or GITHUB_TOKEN / GH_TOKEN
```

Privacy guard: the script also reads the **anonymous public** contribution calendar and refuses to write anything
unless both agree day for day. If your profile ever hides private contributions, the script stops instead of publishing
more than GitHub shows to strangers. Only daily counts are stored: no repository names, no commit messages.
The site says how old the snapshot is and flags it after 14 days.

## How it is built

- Vite + React + TypeScript, no UI or animation libraries. Fonts are self-hosted (Anybody, Be Vietnam Pro; SIL OFL).
- `src/components/`: one component per section, each with its own CSS. Tokens and fields live in `src/styles/base.css`.
- Sound (Off the runway, Runway metrics) is synthesized live with the Web Audio API, only after a click.
- `prefers-reduced-motion` turns every entrance and walk cycle off; keyboard and touch work everywhere.
- Design records: `PRODUCT.md` (product truth) and `DESIGN.md` (the visual system). Review captures and the
  design-tool state live in `.impeccable/` (git-ignored).

## Publishing later (not done)

Nothing has been pushed or deployed. When you decide to publish:

1. Re-enable pushing from this clone: `git remote set-url --push origin https://github.com/hienta16/hienta16.github.io.git`
2. Read `PRODUCT.md` and `src/content/site.ts` once more: they describe your learning evidence and will become public
   if the repository does.
3. GitHub Pages serves static files, so it needs the built `dist/` (for example a GitHub Actions workflow that runs
   `npm ci && npm run build` and deploys with `actions/deploy-pages`). Pages from a private repository needs a paid plan.

The previous one-page site is preserved on `main` and at the tag `baseline/pre-catwalk-2026-11-22`.
