import { describe, expect, it } from 'vitest'
import raw from '../data/github.json'
import {
  BINS,
  binCounts,
  binOf,
  busiestDay,
  currentStreak,
  expandDays,
  languageShares,
  longestStreak,
  measure,
  monthTotals,
  validateSnapshot,
  weekTotals,
  weekdayTotals,
  type GitHubData,
} from './stats'

const data = raw as unknown as GitHubData
const cal = data.calendar
const days = expandDays(cal)

describe('github.json', () => {
  it('holds a valid calendar that adds up to its total', () => {
    expect(validateSnapshot(cal)).toBeNull()
    expect(days.reduce((a, d) => a + d.count, 0)).toBe(cal.total)
    expect(cal.verifiedAgainstPublicProfile).toBe(true)
  })

  it('stores no repository names or text, only numbers', () => {
    const text = JSON.stringify(data)
    expect(text).not.toMatch(/"(name|full_name|nameWithOwner)":\s*"(?!Hien Minh Ta)/)
    for (const r of data.languageBytesByRepository) for (const v of Object.values(r)) expect(Number.isInteger(v)).toBe(true)
    expect(data.counts.repositories.total).toBe(data.counts.repositories.public + data.counts.repositories.private)
  })

  it('rejects broken calendars', () => {
    expect(validateSnapshot(null)).toBe('missing')
    expect(validateSnapshot({ ...cal, days: cal.days.slice(1) })).toBe('length')
    expect(validateSnapshot({ ...cal, total: cal.total + 1 })).toBe('total')
    expect(validateSnapshot({ ...cal, days: [-1, ...cal.days.slice(1)] })).toBe('negative')
  })
})

describe('aggregates', () => {
  it('weeks, months and weekdays all sum to the total', () => {
    expect(weekTotals(days).reduce((a, w) => a + w.total, 0)).toBe(cal.total)
    expect(monthTotals(days).reduce((a, m) => a + m.total, 0)).toBe(cal.total)
    expect(weekdayTotals(days).reduce((a, b) => a + b, 0)).toBe(cal.total)
  })

  it('bins cover every count exactly once', () => {
    for (const n of [0, 1, 5, 6, 15, 16, 40, 41, 999]) expect(binOf(n)).toBeGreaterThanOrEqual(0)
    expect(binCounts(days).reduce((a, b) => a + b, 0)).toBe(days.length)
    expect(BINS[0]).toEqual({ min: 0, max: 0 })
  })

  it('measure() clamps, orders and summarises a range', () => {
    const m = measure(days, { start: days.length + 50, end: -10 })
    expect(m.range).toEqual({ start: 0, end: days.length - 1 })
    expect(m.total).toBe(cal.total)
    expect(m.active + m.quiet).toBe(m.span)
  })
})

describe('streaks', () => {
  const mk = (counts: number[]) => expandDays({ from: '2026-01-04', to: '2026-01-04', total: 0, days: counts })

  it('longest streak and whether it reaches the end', () => {
    expect(longestStreak(mk([1, 1, 0, 1, 1, 1]))).toMatchObject({ length: 3, running: true })
    expect(longestStreak(mk([1, 1, 1, 0, 1]))).toMatchObject({ length: 3, running: false })
    expect(longestStreak(mk([0, 0]))).toMatchObject({ length: 0 })
  })

  it('current streak does not break on an empty today', () => {
    expect(currentStreak(mk([0, 1, 1, 1]))).toMatchObject({ length: 3, todayPending: false })
    expect(currentStreak(mk([0, 1, 1, 0]))).toMatchObject({ length: 2, todayPending: true })
    expect(currentStreak(mk([1, 0, 0]))).toMatchObject({ length: 0, todayPending: true })
  })

  it('busiest day is the first maximum', () => {
    expect(busiestDay(mk([0, 3, 7, 7]))!.index).toBe(2)
    expect(busiestDay(mk([0, 0]))).toBeUndefined()
  })
})

describe('languages', () => {
  const repos: Record<string, number>[] = [{ PHP: 900, Python: 100 }, { Python: 50, 'Jupyter Notebook': 50 }, { HTML: 10 }]

  it('by bytes pools all code', () => {
    const s = languageShares(repos, 'bytes')
    expect(s[0]).toMatchObject({ name: 'PHP' })
    expect(s.reduce((a, b) => a + b.share, 0)).toBeCloseTo(1, 9)
  })

  it('by repository gives every repository one vote', () => {
    const s = languageShares(repos, 'repos')
    expect(s.find((x) => x.name === 'HTML')!.share).toBeCloseTo(1 / 3, 9)
    expect(s.find((x) => x.name === 'Python')!.share).toBeCloseTo((0.1 + 0.5) / 3, 9)
    expect(s.reduce((a, b) => a + b.share, 0)).toBeCloseTo(1, 9)
  })

  it('pools the tail into Other', () => {
    const many = [{ A: 6, B: 5, C: 4, D: 3, E: 2, F: 1, G: 1 }]
    const s = languageShares(many, 'bytes', 5)
    expect(s).toHaveLength(6)
    expect(s.at(-1)).toMatchObject({ name: 'Other' })
    expect(s.at(-1)!.share).toBeCloseTo(2 / 22, 9)
  })

  it('real data yields shares that add up', () => {
    for (const mode of ['bytes', 'repos'] as const) {
      expect(languageShares(data.languageBytesByRepository, mode).reduce((a, b) => a + b.share, 0)).toBeCloseTo(1, 9)
    }
  })
})
