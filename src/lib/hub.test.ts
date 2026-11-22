import { describe, expect, it } from 'vitest'
import { bundledSnapshot, cleanGift, cleanToys, issueUrl, snapshotOk, toyRules, visibleToys, type ToyState } from './hub'
import { expandDays, firstActive, levelOf } from './stats'

const gift = (over: Record<string, unknown> = {}) => ({
  id: 'gift-1',
  toy: 'yarn',
  variant: 'pink',
  issue: 1,
  giver: { login: 'kind-visitor', id: 7 },
  createdAt: '2026-11-20T10:00:00Z',
  expiresAt: '2026-11-27T10:00:00Z',
  ...over,
})

describe('hub data', () => {
  it('accepts the bundled snapshot the Python wrote', () => {
    expect(snapshotOk(bundledSnapshot)).toBe(true)
  })

  it('refuses a snapshot whose days do not add up', () => {
    const bad = { ...bundledSnapshot, calendar: { ...bundledSnapshot.calendar, total: bundledSnapshot.calendar.total + 1 } }
    expect(snapshotOk(bad)).toBe(false)
  })

  it('cleans gifts: unknown toys, odd logins and impossible dates are dropped', () => {
    expect(cleanGift(gift())).not.toBeNull()
    expect(cleanGift(gift({ toy: 'laser' }))).toBeNull()
    expect(cleanGift(gift({ giver: { login: '<img src=x>', id: 1 } }))).toBeNull()
    expect(cleanGift(gift({ expiresAt: '2026-11-19T00:00:00Z' }))).toBeNull()
    expect(cleanGift(gift({ variant: 'neon' }))?.variant).toBe('pink')
  })

  it('hides toys on the visitor clock, exactly at expiresAt', () => {
    const state = cleanToys({ schema: 1, updatedAt: null, active: [gift()], totals: { yarn: 1 }, giftsTotal: 1 }) as ToyState
    expect(visibleToys(state, Date.parse('2026-11-27T09:59:59Z'))).toHaveLength(1)
    expect(visibleToys(state, Date.parse('2026-11-27T10:00:00Z'))).toHaveLength(0)
    expect(state.giftsTotal).toBe(1)
  })

  it('shows at most max_visible toys, newest kept', () => {
    const many = Array.from({ length: toyRules.max_visible + 3 }, (_, i) =>
      gift({ id: `g${i}`, issue: i + 1, createdAt: `2026-11-2${Math.min(i, 9)}T0${i % 10}:00:00Z`, expiresAt: '2026-12-30T00:00:00Z' }),
    )
    const state = cleanToys({ schema: 1, updatedAt: null, active: many, totals: {}, giftsTotal: 0 }) as ToyState
    expect(visibleToys(state, Date.parse('2026-11-29T00:00:00Z'))).toHaveLength(toyRules.max_visible)
  })

  it('opens a pre-filled issue on the hub', () => {
    expect(issueUrl('box')).toMatch(/^https:\/\/github\.com\/hienta16\/hienta16\/issues\/new\?title=%5Bcat-toy%5D%20box&body=/)
  })

  it('expands the calendar with Sunday-first weekdays', () => {
    const days = expandDays({ from: '2026-03-01', days: [0, 0, 4] })
    expect(days[0].weekday).toBe(0)
    expect(firstActive(days)?.date).toBe('2026-03-03')
    expect([0, 1, 6, 16, 41].map(levelOf)).toEqual([0, 1, 2, 3, 4])
  })
})
