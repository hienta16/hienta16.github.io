# hienta16.github.io · Catwalk of Curiosity

**Hien Ta, Data Analyst.** The website half of one identity system. The other half, the Python automation and the
GitHub profile README, lives in [`hienta16/hienta16`](https://github.com/hienta16/hienta16) (the "hub"). Both show
the same numbers, the same tortoiseshell cat and the same Electric Baby Pop palette.

> Status: **live** at https://hienta16.github.io (published 23/11/2026 with Hien's approval). Every push to `main`
> runs `.github/workflows/pages.yml`: it pulls the newest hub data, runs the tests, builds and deploys.

## How the two repositories fit together

```
hienta16/hienta16 (hub, Python)                         hienta16.github.io (this repo, React)
  catwalk.stats  GitHub API -> data/github.json  ───┐     scripts/sync_hub.py copies the hub's output into
  catwalk.toys   issues     -> data/toys.json    ───┼──►  src/data/hub/ (committed, so the site always builds)
  catwalk.render data       -> SVGs + README     ───┘     and, once the hub is public, reads the JSON live
```

Python does everything that runs on a schedule or touches GitHub: fetching and verifying stats, computing every
metric, drawing the 3D contribution year, and running the toy box rules. TypeScript does only what needs a browser:
the moving cat, the playable beat, hover details. Every number on this site comes from `src/data/hub/github.json`.

## Run it

```bash
npm install
npm run dev          # copies the hub's data first (../hienta16, or $CATWALK_HUB), then http://127.0.0.1:5173/
```

| Command | What it does |
|---|---|
| `npm run dev` | Sync data from the hub checkout (keeps the bundled copy if there is none), start the dev server |
| `npm run data` | Sync from the hub checkout and fail loudly if a file is missing or malformed |
| `npm run data:remote` | Sync from the public hub on GitHub (after it is public) |
| `npm run export:art` | Render the cat and toy drawings to static SVGs in the hub (`assets/art/`) for the README |
| `npm run build` / `npm run preview` | Type-check and build into `dist/`; serve it at http://127.0.0.1:4173/ |
| `npm test` | Unit tests for the data layer (validation, expiry, issue links) |

Preview the toy box with sample gifts: run `python -m catwalk toys demo --write` in the hub, `npm run data`, then open
http://127.0.0.1:5173/?toys=demo (development only, labelled "Demo data").

## Edit the words

Everything a visitor reads is in **`src/content/site.ts`** (English only). Toy lifetimes, the cooldown, the toy limit
and the go-live switches come from the hub's `config/toys.json` and `config/catwalk.json`, so the site always says
exactly what the server enforces.

## The sections

| Section | Built from |
|---|---|
| Hello | Name, role, the tortoiseshell cat (`TortieCat.tsx`): eyes and head follow the pointer, pupils widen when it moves fast |
| About | `site.ts` |
| GitHub stats | The hub's `iso-site.svg` inlined (hover a block for its day), plus activity, streaks, languages and weekly rhythm from `github.json` |
| Contribution beat | Every day since the first contribution as one step; Web Audio plays a high pentatonic bell only when you press play |
| The cat's toy box | Persisted toys from the hub's `toys.json`; a local preview while the box is not live; the cat chases yarn, swats at the feather, naps in the box |
| Backstage | Empty, honest placeholders |
| Contact | GitHub and LinkedIn |

## The toy box: preview vs. real

- **Real gifts** appear only after the hub's GitHub Action has accepted them (one per account every 24 hours; yarn
  stays 7 days, a feather 48 hours, a box 14 days; at most 9 at once). The site hides a toy the moment its
  `expiresAt` passes, on the visitor's own clock.
- **Before going live** (`toys_live: false`), "Give to cat" only previews the toy in the visitor's browser, tagged
  "Preview", never saved and never counted.
- **After going live**, "Give on GitHub" opens a pre-filled issue on the hub; the page then checks the hub for the
  new toy every 20 seconds for a few minutes.

## Deployment

GitHub Pages, source "GitHub Actions", workflow `.github/workflows/pages.yml` (push to `main` or run it by hand).
The hub is public and switched on (`hub_public`, `toys_live`), so the live site reads `data/github.json`,
`data/toys.json` and the 3D year straight from it. To take the site down: Settings → Pages → Unpublish.
The hub's switches and how to turn them off are in its `docs/ACTIVATION.md`.

Earlier versions: the first one-page site is on `main` (tag `baseline/pre-catwalk-2026-11-22`); v1 is tag
`checkpoint/catwalk-v1`, v2 tag `checkpoint/companion-v2`.
