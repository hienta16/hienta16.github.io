import { copy } from '../content/site'
import { useTheme, type ThemePref } from '../lib/theme'
import './ThemeToggle.css'

const ORDER: ThemePref[] = ['light', 'auto', 'dark']

const Sun = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
    <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const Moon = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" focusable="false">
    <path d="M19.6 14.6A8 8 0 0 1 9.4 4.4a8 8 0 1 0 10.2 10.2Z" fill="currentColor" />
  </svg>
)
const Auto = () => (
  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="7.6" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M12 4.4a7.6 7.6 0 0 1 0 15.2Z" fill="currentColor" />
  </svg>
)
const ICON: Record<ThemePref, () => React.ReactElement> = { light: Sun, auto: Auto, dark: Moon }

const centre = (e: React.MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/** Three choices in a pill: sun, follow the device, moon. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const t = copy.theme
  const { pref, setPref } = useTheme()
  return (
    <div className={`theme-toggle ${className}`} role="group" aria-label={t.label}>
      {ORDER.map((p) => {
        const Icon = ICON[p]
        return (
          <button
            key={p}
            type="button"
            className="theme-toggle__btn"
            data-pref={p}
            aria-pressed={pref === p}
            title={t[p]}
            onClick={(e) => setPref(p, centre(e))}
          >
            <Icon />
            <span className="sr-only">{t[p]}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Phones: one button that cycles light → dark → auto and shows where it is. */
export function ThemeCycle() {
  const t = copy.theme
  const { pref, setPref } = useTheme()
  const next: ThemePref = pref === 'light' ? 'dark' : pref === 'dark' ? 'auto' : 'light'
  const Icon = ICON[pref]
  return (
    <button type="button" className="theme-cycle" onClick={(e) => setPref(next, centre(e))} title={`${t[pref]} · ${t.next}`}>
      <Icon />
      <span className="sr-only">{`${t.label}: ${t[pref]}. ${t.next}`}</span>
    </button>
  )
}
