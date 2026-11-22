import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { sectionOrder, type SectionId } from '../content/site'
import { useLang } from '../lib/i18n'
import { useBackstage, useMediaQuery, useReducedMotion } from '../lib/stage'
import { CatSide } from './Cat'
import './TapeHeader.css'

const ids: Record<SectionId, string> = {
  opening: 'opening',
  patterns: 'patterns',
  notes: 'notes',
  metrics: 'metrics',
  collection: 'collection',
  off: 'off-the-runway',
  after: 'after-the-show',
}

export const sectionDomId = (s: SectionId) => ids[s]

export function TapeHeader() {
  const { t, lang, setLang } = useLang()
  const { on: backstage, toggle } = useBackstage()
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 760px)')

  const tapeRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const catSvgWrap = useRef<HTMLSpanElement>(null)
  const labelRefs = useRef<Partial<Record<SectionId, HTMLAnchorElement | null>>>({})
  const sheetRef = useRef<HTMLDialogElement>(null)

  const [marks, setMarks] = useState<Record<SectionId, number>>(() =>
    Object.fromEntries(sectionOrder.map((s, i) => [s, i / (sectionOrder.length - 1)])) as Record<SectionId, number>,
  )
  const [labelX, setLabelX] = useState<Partial<Record<SectionId, number>>>({})
  const [current, setCurrent] = useState<SectionId>('opening')
  const [tapeBox, setTapeBox] = useState({ start: 0, end: 1 })

  /* Measure where each section starts, as a share of the scrollable length. */
  const measure = useCallback(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const next = {} as Record<SectionId, number>
    for (const s of sectionOrder) {
      const el = document.getElementById(ids[s])
      next[s] = el ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - 8) / max)) : 0
    }
    setMarks(next)
    const tape = tapeRef.current
    if (tape) {
      const r = tape.getBoundingClientRect()
      const lead = tape.querySelector<HTMLElement>('.tape__brand')
      const start = lead ? lead.offsetLeft + lead.offsetWidth + 18 : 16
      setTapeBox({ start, end: r.width - 14 })
    }
  }, [])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  /* Lay out labels at their true marks, nudged right only when they would collide. */
  useLayoutEffect(() => {
    if (!wide) return
    const span = tapeBox.end - tapeBox.start
    const out: Partial<Record<SectionId, number>> = {}
    let prevEnd = -Infinity
    const widths = sectionOrder.map((s) => labelRefs.current[s]?.offsetWidth ?? 60)
    sectionOrder.forEach((s, i) => {
      const trueX = tapeBox.start + marks[s] * span
      const x = Math.max(trueX, prevEnd + 14)
      out[s] = x
      prevEnd = x + widths[i]
    })
    // Pull back from the right edge if the last labels overflow.
    let limit = tapeBox.end
    for (let i = sectionOrder.length - 1; i >= 0; i--) {
      const s = sectionOrder[i]
      if ((out[s] ?? 0) + widths[i] > limit) out[s] = limit - widths[i]
      limit = (out[s] ?? 0) - 14
    }
    setLabelX(out)
  }, [marks, tapeBox, wide, lang])

  /* Scroll: move the cat and the reading, mark the current section. */
  useEffect(() => {
    let raf = 0
    let lastY = window.scrollY
    let idleTimer = 0
    const tick = () => {
      raf = 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      const tape = tapeRef.current
      if (tape) tape.style.setProperty('--p', String(p))
      const svg = catSvgWrap.current?.firstElementChild
      if (svg && !reduced) {
        svg.classList.add('is-walking')
        window.clearTimeout(idleTimer)
        idleTimer = window.setTimeout(() => svg.classList.remove('is-walking'), 220)
      }
      if (catRef.current) catRef.current.dataset.dir = window.scrollY < lastY ? 'back' : 'fwd'
      lastY = window.scrollY
      let cur: SectionId = 'opening'
      for (const s of sectionOrder) {
        const el = document.getElementById(ids[s])
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
      window.clearTimeout(idleTimer)
    }
  }, [reduced])

  const openSheet = () => sheetRef.current?.showModal()
  const closeSheet = () => sheetRef.current?.close()

  return (
    <header className="tape-header" style={{ ['--tape-start' as string]: `${tapeBox.start}px`, ['--tape-end' as string]: `${tapeBox.end}px` }}>
      <div className="tape-header__lane" aria-hidden="true" />
      <div className="tape" ref={tapeRef}>
        <a className="tape__brand" href="#opening">
          <span className="tape__tip" aria-hidden="true" />
          <span className="label">Tạ Minh Hiền</span>
        </a>
        <svg className="tape__ticks" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="tape-ticks" width="40" height="12" patternUnits="userSpaceOnUse">
              <path d="M.5 12V0M8.5 12V7M16.5 12V7M24.5 12V4M32.5 12V7" stroke="var(--ink)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="12" fill="url(#tape-ticks)" />
        </svg>
        {wide && (
          <nav className="tape__nav" aria-label={t.nav.label}>
            <ol>
              {sectionOrder.map((s) => (
                <li key={s} style={{ ['--x' as string]: `${labelX[s] ?? 0}px`, ['--mark' as string]: `${tapeBox.start + marks[s] * (tapeBox.end - tapeBox.start)}px` }}>
                  <span className="tape__mark" aria-hidden="true" />
                  <a
                    ref={(el) => {
                      labelRefs.current[s] = el
                    }}
                    href={`#${ids[s]}`}
                    className="label tape__link"
                    aria-current={current === s ? 'location' : undefined}
                  >
                    {t.nav.sections[s]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="tape__reading" aria-hidden="true" />
        <div className="tape__cat" ref={catRef} aria-hidden="true">
          <span ref={catSvgWrap}>
            <CatSide />
          </span>
        </div>
        <span className="sr-only">{t.nav.tapeLabel}</span>
      </div>

      <div className="tape-tab">
        <div className="tape-tab__lang" role="group" aria-label={t.nav.language}>
          {(['en', 'vi'] as const).map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} className="tape-tab__btn" lang={l}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="pass" aria-pressed={backstage} onClick={toggle} title={t.pass.hint}>
          <span className="pass__hole" aria-hidden="true" />
          <span className="pass__text">
            <span className="pass__name">{t.pass.label}</span>
            <span className="pass__state">{backstage ? t.pass.on : t.pass.off}</span>
          </span>
        </button>
        {!wide && (
          <button type="button" className="tape-tab__menu" onClick={openSheet} aria-haspopup="dialog">
            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
              <path d="M3 6h18M3 12h12M3 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="sr-only">{t.nav.menu}</span>
          </button>
        )}
      </div>

      <dialog
        className="sheet"
        ref={sheetRef}
        aria-label={t.nav.label}
        onClick={(e) => {
          if (e.target === sheetRef.current) closeSheet()
        }}
      >
        <div className="sheet__inner">
          <div className="sheet__top">
            <p className="label">{t.nav.label}</p>
            <button type="button" className="sheet__close" onClick={closeSheet}>
              {t.nav.close}
            </button>
          </div>
          <ol className="sheet__list">
            {sectionOrder.map((s) => (
              <li key={s}>
                <a href={`#${ids[s]}`} onClick={closeSheet} aria-current={current === s ? 'location' : undefined}>
                  {t.nav.sections[s]}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </dialog>
    </header>
  )
}
