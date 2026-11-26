import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import { HANOI_TZ, THEME_COLOR, THEME_KEY, hanoiClock, hanoiTheme, msUntilSwitch, parsePref, resolveTheme } from './theme'

/** A moment given as Hanoi wall-clock time. Vietnam is UTC+7 all year, so the instant is built from UTC. */
const hanoi = (day: string, hhmmss: string) => {
  const [h, m, s = 0] = hhmmss.split(':').map(Number)
  const t = Date.parse(`${day}T00:00:00Z`) + ((h - 7) * 3600 + m * 60 + s) * 1000
  return new Date(t)
}

describe('theme preference', () => {
  it('reads only light or dark from storage; anything else means Auto', () => {
    expect(parsePref('light')).toBe('light')
    expect(parsePref('dark')).toBe('dark')
    for (const junk of [null, undefined, '', 'auto', 'Dark', 'night', 1, {}]) expect(parsePref(junk)).toBe('auto')
  })
})

describe('Auto follows Hanoi time', () => {
  it.each([
    ['05:59', 'dark'],
    ['06:00', 'light'],
    ['12:00', 'light'],
    ['17:59', 'light'],
    ['18:00', 'dark'],
    ['23:59', 'dark'],
    ['00:00', 'dark'],
  ])('%s in Hanoi → %s', (time, want) => {
    expect(hanoiTheme(hanoi('2026-11-24', time))).toBe(want)
    expect(resolveTheme('auto', hanoi('2026-11-24', time))).toBe(want)
  })

  it('reads the hour in Hanoi, whatever the visitor’s own day or time zone', () => {
    // 05:59 in Hanoi is still the previous evening (22:59 UTC) in London and 17:59 in New York: still dark.
    const early = hanoi('2026-11-24', '05:59')
    expect(early.toISOString()).toBe('2026-11-23T22:59:00.000Z')
    expect(hanoiClock(early)).toEqual({ h: 5, m: 59, s: 0 })
    expect(hanoiTheme(early)).toBe('dark')
    // and the formatter really uses the IANA zone
    expect(new Intl.DateTimeFormat('en-GB', { timeZone: HANOI_TZ, hour: '2-digit', hourCycle: 'h23' }).format(early)).toBe('05')
  })

  it('a manual choice wins at any hour', () => {
    expect(resolveTheme('light', hanoi('2026-11-24', '22:00'))).toBe('light')
    expect(resolveTheme('dark', hanoi('2026-11-24', '10:00'))).toBe('dark')
  })

  it('knows how long until the next switch, across midnight', () => {
    expect(msUntilSwitch(hanoi('2026-11-24', '17:59'))).toBe(60_000)
    expect(msUntilSwitch(hanoi('2026-11-24', '05:59:59'))).toBe(1_000)
    expect(msUntilSwitch(hanoi('2026-11-24', '18:00'))).toBe(12 * 3600e3)
    expect(msUntilSwitch(hanoi('2026-11-24', '23:00'))).toBe(7 * 3600e3)
    expect(msUntilSwitch(hanoi('2026-11-24', '00:30'))).toBe(5.5 * 3600e3)
  })

  it('the pre-paint script in index.html uses the same key, zone and hours, and not the device setting', () => {
    expect(html).toContain(THEME_KEY)
    expect(html).toContain(HANOI_TZ)
    expect(html).toContain('h < 6 || h >= 18')
    expect(html.toLowerCase()).toContain(THEME_COLOR.dark.toLowerCase())
    expect(html).not.toContain('prefers-color-scheme')
  })
})
