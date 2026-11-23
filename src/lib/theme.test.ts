import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import { THEME_COLOR, THEME_KEY, parsePref, resolveTheme } from './theme'

describe('theme preference', () => {
  it('reads only light or dark from storage; anything else means Auto', () => {
    expect(parsePref('light')).toBe('light')
    expect(parsePref('dark')).toBe('dark')
    for (const junk of [null, undefined, '', 'auto', 'Dark', 'night', 1, {}]) expect(parsePref(junk)).toBe('auto')
  })

  it('Auto follows the device, and a manual choice wins over it', () => {
    expect(resolveTheme('auto', false)).toBe('light')
    expect(resolveTheme('auto', true)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('the pre-paint script in index.html uses the same key and colours, and never a clock or a time zone', () => {
    expect(html).toContain(THEME_KEY)
    expect(html.toLowerCase()).toContain(THEME_COLOR.dark.toLowerCase())
    expect(html).toContain('prefers-color-scheme')
    expect(html).not.toMatch(/getHours|Intl\.DateTimeFormat|timeZone|geolocation/)
  })
})
