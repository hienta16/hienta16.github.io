import { useCallback, useEffect, useRef, useState } from 'react'
import toysData from '../data/cat-toys.json'
import { copy, profile, type TagId, type ToyId } from '../content/site'
import { ago, fill, num } from '../lib/format'
import { useMediaQuery, useOnScreen, useReducedMotion } from '../lib/stage'
import { Cat, Toy, type CatMood } from './Cat'
import { IconArrow } from './icons'
import './CatStage.css'

const TAGS: TagId[] = ['cats', 'music', 'dance', 'fashion']
const TOYS: ToyId[] = ['yarn', 'feather', 'mouse', 'box']
const MOOD: Record<TagId, { mood: CatMood; ms: number }> = {
  cats: { mood: 'blink', ms: 1600 },
  music: { mood: 'bob', ms: 2600 },
  dance: { mood: 'sway', ms: 1900 },
  fashion: { mood: 'shades', ms: 3600 },
}

interface CommunityToy {
  login: string
  toy: ToyId
  createdAt: string
  issue: number
}
const community = ((toysData as { toys?: CommunityToy[] }).toys ?? []).filter((t) => TOYS.includes(t.toy))

const ROPE = 12
const SEG = 13

export function CatStage() {
  const t = copy.runway
  const reduced = useReducedMotion()
  const coarse = useMediaQuery('(hover: none)')
  const stageRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)
  const ropeRef = useRef<SVGPathElement>(null)
  const ballRef = useRef<HTMLButtonElement>(null)
  const onScreen = useOnScreen(stageRef)

  const [gaze, setGaze] = useState({ x: 0.4, y: 0.6 })
  const [mood, setMood] = useState<CatMood>('idle')
  const [bubble, setBubble] = useState<{ id: TagId; line: string } | null>(null)
  const [swing, setSwing] = useState<TagId | null>(null)
  const [tossed, setTossed] = useState<{ id: number; toy: ToyId }[]>([])
  const [lastToss, setLastToss] = useState<ToyId | null>(null)

  const moodTimer = useRef(0)
  const swatCool = useRef(0)
  // Yarn state lives in refs and is drawn directly, so the rope can run at 60 fps without re-rendering React.
  const ball = useRef({ x: 0, y: 0, angle: 0, inside: false, ready: false })
  const rope = useRef<{ x: number; y: number; px: number; py: number }[]>([])

  const setMoodFor = useCallback((m: CatMood, ms: number) => {
    window.clearTimeout(moodTimer.current)
    setMood(m)
    moodTimer.current = window.setTimeout(() => setMood('idle'), ms)
  }, [])

  /* Place the yarn on the floor to the right of the cat at start and on resize. */
  const rest = useCallback(() => {
    const st = stageRef.current
    if (!st) return
    const r = st.getBoundingClientRect()
    ball.current = { ...ball.current, x: r.width * (r.width < 700 ? 0.88 : 0.72), y: r.height - 78, ready: true }
    rope.current = Array.from({ length: ROPE }, (_, i) => {
      const x = ball.current.x + i * SEG * 0.9
      const y = ball.current.y + Math.min(14, i * 3)
      return { x, y, px: x, py: y }
    })
    if (ballRef.current) ballRef.current.style.transform = `translate(${ball.current.x - 22}px, ${ball.current.y - 22}px)`
    ropeRef.current?.setAttribute('d', rope.current.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '))
  }, [])
  useEffect(() => {
    rest()
    window.addEventListener('resize', rest)
    return () => window.removeEventListener('resize', rest)
  }, [rest])

  /* Gaze and swats follow the yarn. */
  const react = useCallback(() => {
    const st = stageRef.current
    const cat = catRef.current
    if (!st || !cat) return
    const s = st.getBoundingClientRect()
    const c = cat.getBoundingClientRect()
    const hx = c.left - s.left + c.width / 2
    const hy = c.top - s.top + c.height * 0.32
    const dx = ball.current.x - hx
    const dy = ball.current.y - hy
    setGaze({ x: Math.max(-1, Math.min(1, dx / 260)), y: Math.max(-1, Math.min(1, dy / 220)) })
    // Within reach of the right paw: swat.
    const px = c.left - s.left + c.width * 0.6
    const py = c.top - s.top + c.height * 0.78
    if (Math.hypot(ball.current.x - px, ball.current.y - py) < c.width * 0.32 && performance.now() > swatCool.current) {
      swatCool.current = performance.now() + 900
      setMoodFor('swat', 320)
      const p = rope.current[1]
      if (p) p.px -= 18 // the thread jumps
    }
  }, [setMoodFor])

  /* The rope: verlet integration, constrained segments, light gravity. */
  useEffect(() => {
    if (!onScreen) return
    let raf = 0
    const step = () => {
      const pts = rope.current
      if (pts.length) {
        pts[0].x = ball.current.x
        pts[0].y = ball.current.y
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i]
          const vx = (p.x - p.px) * (reduced ? 0 : 0.9)
          const vy = (p.y - p.py) * (reduced ? 0 : 0.9)
          p.px = p.x
          p.py = p.y
          p.x += vx
          p.y += vy + (reduced ? 0 : 0.55)
        }
        for (let k = 0; k < 4; k++) {
          for (let i = 1; i < pts.length; i++) {
            const a = pts[i - 1]
            const b = pts[i]
            const dx = b.x - a.x
            const dy = b.y - a.y
            const d = Math.hypot(dx, dy) || 1
            const diff = (d - SEG) / d
            if (i === 1) {
              b.x -= dx * diff
              b.y -= dy * diff
            } else {
              a.x += dx * diff * 0.5
              a.y += dy * diff * 0.5
              b.x -= dx * diff * 0.5
              b.y -= dy * diff * 0.5
            }
          }
        }
        // keep the thread above the floor
        const st = stageRef.current
        if (st) {
          const floor = st.clientHeight - 62
          for (const p of pts) if (p.y > floor) p.y = floor
        }
        const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
        ropeRef.current?.setAttribute('d', d)
      }
      const b = ballRef.current
      if (b) b.style.transform = `translate(${ball.current.x - 22}px, ${ball.current.y - 22}px) rotate(${ball.current.angle}deg)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [onScreen, reduced])

  const moveBall = (x: number, y: number) => {
    const st = stageRef.current
    if (!st) return
    const w = st.clientWidth
    const h = st.clientHeight
    const nx = Math.max(22, Math.min(w - 22, x))
    const ny = Math.max(22, Math.min(h - 78, y))
    ball.current.angle += (nx - ball.current.x) * 2.2
    ball.current.x = nx
    ball.current.y = ny
    react()
  }

  const local = (e: { clientX: number; clientY: number }) => {
    const r = stageRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const HOT = 16 // the ball rides below-right of the pointer, like a cursor's hotspot
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      const p = local(e)
      moveBall(p.x + HOT, p.y + HOT)
    } else if (dragging.current) {
      const p = local(e)
      moveBall(p.x, p.y)
    }
  }
  const dragging = useRef(false)
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button:not(.yarn)')) return
    const p = local(e)
    moveBall(p.x, p.y)
    if (e.pointerType === 'touch' && (e.target as HTMLElement).closest('.yarn')) {
      dragging.current = true
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    }
  }
  const onUp = () => {
    dragging.current = false
  }
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    // Let go: the yarn drops to the floor where it was.
    const st = stageRef.current
    if (st) moveBall(ball.current.x, st.clientHeight - 78)
  }
  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 64 : 24
    const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const m = map[e.key]
    if (!m) return
    e.preventDefault()
    moveBall(ball.current.x + m[0], ball.current.y + m[1])
  }

  const pickTag = (id: TagId) => {
    setBubble({ id, line: t.tags[id].line })
    setSwing(id)
    window.setTimeout(() => setSwing((s) => (s === id ? null : s)), 900)
    setMoodFor(MOOD[id].mood, MOOD[id].ms)
  }

  const toss = (toy: ToyId) => {
    const id = Date.now()
    setTossed((list) => [...list.slice(-3), { id, toy }])
    setLastToss(toy)
    window.setTimeout(() => setMoodFor('swat', 320), reduced ? 0 : 700)
  }

  const issueUrl = (toy: ToyId) =>
    `https://github.com/${profile.toyRepo}/issues/new?${new URLSearchParams({
      title: `[cat-toy] ${toy}`,
      body: `I'm leaving a ${t.toys[toy].toLowerCase()} for the cat.\n\n(Opened from the toy box on ${profile.githubLogin}.github.io. Only the title is read; please keep it as it is.)`,
    }).toString()}`

  return (
    <section id="off-the-runway" className="catstage field field--pink" aria-labelledby="cat-title">
      <div className="wrap section catstage__wrap">
        <div className="catstage__head">
          <h2 id="cat-title" className="title">
            {t.title}
          </h2>
          <p className="catstage__hint">{coarse ? t.hintTouch : t.hintPointer}</p>
        </div>

        <div
          className={`stage ${coarse ? 'is-touch' : ''}`}
          ref={stageRef}
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onLeave}
        >
          <div className="stage__string" aria-hidden="true" />
          <ul className="stage__tags" aria-label={t.title}>
            {TAGS.map((id, i) => (
              <li key={id} className={`stage__tag stage__tag--${i} ${swing === id ? 'is-swinging' : ''}`}>
                <button type="button" className={`swing ${bubble?.id === id ? 'is-on' : ''}`} onClick={() => pickTag(id)} onPointerEnter={() => setSwing(id)}>
                  <span className="swing__hole" aria-hidden="true" />
                  {t.tags[id].label}
                </button>
              </li>
            ))}
          </ul>

          <div className="stage__floor" aria-hidden="true" />

          <div className="stage__cat">
            <Cat ref={catRef} gaze={gaze} mood={mood} label={t.catLabel} />
            {bubble && (
              <p className="stage__bubble" role="status" key={bubble.id + bubble.line}>
                {bubble.line}
              </p>
            )}
          </div>

          {tossed.map((x, i) => (
            <span key={x.id} className="stage__toy" style={{ ['--i' as string]: i }} aria-hidden="true">
              <Toy kind={x.toy} />
            </span>
          ))}

          <svg className="stage__rope" aria-hidden="true" focusable="false">
            <path ref={ropeRef} fill="none" stroke="#C94E16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <button type="button" className="yarn" ref={ballRef} aria-label={t.yarnLabel} onKeyDown={onKey}>
            <Toy kind="yarn" />
          </button>
        </div>

        <div className="toybox">
          <div className="toybox__head">
            <h3 className="toybox__title">{t.boxTitle}</h3>
            <p className="toybox__count">{community.length ? fill(t.boxCount, { n: num(community.length) }) : profile.toysLive ? t.boxEmpty : t.boxPreview}</p>
          </div>
          <div className="toybox__toss" role="group" aria-label={t.toss}>
            <span className="toybox__toss-label">{t.toss}</span>
            {TOYS.map((toy) => (
              <button key={toy} type="button" className="toybox__btn" onClick={() => toss(toy)}>
                <span className="toybox__icon">
                  <Toy kind={toy} />
                </span>
                {t.toys[toy]}
              </button>
            ))}
          </div>
          {lastToss && !profile.toysLive && (
            <p className="toybox__keep" aria-live="polite">
              <span>{t.notLive}</span>
            </p>
          )}
          {lastToss && profile.toysLive && (
            <p className="toybox__keep" aria-live="polite">
              <a className="btn btn--ink" href={issueUrl(lastToss)} target="_blank" rel="noopener">
                {t.keep}
                <IconArrow />
              </a>
              <span>{t.keepNote}</span>
            </p>
          )}
          {community.length > 0 && (
            <ul className="toybox__list">
              {community.slice(0, 12).map((c) => (
                <li key={c.issue}>
                  <span className="toybox__mini">
                    <Toy kind={c.toy} />
                  </span>
                  {fill(t.from, { login: c.login })} · {ago(c.createdAt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
