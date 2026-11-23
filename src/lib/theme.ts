/**
 * Light and dark, with the visitor in charge.
 * - First visit: follow the device (`prefers-color-scheme`). No time zones, no guessing where anyone is.
 * - Manual choice (sun / moon) is remembered in localStorage; "Auto" forgets it and follows the device again.
 * - index.html applies the stored choice before the first paint, so the page never flashes the wrong theme.
 * - Switching runs a circular reveal from the toggle (View Transitions), or an instant swap with reduced motion.
 * The theme also picks the cat: the tortoiseshell by day, the black-and-white cat by night.
 */
import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type ThemePref = 'light' | 'dark' | 'auto'
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'hienta16:theme'
export const THEME_COLOR: Record<Theme, string> = { light: '#FFF9F4', dark: '#12142A' }

export const parsePref = (value: unknown): ThemePref => (value === 'light' || value === 'dark' ? value : 'auto')
export const resolveTheme = (pref: ThemePref, systemDark: boolean): Theme => (pref === 'auto' ? (systemDark ? 'dark' : 'light') : pref)

const hasWindow = typeof window !== 'undefined'
const system = hasWindow && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null

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
let theme: Theme = resolveTheme(pref, !!system?.matches)
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
  if (!doc.startViewTransition || reduced) return commit()
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
  transitionTo(resolveTheme(next, !!system?.matches), origin)
}

system?.addEventListener('change', () => {
  if (pref === 'auto') transitionTo(resolveTheme('auto', system.matches))
})
if (hasWindow) paint()

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
