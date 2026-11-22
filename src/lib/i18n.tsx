import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy, type Copy, type Lang } from '../content/site'
import { toTime } from './stats'

interface LangState {
  lang: Lang
  t: Copy
  setLang: (l: Lang) => void
  num: (n: number) => string
  pct: (p: number, digits?: number) => string
  /** 14 Nov 2026 · 14/11/2026 */
  date: (d: string) => string
  /** 14 Nov · 14/11 */
  dayMonth: (d: string) => string
  /** September 2026 · tháng 9/2026 */
  monthYear: (key: string) => string
  /** Sep · Th9 */
  monthShort: (key: string) => string
  /** Mon … Sun (Monday-first index) */
  weekday: (mondayIndex: number, long?: boolean) => string
}

const STORAGE_KEY = 'catwalk.lang'
const LangContext = createContext<LangState | null>(null)

function initialLang(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'en' || q === 'vi') return q
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'vi') return saved
  } catch {
    /* storage can be blocked; fall through */
  }
  return navigator.language?.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}

export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = copy[lang].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy[lang].meta.description)
  }, [lang])

  const value = useMemo<LangState>(() => {
    const t = copy[lang]
    const locale = lang === 'vi' ? 'vi-VN' : 'en-GB'
    const nf = new Intl.NumberFormat(locale)
    const parts = (d: string) => {
      const dt = new Date(toTime(d))
      return { y: dt.getUTCFullYear(), m: dt.getUTCMonth(), d: dt.getUTCDate() }
    }
    return {
      lang,
      t,
      setLang,
      num: (n) => nf.format(n),
      pct: (p, digits = 0) =>
        new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(p),
      date: (d) => {
        const { y, m, d: day } = parts(d)
        return lang === 'vi' ? `${day}/${m + 1}/${y}` : `${day} ${t.dates.months[m]} ${y}`
      },
      dayMonth: (d) => {
        const { m, d: day } = parts(d)
        return lang === 'vi' ? `${day}/${m + 1}` : `${day} ${t.dates.months[m]}`
      },
      monthYear: (key) => {
        const [y, m] = key.split('-').map(Number)
        return lang === 'vi' ? `${t.dates.monthsLong[m - 1]}/${y}` : `${t.dates.monthsLong[m - 1]} ${y}`
      },
      monthShort: (key) => t.dates.months[Number(key.split('-')[1]) - 1],
      weekday: (i, long) => (long ? t.dates.weekdaysLong[i] : t.dates.weekdays[i]),
    }
  }, [lang, setLang])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang outside LangProvider')
  return ctx
}
