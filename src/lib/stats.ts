/**
 * Pure statistics over the contribution snapshot. Every number on the page comes from here,
 * so the copy never hard-codes a figure that could drift from the data.
 * Dates are calendar dates (YYYY-MM-DD) in GitHub's profile time zone; arithmetic runs in UTC
 * so the visitor's own time zone can never shift a day.
 */

export interface Snapshot {
  login: string
  source: string
  generatedAt: string
  from: string
  to: string
  total: number
  privateContributions: number
  publicCheck: { matched: boolean | null; checkedAt: string | null; publicHeading?: string }
  days: number[]
}

export interface Day {
  index: number
  date: string
  count: number
  /** 0 = Sunday … 6 = Saturday */
  weekday: number
  /** Column in a Sunday-first calendar grid */
  week: number
}

export interface Range {
  start: number
  end: number
}

const DAY_MS = 86_400_000

export const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`)
export const fromTime = (t: number) => new Date(t).toISOString().slice(0, 10)
export const addDays = (date: string, n: number) => fromTime(toTime(date) + n * DAY_MS)
export const weekdayOf = (date: string) => new Date(toTime(date)).getUTCDay()

export type SnapshotProblem = 'missing' | 'length' | 'total' | 'negative'

/** Returns null when the snapshot is usable, otherwise what is wrong with it. */
export function validateSnapshot(s: Partial<Snapshot> | null | undefined): SnapshotProblem | null {
  if (!s || !Array.isArray(s.days) || !s.from || !s.to || typeof s.total !== 'number') return 'missing'
  const expected = Math.round((toTime(s.to) - toTime(s.from)) / DAY_MS) + 1
  if (s.days.length !== expected) return 'length'
  if (s.days.some((n) => !Number.isInteger(n) || n < 0)) return 'negative'
  if (s.days.reduce((a, b) => a + b, 0) !== s.total) return 'total'
  return null
}

export function expandDays(s: Snapshot): Day[] {
  const firstWeekday = weekdayOf(s.from)
  return s.days.map((count, index) => {
    const date = addDays(s.from, index)
    return { index, date, count, weekday: (firstWeekday + index) % 7, week: Math.floor((firstWeekday + index) / 7) }
  })
}

export const clampRange = (r: Range, length: number): Range => {
  const a = Math.max(0, Math.min(length - 1, Math.round(r.start)))
  const b = Math.max(0, Math.min(length - 1, Math.round(r.end)))
  return a <= b ? { start: a, end: b } : { start: b, end: a }
}

export const slice = (days: Day[], r: Range) => days.slice(r.start, r.end + 1)
export const sum = (days: Day[]) => days.reduce((a, d) => a + d.count, 0)
export const activeCount = (days: Day[]) => days.filter((d) => d.count > 0).length

export function firstActive(days: Day[]): Day | undefined {
  return days.find((d) => d.count > 0)
}

export interface Streak {
  length: number
  start?: string
  end?: string
  /** True when the streak reaches the last day of the slice */
  running: boolean
}

export function longestStreak(days: Day[]): Streak {
  let best: Streak = { length: 0, running: false }
  let run = 0
  let runStart = ''
  days.forEach((d, i) => {
    if (d.count > 0) {
      if (run === 0) runStart = d.date
      run++
      if (run > best.length) best = { length: run, start: runStart, end: d.date, running: i === days.length - 1 }
    } else run = 0
  })
  // A tie that reaches the end still counts as running.
  if (run > 0 && run === best.length) best = { ...best, start: runStart, end: days.at(-1)!.date, running: true }
  return best
}

export function busiestDay(days: Day[]): Day | undefined {
  return days.reduce<Day | undefined>((best, d) => (d.count > 0 && (!best || d.count > best.count) ? d : best), undefined)
}

export interface WeekTotal {
  week: number
  start: string
  end: string
  total: number
  days: number
}

/** Sunday-first weeks, matching GitHub's calendar columns. Partial edge weeks are kept as they are. */
export function weekTotals(days: Day[]): WeekTotal[] {
  const map = new Map<number, WeekTotal>()
  for (const d of days) {
    const w = map.get(d.week)
    if (w) {
      w.total += d.count
      w.end = d.date
      w.days++
    } else map.set(d.week, { week: d.week, start: d.date, end: d.date, total: d.count, days: 1 })
  }
  return [...map.values()]
}

export function busiestWeek(days: Day[]): WeekTotal | undefined {
  return weekTotals(days).reduce<WeekTotal | undefined>((b, w) => (w.total > 0 && (!b || w.total > b.total) ? w : b), undefined)
}

export interface MonthTotal {
  key: string // YYYY-MM
  total: number
  active: number
  days: number
  firstIndex: number
  lastIndex: number
  /** True when the slice does not cover the whole calendar month */
  partial: boolean
}

export function monthTotals(days: Day[]): MonthTotal[] {
  const map = new Map<string, MonthTotal>()
  for (const d of days) {
    const key = d.date.slice(0, 7)
    const m = map.get(key)
    if (m) {
      m.total += d.count
      m.active += d.count > 0 ? 1 : 0
      m.days++
      m.lastIndex = d.index
    } else map.set(key, { key, total: d.count, active: d.count > 0 ? 1 : 0, days: 1, firstIndex: d.index, lastIndex: d.index, partial: false })
  }
  for (const m of map.values()) {
    const [y, mo] = m.key.split('-').map(Number)
    const inMonth = new Date(Date.UTC(y, mo, 0)).getUTCDate()
    m.partial = m.days < inMonth
  }
  return [...map.values()]
}

/** Totals by weekday, Monday first (index 0 = Monday … 6 = Sunday). */
export function weekdayTotals(days: Day[]): number[] {
  const out = [0, 0, 0, 0, 0, 0, 0]
  for (const d of days) out[(d.weekday + 6) % 7] += d.count
  return out
}

export function median(values: number[]): number | undefined {
  if (!values.length) return undefined
  const s = [...values].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

export const medianActive = (days: Day[]) => median(days.filter((d) => d.count > 0).map((d) => d.count))

/** Fixed, labelled bins for the calendar. Upper bound inclusive; Infinity for the last. */
export const BINS = [
  { min: 0, max: 0 },
  { min: 1, max: 5 },
  { min: 6, max: 15 },
  { min: 16, max: 40 },
  { min: 41, max: Number.POSITIVE_INFINITY },
] as const

export const binOf = (count: number) => BINS.findIndex((b) => count >= b.min && count <= b.max)

export function binCounts(days: Day[]): number[] {
  const out = BINS.map(() => 0)
  for (const d of days) out[binOf(d.count)]++
  return out
}

export interface Measure {
  range: Range
  from: string
  to: string
  span: number
  total: number
  active: number
  quiet: number
  streak: Streak
  busiestDay?: Day
  busiestWeek?: WeekTotal
  median?: number
  weekdays: number[]
}

export function measure(days: Day[], r: Range): Measure {
  const range = clampRange(r, days.length)
  const part = slice(days, range)
  const total = sum(part)
  const active = activeCount(part)
  return {
    range,
    from: part[0].date,
    to: part.at(-1)!.date,
    span: part.length,
    total,
    active,
    quiet: part.length - active,
    streak: longestStreak(part),
    busiestDay: busiestDay(part),
    busiestWeek: busiestWeek(part),
    median: medianActive(part),
    weekdays: weekdayTotals(part),
  }
}

export function daysBetween(a: string, b: string) {
  return Math.round((toTime(b) - toTime(a)) / DAY_MS)
}

/* ---------- Proportions, for the simulated outreach case ---------- */

/** Wilson score interval for k successes out of n (z = 1.96 for 95%). */
export function wilson(k: number, n: number, z = 1.959964): [number, number] {
  if (n === 0) return [0, 1]
  const p = k / n
  const z2 = z * z
  const centre = (p + z2 / (2 * n)) / (1 + z2 / n)
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / (1 + z2 / n)
  return [Math.max(0, centre - half), Math.min(1, centre + half)]
}

/** Standard normal CDF (Abramowitz and Stegun 7.1.26 via erf). */
export function normalCdf(x: number) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2)
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-(x * x) / 2)
  return x >= 0 ? (1 + y) / 2 : (1 - y) / 2
}

/** Two-sided p-value of a pooled two-proportion z-test. */
export function twoProportionP(k1: number, n1: number, k2: number, n2: number) {
  const p = (k1 + k2) / (n1 + n2)
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2))
  if (se === 0) return 1
  const z = Math.abs(k1 / n1 - k2 / n2) / se
  return 2 * (1 - normalCdf(z))
}
