# hienta16.github.io · Catwalk of Curiosity

**Hien Ta, Data Analyst.** A creative companion to the GitHub profile [@hienta16](https://github.com/hienta16):
real GitHub stats, a 3D runway of the contribution year, and a tuxedo cat who chases your cursor.

> Status: **local preview only.** The repository is private, GitHub Pages is not enabled, and this clone has pushing
> disabled on purpose (see "Publishing later").

## Run it

```bash
npm install
npm run dev          # refreshes GitHub data first, then http://127.0.0.1:5173/
```

| Command | What it does |
|---|---|
| `npm run dev` | Refresh `src/data/github.json` from GitHub (keeps the old file if offline), then start the dev server |
| `npm run build` | Type-check and build the static site into `dist/` |
| `npm run preview` | Serve the built `dist/` at http://127.0.0.1:4173/ |
| `npm test` | Unit tests for every statistic the page shows |
| `npm run snapshot:github` | Refresh GitHub data and fail loudly if anything is wrong |
| `npm run toys:collect` | Rebuild the cat's toy box from GitHub issues |

## Edit the words

Everything a visitor reads is in **`src/content/site.ts`** (English only). Numbers never appear in the copy: they come
from the data files. `profile` holds the GitHub login, the toy-box repository, `showGitHubAvatar`, and optional `email`
and `linkedin` links (empty = hidden).

## GitHub data: what is real, and how it stays current

`scripts/snapshot-github.mjs` writes `src/data/github.json`. It runs before every `npm run dev`, and once published it
can run on a schedule (`ops/proposed-workflows/refresh-github-data.yml`). In the browser, the page also checks your
public profile live (avatar, public repositories) and falls back silently if GitHub can't be reached.

| Shown on the site | Where it comes from |
|---|---|
| Contribution calendar, total, streaks, best day | GraphQL contribution calendar, **verified day by day against the anonymous public calendar**: the script refuses to write if they differ (today may lag; the public value wins) |
| Commits, pull requests, issues (last year) | GitHub search, authenticated: includes private repositories you can read |
| Stars, repositories, contributed to, languages | GraphQL, your own non-fork repositories, including private ones |

Stored: numbers and dates only. No repository names, no commit messages, no issue text. To count only public data, run
`node scripts/snapshot-github.mjs --public-only`. The avatar is your public GitHub photo; set `showGitHubAvatar: false`
to hide it.

Languages can be read two honest ways, and the card lets visitors switch: **by repository** (each repository counts
once) or **by code size** (GitHub's byte count, where one large codebase dominates).

## The cat's toy box (community)

Visitors toss a toy: the cat plays with it at once (only in their browser). To leave it for everyone, they open a GitHub
issue titled `[cat-toy] yarn` (or `feather`, `mouse`, `box`). `scripts/collect-cat-toys.mjs` reads only the title, the
author's login and the date, keeps one toy per person per day, and writes `src/data/cat-toys.json`.

To make it live: the repository must be **public** (visitors cannot open issues on a private one), then copy
`ops/proposed-workflows/cat-toys.yml` into `.github/workflows/`. Until then the box honestly says it is empty.

## How it is built

- Vite + React + TypeScript; no UI, animation or 3D libraries. Fonts self-hosted (Anybody, Be Vietnam Pro; SIL OFL).
- The cat (`src/components/Cat.tsx`) is drawn for this site as paper-cut SVG layers in a CSS 3D rig, so it turns in
  depth toward what it watches. The 3D contribution runway is a small perspective projection into SVG.
- `prefers-reduced-motion` stops the walk cycles, rope physics and entrances; everything stays usable by keyboard and
  touch (the yarn moves with the arrow keys).
- Design records: `PRODUCT.md`, `DESIGN.md`; review captures in `.impeccable/` (git-ignored).

## GitHub profile README (draft)

`profile-readme/` holds a draft README and banner in the same visual language for the profile repository
`hienta16/hienta16`. Nothing is published.

## Publishing later (not done)

1. Re-enable pushing from this clone: `git remote set-url --push origin https://github.com/hienta16/hienta16.github.io.git`
2. Read `PRODUCT.md`, `src/content/site.ts` and `src/data/github.json`: they become public with the repository.
3. GitHub Pages needs the built `dist/` (for example a workflow that runs `npm ci && npm run build` and deploys with
   `actions/deploy-pages`). Pages from a private repository needs a paid plan.
4. Optional: install the two workflows in `ops/proposed-workflows/` (add a `GH_STATS_TOKEN` secret for private counts).

Earlier versions: the first one-page site is on `main` (tag `baseline/pre-catwalk-2026-11-22`); the first Catwalk
version is at tag `checkpoint/catwalk-v1`.
