/**
 * Light and dark, on Hanoi time.
 * - Auto (the default): the theme follows the clock in Hanoi (IANA zone Asia/Ho_Chi_Minh), the same for every visitor
 *   wherever they are and whatever their device prefers: light from 06:00 to 17:59, dark from 18:00 to 05:59.
 *   The time source is the visitor's own clock, read in Hanoi's zone through Intl; a wrong device clock gives a
 *   wrong Hanoi hour, and there is no network time check.
 * - Manual choice (sun / moon) is remembered in localStorage; "Auto" forgets it and follows Hanoi time again.
 * - index.html applies the same rule before the first paint, so the page never flashes the wrong theme.
 * - While the page stays open, the theme changes by itself at 06:00 and 18:00. The check is aimed at the next
 *   switch, runs at least once a minute (so a changed clock or a sleeping laptop is caught), and runs again whenever
 *   the tab becomes visible.
 * - Switching runs a circular reveal (View Transitions), or an instant swap with reduced motion or in a hidden tab.
 * The theme also picks the cat: the tortoiseshell by day, the black-and-white cat by night.
 */
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type ThemePref = 'light' | 'dark' | 'auto'
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'hienta16:theme'
export const THEME_COLOR: Record<Theme, string> = { light: '#FFF9F4', dark: '#12142A' }
export const HANOI_TZ = 'Asia/Ho_Chi_Minh'
/** Hours (Hanoi) when the day starts and ends */
export const DAY_STARTS = 6
export const NIGHT_STARTS = 18

export const parsePref = (value: unknown): ThemePref => (value === 'light' || value === 'dark' ? value : 'auto')

let hanoiFormat: Intl.DateTimeFormat | null = null
try {
  hanoiFormat = new Intl.DateTimeFormat('en-GB', { timeZone: HANOI_TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
} catch {
  hanoiFormat = null
}

/** The wall-clock time in Hanoi at `now`, read through the IANA zone (the fixed +7 is only a fallback). */
export function hanoiClock(now: Date = new Date()): { h: number; m: number; s: number } {
  if (hanoiFormat) {
    const parts = hanoiFormat.formatToParts(now)
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
    return { h: get('hour') % 24, m: get('minute'), s: get('second') }
  }
  const t = new Date(now.getTime() + 7 * 3600e3)
  return { h: t.getUTCHours(), m: t.getUTCMinutes(), s: t.getUTCSeconds() }
}

/** Auto: light from 06:00 to 17:59 in Hanoi, dark from 18:00 to 05:59. */
export const hanoiTheme = (now: Date = new Date()): Theme => {
  const { h } = hanoiClock(now)
  return h >= DAY_STARTS && h < NIGHT_STARTS ? 'light' : 'dark'
}
export const resolveTheme = (pref: ThemePref, now: Date = new Date()): Theme => (pref === 'auto' ? hanoiTheme(now) : pref)

/** Milliseconds from `now` until the next 06:00 or 18:00 in Hanoi. */
export function msUntilSwitch(now: Date = new Date()): number {
  const { h, m, s } = hanoiClock(now)
  const elapsed = ((h * 60 + m) * 60 + s) * 1000 + now.getUTCMilliseconds()
  const next = [DAY_STARTS, NIGHT_STARTS, DAY_STARTS + 24].map((hr) => hr * 3600e3).find((t) => t > elapsed) as number
  return next - elapsed
}

const hasWindow = typeof window !== 'undefined'

function readStored(): string | null {
  try {
    return window.localStorage.getItem(THEME_KEY)
  } catch {
    return null
  }
}
function writeStored(pref: ThemePref) {
  try {
    if (pref === 'auto') window.localStorage.removeItem(THEME_KEY)
    else window.localStorage.setItem(THEME_KEY, pref)
  } catch {
    /* private mode or blocked storage: the choice simply lasts for this visit */
  }
}

let pref: ThemePref = hasWindow ? parsePref(readStored()) : 'auto'
let theme: Theme = resolveTheme(pref)
const listeners = new Set<() => void>()

function paint() {
  if (!hasWindow) return
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.themePref = pref
  root.style.colorScheme = theme
  root.style.background = THEME_COLOR[theme]
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => (m.content = THEME_COLOR[theme]))
}
const emit = () => listeners.forEach((l) => l())

/** Swap to `next`, with a circular reveal from `origin` when the browser can and the visitor allows motion. */
function transitionTo(next: Theme, origin?: { x: number; y: number }) {
  if (next === theme) {
    paint()
    emit()
    return
  }
  const commit = () => {
    theme = next
    paint()
    flushSync(emit)
  }
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!doc.startViewTransition || reduced || document.hidden) return commit()
  const x = origin?.x ?? window.innerWidth - 80
  const y = origin?.y ?? 40
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const vt = doc.startViewTransition(commit)
  vt.ready
    .then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      ),
    )
    .catch(() => {})
}

export function setThemePref(next: ThemePref, origin?: { x: number; y: number }) {
  pref = next
  writeStored(next)
  transitionTo(resolveTheme(next), origin)
  schedule()
}

/* Auto: change at 06:00 / 18:00 Hanoi time without a reload. */
let timer = 0
function sync() {
  if (pref === 'auto') {
    const next = hanoiTheme()
    if (next !== theme) transitionTo(next)
  }
  schedule()
}
function schedule() {
  if (!hasWindow) return
  window.clearTimeout(timer)
  if (pref !== 'auto') return
  // Aim just past the next switch, but look again within a minute: timers drift in background tabs and stop
  // while a laptop sleeps, and the device clock can be changed.
  timer = window.setTimeout(sync, Math.min(msUntilSwitch() + 250, 60_000))
}
if (hasWindow) {
  paint()
  schedule()
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) sync()
  })
  window.addEventListener('focus', sync)
  window.addEventListener('pageshow', sync)
  // Another tab changed the choice: follow it here too.
  window.addEventListener('storage', (e) => {
    if (e.key !== THEME_KEY && e.key !== null) return
    pref = parsePref(readStored())
    transitionTo(resolveTheme(pref))
    schedule()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const snap = useSyncExternalStore(
    subscribe,
    () => `${pref}|${theme}`,
    () => 'auto|light',
  )
  const [p, t] = snap.split('|') as [ThemePref, Theme]
  return { pref: p, theme: t, setPref: setThemePref, coat: t === 'dark' ? ('tuxie' as const) : ('tortie' as const) }
}
