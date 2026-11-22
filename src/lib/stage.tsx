import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import raw from '../data/github-snapshot.json'
import { expandDays, validateSnapshot, type Day, type Snapshot, type SnapshotProblem } from './stats'

/* ---------- Backstage pass: shows the method layer ---------- */

interface BackstageState {
  on: boolean
  toggle: () => void
}
const BackstageContext = createContext<BackstageState>({ on: false, toggle: () => {} })
const PASS_KEY = 'catwalk.backstage'

export function BackstageProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(() => {
    try {
      return window.localStorage.getItem(PASS_KEY) === 'on'
    } catch {
      return false
    }
  })
  useEffect(() => {
    document.documentElement.dataset.backstage = on ? 'on' : 'off'
    try {
      window.localStorage.setItem(PASS_KEY, on ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [on])
  const toggle = useCallback(() => setOn((v) => !v), [])
  const value = useMemo(() => ({ on, toggle }), [on, toggle])
  return <BackstageContext.Provider value={value}>{children}</BackstageContext.Provider>
}

export const useBackstage = () => useContext(BackstageContext)

/* ---------- Reduced motion ---------- */

export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/* ---------- The data, validated once ---------- */

export interface Season {
  ok: true
  snapshot: Snapshot
  days: Day[]
}
export type SeasonState = Season | { ok: false; problem: SnapshotProblem }

const snapshot = raw as Snapshot
const problem = validateSnapshot(snapshot)
const season: SeasonState = problem ? { ok: false, problem } : { ok: true, snapshot, days: expandDays(snapshot) }

export const useSeason = () => season

/* ---------- Small shared hooks ---------- */

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia?.(query).matches ?? false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

/** True once the element has entered the viewport (never resets). */
export function useSeen<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '0px 0px -15% 0px') {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    if (!('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, seen])
  return seen
}
