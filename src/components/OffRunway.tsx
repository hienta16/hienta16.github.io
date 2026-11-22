import { useEffect, useMemo, useRef, useState } from 'react'
import type { TagId } from '../content/site'
import { fill, useLang } from '../lib/i18n'
import { audioSupported, play, type Playback } from '../lib/sonify'
import { firstActive } from '../lib/stats'
import { useReducedMotion, useSeason } from '../lib/stage'
import { BackstageNote } from './BackstageNote'
import { CatFront, type Look } from './Cat'
import './OffRunway.css'

const TAGS: TagId[] = ['cats', 'music', 'dance', 'fashion']
const LOOKS: Look[] = ['bow', 'beret', 'scarf', 'sunglasses']

export function OffRunway() {
  const { t, date } = useLang()
  const season = useSeason()
  const reduced = useReducedMotion()
  const [active, setActive] = useState<TagId>('cats')
  const [watching, setWatching] = useState(false)
  const [gaze, setGaze] = useState({ x: 0, y: 0 })
  const [look, setLook] = useState<Look>('none')
  const [count, setCount] = useState<number | null>(null)
  const [playingDate, setPlayingDate] = useState<string | null>(null)
  const playback = useRef<Playback | null>(null)
  const catRef = useRef<SVGSVGElement>(null)
  const tabRefs = useRef<Partial<Record<TagId, HTMLButtonElement | null>>>({})
  const danceTimers = useRef<number[]>([])

  const run = useMemo(() => {
    if (!season.ok) return []
    const first = firstActive(season.days)
    return first ? season.days.slice(first.index) : []
  }, [season])

  /* Cats: the eyes follow the pointer while watching. */
  useEffect(() => {
    if (!watching) {
      setGaze({ x: 0, y: 0 })
      return
    }
    const onMove = (e: PointerEvent) => {
      const svg = catRef.current
      if (!svg) return
      const r = svg.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height * 0.28
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const d = Math.max(1, Math.hypot(dx, dy))
      setGaze({ x: dx / Math.max(d, 160), y: dy / Math.max(d, 160) })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [watching])

  useEffect(
    () => () => {
      playback.current?.stop()
      danceTimers.current.forEach((x) => window.clearTimeout(x))
    },
    [],
  )

  const bob = () => {
    const head = catRef.current?.querySelector<SVGGElement>('.cat-head')
    if (!head || reduced || !head.animate) return
    head.animate([{ transform: 'rotate(0) translateY(0)' }, { transform: 'rotate(-5deg) translateY(3px)' }, { transform: 'rotate(0) translateY(0)' }], {
      duration: 220,
      easing: 'ease-out',
    })
  }

  const stopMusic = () => {
    playback.current?.stop()
    playback.current = null
    setPlayingDate(null)
  }
  const toggleMusic = () => {
    if (playback.current) return stopMusic()
    if (!run.length) return
    playback.current = play(
      run.map((d) => ({ count: d.count, weekday: (d.weekday + 6) % 7 })),
      {
        onStep: (i) => {
          setPlayingDate(run[i].date)
          if (run[i].count > 0) bob()
        },
        onEnd: () => {
          playback.current = null
          setPlayingDate(null)
        },
      },
    )
  }

  const dance = () => {
    danceTimers.current.forEach((x) => window.clearTimeout(x))
    danceTimers.current = []
    const beat = reduced ? 700 : 480
    ;[0, 1, 2, 3].forEach((k) => danceTimers.current.push(window.setTimeout(() => setCount(k), k * beat)))
    danceTimers.current.push(window.setTimeout(() => setCount(null), 4 * beat + 200))
  }

  const nextLook = () => setLook((l) => LOOKS[(LOOKS.indexOf(l as Look) + 1) % LOOKS.length])

  const select = (id: TagId) => {
    if (id !== 'music' && playback.current) stopMusic()
    if (id !== 'cats') setWatching(false)
    setActive(id)
  }

  const onTabKey = (e: React.KeyboardEvent, id: TagId) => {
    const i = TAGS.indexOf(id)
    let j: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % TAGS.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i + TAGS.length - 1) % TAGS.length
    if (e.key === 'Home') j = 0
    if (e.key === 'End') j = TAGS.length - 1
    if (j === null) return
    e.preventDefault()
    select(TAGS[j])
    tabRefs.current[TAGS[j]]?.focus()
  }

  const tag = t.off.tags[active]
  const onAction = () => {
    if (active === 'cats') setWatching((w) => !w)
    if (active === 'music') toggleMusic()
    if (active === 'dance') dance()
    if (active === 'fashion') nextLook()
  }
  const actionPressed = active === 'cats' ? watching : active === 'music' ? playingDate !== null : undefined
  const actionLabel =
    active === 'cats' ? (watching ? tag.actionOff : tag.action) : active === 'music' ? (playingDate ? tag.actionOff : tag.action) : tag.action
  const lookName = look === 'none' ? '' : (t.off.lookNames as Record<string, string>)[look]

  return (
    <section id="off-the-runway" className="off field field--pink" aria-labelledby="off-title">
      <div className="wrap section">
        <div className="off__head">
          <h2 id="off-title" className="title">
            {t.off.title}
          </h2>
          <p className="sub">{t.off.sub}</p>
        </div>

        <div className="off__stage">
          <div className="tags">
            <div className="tags__string" aria-hidden="true" />
            <div role="tablist" aria-label={t.off.title} className="tags__list">
              {TAGS.map((id, i) => (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[id] = el
                  }}
                  role="tab"
                  id={`tag-${id}`}
                  aria-selected={active === id}
                  aria-controls="tag-panel"
                  tabIndex={active === id ? 0 : -1}
                  className="tag"
                  style={{ ['--tilt' as string]: `${[-4, 3, -2, 5][i]}deg`, ['--drop' as string]: `${[0, 18, 6, 24][i]}px` }}
                  onClick={() => select(id)}
                  onKeyDown={(e) => onTabKey(e, id)}
                >
                  <span className="tag__shape" aria-hidden="true" />
                  <span className="tag__hole" aria-hidden="true" />
                  <span className="tag__label">{t.off.tags[id].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="off__scene">
            <div className={`off__cat ${count !== null ? `is-step-${count}` : ''}`}>
              <CatFront
                ref={catRef}
                look={look}
                gaze={gaze}
                title={look === 'none' ? t.off.catLabelPlain : fill(t.off.catLabel, { look: lookName })}
              />
              <div className="off__floor" aria-hidden="true" />
            </div>

            <div id="tag-panel" role="tabpanel" aria-labelledby={`tag-${active}`} className="off__panel">
              <h3 className="off__panel-title">{tag.title}</h3>
              <p>{tag.text}</p>
              {(active !== 'music' || audioSupported()) && (
                <button type="button" className="tab off__action" onClick={onAction} aria-pressed={actionPressed}>
                  <span className="tab__tape" aria-hidden="true" />
                  <span className="tab__label">{actionLabel}</span>
                </button>
              )}
              <p className="off__live" aria-live="polite">
                {active === 'dance' && count !== null && <span className="off__count">{t.off.counts[count]}</span>}
                {active === 'music' && playingDate && fill(t.off.nowPlaying, { from: date(run[0].date), to: date(playingDate) })}
                {active === 'fashion' && lookName && <span className="off__look">{lookName}</span>}
              </p>
              {active === 'music' && <BackstageNote>{t.backstage.off}</BackstageNote>}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
