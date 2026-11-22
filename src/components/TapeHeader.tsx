import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { copy, profile, sectionOrder, type SectionId } from '../content/site'
import { useMediaQuery, useReducedMotion } from '../lib/stage'
import { RulerCat, type RulerPose } from './Cat'
import { GitHubMark } from './icons'
import './TapeHeader.css'

export const sectionDomId: Record<SectionId, string> = {
  hello: 'hello',
  about: 'about',
  github: 'github',
  runway: 'off-the-runway',
  backstage: 'backstage',
  contact: 'say-hi',
}

export function TapeHeader() {
  const t = copy.nav
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 760px)')

  const tapeRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({})
  const sheetRef = useRef<HTMLDialogElement>(null)

  const [marks, setMarks] = useState<Record<SectionId, number>>(
    () => Object.fromEntries(sectionOrder.map((s, i) => [s, i / (sectionOrder.length - 1)])) as Record<SectionId, number>,
  )
  const [labelX, setLabelX] = useState<Partial<Record<SectionId, number>>>({})
  const [current, setCurrent] = useState<SectionId>('hello')
  const [box, setBox] = useState({ start: 0, end: 1 })
  const [pose, setPose] = useState<RulerPose>('sit')
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const [meow, setMeow] = useState(false)

  /* Where each section starts, as a share of the scrollable length. */
  const measure = useCallback(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const next = {} as Record<SectionId, number>
    for (const s of sectionOrder) {
      const el = document.getElementById(sectionDomId[s])
      next[s] = el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - 8) / max)) : 0
    }
    setMarks(next)
    const tape = tapeRef.current
    if (tape) {
      const lead = tape.querySelector<HTMLElement>('.tape__brand')
      setBox({ start: lead ? lead.offsetLeft + lead.offsetWidth + 22 : 22, end: tape.getBoundingClientRect().width - 26 })
    }
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  /* Labels sit at their true marks, nudged only to avoid collisions. */
  useLayoutEffect(() => {
    if (!wide) return
    const span = box.end - box.start
    const widths = sectionOrder.map((s) => labelRefs.current[s]?.offsetWidth ?? 60)
    const out: Partial<Record<SectionId, number>> = {}
    let prevEnd = -Infinity
    sectionOrder.forEach((s, i) => {
      const x = Math.max(box.start + marks[s] * span, prevEnd + 16)
      out[s] = x
      prevEnd = x + widths[i]
    })
    let limit = box.end
    for (let i = sectionOrder.length - 1; i >= 0; i--) {
      const s = sectionOrder[i]
      if ((out[s] ?? 0) + widths[i] > limit) out[s] = limit - widths[i]
      limit = (out[s] ?? 0) - 16
    }
    setLabelX(out)
  }, [marks, box, wide])

  /* Scroll drives the cat: walk, run, sit, sleep, and play at the very end. */
  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()
    let sitTimer = 0
    let sleepTimer = 0
    const settle = (p: number) => {
      window.clearTimeout(sitTimer)
      window.clearTimeout(sleepTimer)
      sitTimer = window.setTimeout(() => setPose(p > 0.995 ? 'play' : 'sit'), reduced ? 0 : 260)
      sleepTimer = window.setTimeout(() => setPose((cur) => (cur === 'play' ? cur : 'sleep')), 9000)
    }
    const tick = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      tapeRef.current?.style.setProperty('--p', String(p))
      const now = performance.now()
      const dy = window.scrollY - lastY
      const v = Math.abs(dy) / Math.max(16, now - lastT)
      if (dy !== 0) {
        setDir(dy < 0 ? 'back' : 'fwd')
        if (!reduced) setPose(v > 1.6 ? 'run' : 'walk')
      }
      lastY = window.scrollY
      lastT = now
      settle(p)
      let cur: SectionId = 'hello'
      for (const s of sectionOrder) {
        const el = document.getElementById(sectionDomId[s])
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = s
      }
      setCurrent((c) => (c === cur ? c : cur))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      window.clearTimeout(sitTimer)
      window.clearTimeout(sleepTimer)
    }
  }, [reduced])

  const sayMrrp = () => {
    setMeow(true)
    setPose((p) => (p === 'sleep' ? 'sit' : p))
    window.setTimeout(() => setMeow(false), 1300)
  }

  return (
    <header
      className="tape-header"
      style={{ ['--tape-start' as string]: `${box.start}px`, ['--tape-end' as string]: `${box.end}px` }}
    >
      <div className="tape-header__lane" aria-hidden="true" />
      <div className="tape" ref={tapeRef}>
        <a className="tape__brand" href="#hello">
          <span className="tape__tip" aria-hidden="true" />
          <span className="label">{profile.displayName}</span>
        </a>
        <svg className="tape__ticks" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="tape-ticks" width="40" height="12" patternUnits="userSpaceOnUse">
              <path d="M.5 12V0M8.5 12V7M16.5 12V7M24.5 12V4M32.5 12V7" stroke="var(--ink)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="12" fill="url(#tape-ticks)" />
        </svg>
        <div className="tape__fill" aria-hidden="true" />
        {wide && (
          <nav className="tape__nav" aria-label={t.label}>
            <ol>
              {sectionOrder.map((s) => (
                <li
                  key={s}
                  style={{ ['--x' as string]: `${labelX[s] ?? 0}px`, ['--mark' as string]: `${box.start + marks[s] * (box.end - box.start)}px` }}
                >
                  <span className="tape__mark" aria-hidden="true" />
                  <a
                    ref={(el) => {
                      labelRefs.current[s] = el
                    }}
                    href={`#${sectionDomId[s]}`}
                    className="label tape__link"
                    aria-current={current === s ? 'location' : undefined}
                  >
                    {t.sections[s]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <button type="button" className={`tape__cat is-${dir}`} onClick={sayMrrp} aria-label="Say hello to the cat">
          <span className="tape__cat-body">
            <RulerCat pose={pose} />
          </span>
          {meow && (
            <span className="tape__meow" aria-hidden="true">
              mrrp
            </span>
          )}
        </button>
        <span className="sr-only">{t.tape}</span>
      </div>

      <div className="tape-tab">
        <a className="tape-tab__gh" href={profile.githubUrl} rel="noopener">
          <GitHubMark className="icon" />
          <span className="tape-tab__gh-text">@{profile.githubLogin}</span>
          <span className="sr-only">{t.github}</span>
        </a>
        {!wide && (
          <button type="button" className="tape-tab__menu" onClick={() => sheetRef.current?.showModal()} aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
              <path d="M3 6h18M3 12h12M3 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{t.menu}</span>
          </button>
        )}
      </div>

      <dialog
        className="sheet"
        ref={sheetRef}
        aria-label={t.label}
        onClick={(e) => {
          if (e.target === sheetRef.current) sheetRef.current?.close()
        }}
      >
        <div className="sheet__inner">
          <div className="sheet__top">
            <p className="label">{t.label}</p>
            <button type="button" className="sheet__close" onClick={() => sheetRef.current?.close()}>
              {t.close}
            </button>
          </div>
          <ol className="sheet__list">
            {sectionOrder.map((s) => (
              <li key={s}>
                <a href={`#${sectionDomId[s]}`} onClick={() => sheetRef.current?.close()} aria-current={current === s ? 'location' : undefined}>
                  {t.sections[s]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </dialog>
    </header>
  )
}
