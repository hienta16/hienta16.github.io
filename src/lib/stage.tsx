import { useEffect, useState } from 'react'
import raw from '../data/github.json'
import { expandDays, validateSnapshot, type Day, type GitHubData, type SnapshotProblem } from './stats'

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
    if (!('IntersectionObserver' in window)) return setSeen(true)
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

/** True while the element is on screen (used to run animation loops only when visible). */
export function useOnScreen<T extends Element>(ref: React.RefObject<T | null>) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((e) => setOn(e.some((x) => x.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return on
}

/* ---------- GitHub data, validated once ---------- */

export type GitHubState = { ok: true; data: GitHubData; days: Day[] } | { ok: false; problem: SnapshotProblem }

const data = raw as unknown as GitHubData
const problem = validateSnapshot(data?.calendar)
const state: GitHubState = problem ? { ok: false, problem } : { ok: true, data, days: expandDays(data.calendar) }

export const useGitHub = () => state

/* ---------- Live public profile check (no token; falls back silently) ---------- */

export interface LiveProfile {
  avatarUrl: string
  followers: number
  publicRepos: number
  checkedAt: number
}

export function useLiveProfile(login: string) {
  const [live, setLive] = useState<LiveProfile | null>(null)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`https://api.github.com/users/${encodeURIComponent(login)}`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((u) => setLive({ avatarUrl: u.avatar_url, followers: u.followers, publicRepos: u.public_repos, checkedAt: Date.now() }))
      .catch(() => {
        /* offline, rate-limited or blocked: the snapshot stays on screen */
      })
    return () => ctrl.abort()
  }, [login])
  return live
}
