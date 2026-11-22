import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../content/site'
import { fill, useLang } from '../lib/i18n'
import { firstActive, weekTotals } from '../lib/stats'
import { useReducedMotion, useSeason } from '../lib/stage'
import { CatFront } from './Cat'
import { FittedName } from './FittedName'
import { Runway } from './Runway'
import { BackstageNote } from './BackstageNote'
import './Hero.css'

const NAME_LINES = ['Tạ Minh', 'Hiền']

export function Hero() {
  const { t, num, date, monthYear } = useLang()
  const season = useSeason()
  const reduced = useReducedMotion()
  const catRef = useRef<HTMLButtonElement>(null)
  const [fit, setFit] = useState<{ size: number; width: number; measure: number } | null>(null)

  const data = useMemo(() => {
    if (!season.ok) return null
    const weeks = weekTotals(season.days)
    const first = firstActive(season.days)
    const max = Math.max(...weeks.map((w) => w.total), 1)
    return { weeks, first, max, total: season.snapshot.total, from: season.snapshot.from, to: season.snapshot.to }
  }, [season])

  const maxSize = useCallback((w: number, single: boolean) => {
    const vh = window.innerHeight
    return single ? Math.min(vh * 0.2, w * 0.2) : Math.min(vh * 0.2, 220)
  }, [])

  /* The cat walks down the runway once, then sits at the front. */
  useEffect(() => {
    const el = catRef.current
    if (!el || reduced || !el.animate) return
    const walk = el.animate(
      // Constant walking speed in depth: z falls linearly from 6 to 1, so scale = 1/z and the screen position follows the
      // runway's own projection (y = a + b/z). Offsets in cat heights; the cat is 21% of the figure's height.
      [
        { transform: 'translate(-50%, -468%) scale(0.167)', opacity: 0 },
        { transform: 'translate(-50%, -460%) scale(0.18)', opacity: 1, offset: 0.04 },
        { transform: 'translate(-50%, -451%) scale(0.2)', offset: 0.2 },
        { transform: 'translate(-50%, -426%) scale(0.25)', offset: 0.4 },
        { transform: 'translate(-50%, -385%) scale(0.333)', offset: 0.6 },
        { transform: 'translate(-50%, -330%) scale(0.444)', offset: 0.75 },
        { transform: 'translate(-50%, -220%) scale(0.667)', offset: 0.9 },
        { transform: 'translate(-50%, -119%) scale(0.87)', offset: 0.97 },
        { transform: 'translate(-50%, 0) scale(1)', opacity: 1 },
      ],
      { duration: 3000, delay: 400, easing: 'linear', fill: 'backwards' },
    )
    const svg = el.querySelector('svg')
    const bob = svg?.animate([{ transform: 'translateY(0) rotate(-2deg)' }, { transform: 'translateY(-5%) rotate(2deg)' }, { transform: 'translateY(0) rotate(-2deg)' }], {
      duration: 500,
      delay: 400,
      iterations: 6,
      easing: 'ease-in-out',
    })
    return () => {
      walk.cancel()
      bob?.cancel()
    }
  }, [reduced])

  const turn = () => {
    const svg = catRef.current?.querySelector('svg')
    if (!svg) return
    if (reduced || !svg.animate) {
      svg.classList.toggle('is-turned')
      return
    }
    svg.animate(
      [
        { transform: 'rotateY(0) translateY(0)' },
        { transform: 'rotateY(90deg) translateY(-8%)', offset: 0.3 },
        { transform: 'rotateY(270deg) translateY(-8%)', offset: 0.7 },
        { transform: 'rotateY(360deg) translateY(0)' },
      ],
      { duration: 820, easing: 'cubic-bezier(.65,0,.35,1)' },
    )
  }

  const firstMonth = data?.first ? monthYear(data.first.date.slice(0, 7)) : ''

  return (
    <section id="opening" className="hero field field--cream" aria-labelledby="hero-name">
      <div className="wrap hero__wrap">
        <div className="hero__name" id="hero-name">
          <FittedName name={profile.name} lines={NAME_LINES} maxSize={maxSize} onFit={setFit} />
          {fit && (
            <div className="bs hero__dim" aria-hidden="true">
              <span className="hero__dim-line" />
              <span className="label">{fit.measure} px</span>
            </div>
          )}
        </div>

        <div className="hero__stage">
          <div className="hero__floor hero__floor--left">
            <p className="hero__role">{t.hero.role}</p>
            <p className="hero__intro">{t.hero.intro}</p>
            <div className="hero__actions">
              <a className="tab" href="#patterns">
                <span className="tab__tape" aria-hidden="true" />
                <span className="tab__label">
                  {t.hero.cta}
                  <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                    <path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>
              <a className="hero__secondary" href="#metrics">
                {t.hero.secondary}
              </a>
            </div>
            {fit && (
              <BackstageNote>{fill(t.backstage.name, { wdth: fit.width, size: fit.size })}</BackstageNote>
            )}
          </div>

          <div className="hero__runway">
          <figure
            className="hero__runway-figure"
            aria-label={
              data
                ? fill(t.hero.figureLabel, { from: date(data.from), to: date(data.to), firstMonth, total: num(data.total) })
                : t.hero.unavailable
            }
            role="img"
          >
            {data ? (
              <Runway weeks={data.weeks} max={data.max} animate={!reduced} />
            ) : (
              <p className="hero__unavailable">{t.hero.unavailable}</p>
            )}
          </figure>
            <button ref={catRef} type="button" className="hero__cat" onClick={turn} aria-label={t.hero.catTurn}>
              <CatFront />
            </button>
          </div>

          <div className="hero__floor hero__floor--right">
            {data && (
              <>
                <h2 className="label hero__read-title">{t.hero.readTitle}</h2>
                <p>{fill(t.hero.read1, { from: date(data.from), to: date(data.to) })}</p>
                <p>{fill(t.hero.read2, { firstMonth, total: num(data.total) })}</p>
                <ul className="hero__legend" aria-label={t.hero.readTitle}>
                  <li>
                    <span className="dot dot--off" aria-hidden="true" />
                    {t.hero.legendOff}
                  </li>
                  <li>
                    <span className="dot dot--on" aria-hidden="true" />
                    {t.hero.legendOn}
                  </li>
                  <li>
                    <span className="dot dot--now" aria-hidden="true" />
                    {t.hero.legendNow}
                  </li>
                </ul>
                <BackstageNote>{fill(t.backstage.runway, { max: num(data.max) })}</BackstageNote>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
