import { describe, expect, it } from 'vitest'
import snapshot from '../data/github-snapshot.json'
import {
  BINS,
  binCounts,
  binOf,
  busiestDay,
  expandDays,
  longestStreak,
  measure,
  monthTotals,
  normalCdf,
  twoProportionP,
  validateSnapshot,
  weekTotals,
  weekdayTotals,
  wilson,
  type Snapshot,
} from './stats'

const snap = snapshot as Snapshot
const days = expandDays(snap)

describe('snapshot', () => {
  it('is valid and adds up to the total GitHub reported', () => {
    expect(validateSnapshot(snap)).toBeNull()
    expect(days.reduce((a, d) => a + d.count, 0)).toBe(snap.total)
  })

  it('was verified against the public calendar', () => {
    expect(snap.publicCheck.matched).toBe(true)
  })

  it('maps weekdays and Sunday-first weeks like GitHub', () => {
    // 23 Nov 2025 was a Sunday; the window is 365 days, so 53 columns, the last holding one day.
    expect(days[0].weekday).toBe(new Date(`${snap.from}T00:00:00Z`).getUTCDay())
    const weeks = weekTotals(days)
    expect(weeks.length).toBe(days.at(-1)!.week + 1)
    expect(weeks.reduce((a, w) => a + w.total, 0)).toBe(snap.total)
  })

  it('rejects broken snapshots', () => {
    expect(validateSnapshot(null)).toBe('missing')
    expect(validateSnapshot({ ...snap, days: snap.days.slice(1) })).toBe('length')
    expect(validateSnapshot({ ...snap, total: snap.total + 1 })).toBe('total')
    expect(validateSnapshot({ ...snap, days: [-1, ...snap.days.slice(1)] })).toBe('negative')
  })
})

describe('aggregates', () => {
  it('month totals and weekday totals both sum to the total', () => {
    expect(monthTotals(days).reduce((a, m) => a + m.total, 0)).toBe(snap.total)
    expect(weekdayTotals(days).reduce((a, b) => a + b, 0)).toBe(snap.total)
  })

  it('marks partial edge months', () => {
    const months = monthTotals(days)
    expect(months[0].partial).toBe(true) // window starts on the 23rd
    expect(months.at(-1)!.partial).toBe(true) // window ends on the 22nd
    expect(months[1].partial).toBe(false)
  })

  it('bins cover every count exactly once', () => {
    for (const n of [0, 1, 5, 6, 15, 16, 40, 41, 999]) expect(binOf(n)).toBeGreaterThanOrEqual(0)
    expect(binCounts(days).reduce((a, b) => a + b, 0)).toBe(days.length)
    expect(BINS[0]).toEqual({ min: 0, max: 0 })
  })
})

describe('streaks and extremes', () => {
  const mk = (counts: number[]) =>
    expandDays({ ...snap, from: '2026-01-04', to: '2026-01-04', total: 0, days: counts })

  it('finds the longest run and whether it is still running', () => {
    expect(longestStreak(mk([1, 1, 0, 1, 1, 1]))).toMatchObject({ length: 3, running: true })
    expect(longestStreak(mk([1, 1, 1, 0, 1]))).toMatchObject({ length: 3, running: false })
    expect(longestStreak(mk([0, 0]))).toMatchObject({ length: 0 })
  })

  it('busiest day is the first maximum', () => {
    expect(busiestDay(mk([0, 3, 7, 7]))!.index).toBe(2)
    expect(busiestDay(mk([0, 0]))).toBeUndefined()
  })

  it('measure() clamps, orders and summarises a range', () => {
    const m = measure(days, { start: days.length + 50, end: -10 })
    expect(m.range).toEqual({ start: 0, end: days.length - 1 })
    expect(m.total).toBe(snap.total)
    expect(m.active + m.quiet).toBe(m.span)
  })
})

describe('proportions', () => {
  it('Wilson interval matches reference values', () => {
    const [lo, hi] = wilson(6, 25)
    expect(lo).toBeCloseTo(0.1149, 3)
    expect(hi).toBeCloseTo(0.4343, 3)
  })

  it('normal CDF and two-proportion test behave', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6)
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3)
    // WhatsApp 6/25 vs Email 8/50: far from significant.
    const p = twoProportionP(6, 25, 8, 50)
    expect(p).toBeGreaterThan(0.3)
    expect(p).toBeLessThan(0.5)
  })
})
