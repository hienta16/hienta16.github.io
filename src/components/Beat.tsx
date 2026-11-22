import { useEffect, useMemo, useRef, useState } from 'react'
import { copy } from '../content/site'
import { dayMonth, fill, num } from '../lib/format'
import { audioSupported, play, type Playback } from '../lib/sonify'
import { firstActive, type Day } from '../lib/stats'
import { useGitHub, useReducedMotion } from '../lib/stage'
import './Beat.css'

/** Contribution beat: every day since the first contribution, as a step of a beat. Visual pulse + optional sound. */
export function Beat() {
  const gh = useGitHub()
  if (!gh.ok) return null
  return <BeatBody days={gh.days} />
}

function BeatBody({ days }: { days: Day[] }) {
  const t = copy.beat
  const reduced = useReducedMotion()
  const run = useMemo(() => {
    const first = firstActive(days)
    return first ? days.slice(first.index) : []
  }, [days])
  const max = Math.max(1, ...run.map((d) => d.count))
  const [step, setStep] = useState<number | null>(null)
  const [hits, setHits] = useState(0)
  const playback = useRef<Playback | null>(null)
  const canSound = audioSupported()

  useEffect(() => () => playback.current?.stop(), [])

  const toggle = () => {
    if (playback.current) {
      playback.current.stop()
      playback.current = null
      setStep(null)
      return
    }
    playback.current = play(
      run.map((d) => ({ count: d.count, weekday: (d.weekday + 6) % 7 })),
      {
        sound: canSound,
        onStep: (i) => {
          setStep(i)
          if (run[i].count > 0) setHits((h) => h + 1)
        },
        onEnd: () => {
          playback.current = null
          setStep(null)
        },
      },
    )
  }

  const cur = step != null ? run[step] : null
  const loud = cur ? Math.sqrt(cur.count / max) : 0

  return (
    <section id="beat" className="beat field field--blue" aria-labelledby="beat-title">
      <div className="wrap section">
        <div className="beat__head">
          <h2 id="beat-title" className="title">
            {t.title}
          </h2>
          <p className="beat__line">{t.line}</p>
        </div>

        <div className="beat__deck">
          <button type="button" className={`beat__play ${step != null ? 'is-playing' : ''}`} onClick={toggle} aria-pressed={step != null}>
            <span className="beat__pulse" key={hits} style={{ ['--loud' as string]: loud }} aria-hidden="true" />
            <svg viewBox="0 0 24 24" className="beat__icon" aria-hidden="true">
              {step != null ? <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /> : <path d="M8 5.5v13l11-6.5z" fill="currentColor" />}
            </svg>
            <span className="beat__play-label">{step != null ? t.stop : t.play}</span>
          </button>

          <div className="beat__strip" aria-hidden="true">
            {run.map((d, i) => {
              const h = d.count ? 0.16 + 0.84 * Math.sqrt(d.count / max) : 0
              const newWeek = d.weekday === 0 && i > 0
              return (
                <span
                  key={d.index}
                  className={`beat__step ${d.count ? '' : 'is-rest'} ${step === i ? 'is-now' : ''} ${step != null && i < step ? 'is-past' : ''} ${newWeek ? 'is-week' : ''}`}
                  style={{ ['--h' as string]: h }}
                />
              )
            })}
          </div>
        </div>

        <p className="beat__meta" aria-live="polite">
          {cur
            ? fill(t.now, { date: dayMonth(cur.date), n: cur.count ? num(cur.count) : t.silent })
            : fill(t.range, { from: dayMonth(run[0].date), to: dayMonth(run.at(-1)!.date), days: num(run.length) })}
        </p>
        {!canSound && <p className="beat__note">{t.noAudio}</p>}
        {reduced && null}
      </div>
    </section>
  )
}
