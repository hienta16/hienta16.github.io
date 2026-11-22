/**
 * The data the profile hub's Python writes (github.com/hienta16/hienta16), as the website sees it.
 *
 * Bundled copies live in src/data/hub/ (`npm run data` refreshes them). When the hub is public, the site also reads
 * data/github.json and data/toys.json live from raw.githubusercontent.com, so a new toy shows up without a rebuild.
 * Everything read from the network is validated again here: the site never trusts a file just because it loaded.
 */
import { useEffect, useState } from 'react'
import bundledGithub from '../data/hub/github.json'
import bundledToys from '../data/hub/toys.json'
import hubConfig from '../data/hub/catwalk.json'
import toyConfig from '../data/hub/toys-config.json'

/* ───────── Types (mirror catwalk/stats/snapshot.py and catwalk/toys/models.py) ───────── */

export interface Streak {
  length: number
  start: string | null
  end: string | null
  running?: boolean
  todayPending?: boolean
}
export interface Metrics {
  activeDays: number
  firstContribution: string | null
  daysSinceFirst: number
  activeShareSinceFirst: number | null
  longestStreak: Streak
  currentStreak: Streak
  meanPerActiveDay: number | null
  months: { month: string; total: number; activeDays: number; days: number; partial: boolean }[]
  weekdays: { day: string; total: number }[]
  levels: { min: number; max: number | null; days: number }[]
}
export interface LanguageShare {
  name: string
  share: number
}
export interface Snapshot {
  schema: 2
  login: string
  generatedAt: string
  profile: { name: string; url: string; avatarUrl: string; joined: string; followers: number; asOf: string } | null
  calendar: { from: string; to: string; total: number; days: number[]; privateContributions: number; verifiedAgainstPublicProfile: boolean; asOf: string }
  metrics: Metrics
  counts: {
    scope: 'public' | 'public-and-private'
    asOf: string
    commitsLastYear: number
    pullRequestsLastYear: number
    issuesLastYear: number
    pullRequestsAllTime: number
    issuesAllTime: number
    contributedToLastYear: number
  } | null
  repositories: {
    scope: 'public' | 'public-and-private'
    asOf: string
    total: number
    public: number
    private: number
    stars: number
    withLanguages: number
    languages: { byBytes: LanguageShare[]; byRepos: LanguageShare[] }
  } | null
  refresh: { attemptedAt: string; ok: boolean; lastCompleteAt: string | null; problems: string[]; schedule: string }
}

export type ToyKey = 'yarn' | 'feather' | 'box'
export interface Gift {
  id: string
  toy: ToyKey
  variant: string
  issue: number
  giver: { login: string; id: number }
  createdAt: string
  expiresAt: string
}
export interface ToyState {
  schema: 1
  updatedAt: string | null
  active: Gift[]
  totals: Record<string, number>
  giftsTotal: number
  demo?: boolean
}
export interface ToyRule {
  label: string
  action: string
  lifetime_hours: number
  variants: string[]
  behavior: string
  arrival: string
}

export const hub = hubConfig as {
  login: string
  display_name: string
  role: string
  hub_repo: string
  site_url: string
  linkedin_url: string
  hub_public: boolean
  toys_live: boolean
}
export const toyRules = toyConfig as unknown as {
  title_prefix: string
  cooldown_hours: number
  max_visible: number
  history_days: number
  toys: Record<ToyKey, ToyRule>
}
export const TOY_KEYS = Object.keys(toyRules.toys) as ToyKey[]

const rawUrl = (path: string) => `https://raw.githubusercontent.com/${hub.hub_repo}/main/${path}`

/* ───────── Validation ───────── */

const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/
const isTime = (s: unknown): s is string => typeof s === 'string' && !Number.isNaN(Date.parse(s))

export function cleanGift(g: unknown): Gift | null {
  if (!g || typeof g !== 'object') return null
  const x = g as Partial<Gift>
  if (!x.toy || !TOY_KEYS.includes(x.toy)) return null
  if (!x.giver || typeof x.giver.login !== 'string' || !LOGIN.test(x.giver.login)) return null
  if (!isTime(x.createdAt) || !isTime(x.expiresAt) || Date.parse(x.expiresAt) <= Date.parse(x.createdAt)) return null
  if (!Number.isInteger(x.issue) || (x.issue as number) <= 0) return null
  const variant = typeof x.variant === 'string' && toyRules.toys[x.toy].variants.includes(x.variant) ? x.variant : toyRules.toys[x.toy].variants[0]
  return { id: String(x.id ?? `gift-${x.issue}`), toy: x.toy, variant, issue: x.issue as number, giver: { login: x.giver.login, id: Number(x.giver.id) }, createdAt: x.createdAt, expiresAt: x.expiresAt }
}

export function cleanToys(raw: unknown): ToyState | null {
  if (!raw || typeof raw !== 'object' || (raw as ToyState).schema !== 1) return null
  const r = raw as ToyState
  const totals: Record<string, number> = {}
  for (const k of TOY_KEYS) totals[k] = Number.isInteger(r.totals?.[k]) && r.totals[k] >= 0 ? r.totals[k] : 0
  return {
    schema: 1,
    updatedAt: isTime(r.updatedAt) ? r.updatedAt : null,
    active: (Array.isArray(r.active) ? r.active : []).map(cleanGift).filter((g): g is Gift => !!g),
    totals,
    giftsTotal: Object.values(totals).reduce((a, b) => a + b, 0),
    demo: r.demo === true,
  }
}

/** Toys in the scene right now: not yet expired (on the visitor's own clock), newest `max_visible`, oldest first. */
export function visibleToys(state: ToyState, now = Date.now()): Gift[] {
  return state.active
    .filter((g) => Date.parse(g.expiresAt) > now)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(-toyRules.max_visible)
}

export function snapshotOk(s: unknown): s is Snapshot {
  if (!s || typeof s !== 'object') return false
  const x = s as Snapshot
  const c = x.calendar
  if (x.schema !== 2 || !c || !Array.isArray(c.days) || !x.metrics) return false
  const span = Math.round((Date.parse(`${c.to}T00:00:00Z`) - Date.parse(`${c.from}T00:00:00Z`)) / 86_400_000) + 1
  return span === c.days.length && c.days.every((n) => Number.isInteger(n) && n >= 0) && c.days.reduce((a, b) => a + b, 0) === c.total
}

/* ───────── Sources ───────── */

export const bundledSnapshot = bundledGithub as unknown as Snapshot
export const bundledToyState = cleanToys(bundledToys)!

/** Demo toys (from `python -m catwalk toys demo --write`), only in development with ?toys=demo. */
const demoFiles = import.meta.glob('../data/hub/toys-demo.json', { eager: true, import: 'default' })
export const demoToyState: ToyState | null =
  import.meta.env.DEV && typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('toys') === 'demo'
    ? cleanToys(Object.values(demoFiles)[0])
    : null

async function fetchJson(path: string, signal?: AbortSignal) {
  const r = await fetch(`${rawUrl(path)}?t=${Math.floor(Date.now() / 60000)}`, { signal, cache: 'no-store' })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export type ToySource = 'bundled' | 'live' | 'demo'

/** The toy box state: demo (dev only) › live from the public hub › the bundled copy. `poll` re-reads every 20 s. */
export function useToyState(poll = false) {
  const [state, setState] = useState<{ toys: ToyState; source: ToySource }>(() =>
    demoToyState ? { toys: demoToyState, source: 'demo' } : { toys: bundledToyState, source: 'bundled' },
  )
  useEffect(() => {
    if (demoToyState || !hub.hub_public) return
    const ctrl = new AbortController()
    const load = () =>
      fetchJson('data/toys.json', ctrl.signal)
        .then((raw) => {
          const toys = cleanToys(raw)
          if (toys) setState({ toys, source: 'live' })
        })
        .catch(() => {
          /* offline or rate-limited: the bundled copy stays */
        })
    load()
    const id = poll ? window.setInterval(load, 20_000) : 0
    return () => {
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [poll])
  return state
}

/** The GitHub snapshot: live from the public hub when it validates, else the bundled copy. */
export function useLiveSnapshot(initial: Snapshot) {
  const [snap, setSnap] = useState(initial)
  useEffect(() => {
    if (!hub.hub_public) return
    const ctrl = new AbortController()
    fetchJson('data/github.json', ctrl.signal)
      .then((raw) => {
        if (snapshotOk(raw) && Date.parse(raw.generatedAt) > Date.parse(initial.generatedAt)) setSnap(raw)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [initial])
  return snap
}

/** A pre-filled GitHub issue for a toy (the hub's Python checks it; nothing here is trusted by the server). */
export function issueUrl(toy: ToyKey) {
  const q = new URLSearchParams({
    title: `${toyRules.title_prefix} ${toy}`,
    body: `Just press Create, there is nothing to write. A GitHub Action checks the gift (one per GitHub account every ${toyRules.cooldown_hours} hours) and the toy appears in the toy box within a few minutes.`,
  })
  return `https://github.com/${hub.hub_repo}/issues/new?${q.toString().replace(/\+/g, '%20')}`
}

export function lifetimeWords(hours: number) {
  return hours % 24 === 0 && hours >= 72 ? `${hours / 24} days` : `${hours} hours`
}

/** A plain SVG drawn by the hub (no scripts, no event handlers, no external references), or null. */
export function safeSvg(text: unknown): string | null {
  if (typeof text !== 'string' || !text.trimStart().startsWith('<svg')) return null
  if (/<script|<foreignObject|\son\w+\s*=|javascript:|href\s*=\s*["']?https?:/i.test(text)) return null
  return text
}

/** One of the hub's generated SVGs: live when the hub is public and the file passes safeSvg, else the bundled copy. */
export function useLiveSvg(path: string, initial: string) {
  const [svg, setSvg] = useState(initial)
  useEffect(() => {
    if (!hub.hub_public) return
    const ctrl = new AbortController()
    fetch(`${rawUrl(path)}?t=${Math.floor(Date.now() / 60000)}`, { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => {
        const ok = safeSvg(text)
        if (ok) setSvg(ok)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [path])
  return svg
}
